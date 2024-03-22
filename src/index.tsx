import {
  Module,
  customElements,
  Styles,
  Panel,
  GridLayout,
  Input,
  ControlElement,
  Container,
  Control
} from '@ijstech/components'
import {
  DesignerScreens,
  DesignerComponents,
  DesignerProperties,
  DesignerPickerComponents,
  DesignerPickerBlocks
} from './components/index'
import { IComponent, IComponentPicker, IControl, IScreen } from './interface'
import { customLabelTabStyled, labelActiveStyled } from './index.css'
import {
  blockComponents,
  pickerComponents,
  recentComponents,
  screen,
} from './data'
import { borderRadiusLeft, borderRadiusRight } from './tools/index'
import { IFileHandler, IIPFSData } from '@scom/scom-storage';
import { Compiler } from "@ijstech/compiler";
import * as Dts from "./types/index";

const Theme = Styles.Theme.ThemeVars

enum TABS {
  RECENT,
  BITS,
  BLOCKS,
}

export function createControl(parent: Control, name: string, options?: any): Control {
  const controlConstructor: any = window.customElements.get(name);
  const control: Control = new controlConstructor(parent, options);
  if (options) {
    control._setDesignProps(options);
  }
  return control;
}

class ControlResizer {
  private _control: Control;
  private resizers: HTMLElement[] = [];
  constructor(control: Control) {
    this._control = control;
  }
  addResizer(className: string) {
    let resizer = document.createElement("div");
    this._control.appendChild(resizer);
    this.resizers.push(resizer);
    resizer.className = className;
    resizer.className = "i-resizer " + className;
  }
  hideResizers() {
    this.resizers.forEach(resizer => this._control.removeChild(resizer));
    this.resizers = [];
  }
  showResizers() {
    if (this.resizers.length == 0) {
      this.addResizer("tl");
      this.addResizer("tm");
      this.addResizer("tr");
      this.addResizer("ml");
      this.addResizer("mr");
      this.addResizer("bl");
      this.addResizer("bm");
      this.addResizer("br");
    }
  }
}

interface ScomDesignerElement extends ControlElement {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-designer']: ScomDesignerElement
    }
  }
}

@customElements('i-scom-designer')
export class ScomDesigner extends Module implements IFileHandler {
  private designerScreens: DesignerScreens
  private designerComponents: DesignerComponents
  private designerProperties: DesignerProperties
  private pnlComponentPicker: Panel
  private pnlBlockPicker: Panel
  private wrapperComponentPicker: Panel
  private wrapperTab: GridLayout
  private inputSearch: Input
  private currentTab = TABS.BITS
  private pnlFormDesigner: Panel
  private selectedDesignComponent: IControl
  private selectedControl: IControl
  private _rootComponent: IComponent

  private compiler: Compiler;
  private pathMapping: Map<string, IControl> = new Map();

  constructor(parent?: Container, options?: any) {
    super(parent, options)
  }

  static async create(options?: ScomDesignerElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get pickerComponentsFiltered() {
    let components: IComponentPicker[]
    if (this.currentTab === TABS.RECENT) {
      components = recentComponents
    } else {
      components = pickerComponents
    }
    if (this.inputSearch.value) {
      const val = this.inputSearch.value.toLowerCase()
      components = components
        .map((component) => {
          const filteredItems = component.items.filter((item) =>
            item.name.toLowerCase().includes(val)
          )
          return {
            ...component,
            items: filteredItems,
          }
        })
        .filter((component) => component.items.length > 0)
    }
    return components
  }

  get pickerBlocksFiltered() {
    if (this.inputSearch.value) {
      return blockComponents.filter((v) =>
        v.caption.toLowerCase().includes(this.inputSearch.value.toLowerCase())
      )
    }
    return blockComponents
  }

  clear() {
    this.pathMapping = new Map();
  }

  private onScreenChanged(screen: IScreen) {}

  private onScreenHistoryShown(shown: boolean) {
    this.designerComponents.visible = !shown
    this.designerScreens.height = shown ? '100%' : '40%'
  }

  private onTabChanged(value: number) {
    if (this.currentTab === value) return
    for (let i = 0; i < this.wrapperTab.children.length; i++) {
      if (value === i) {
        this.wrapperTab.children[i].classList.add(labelActiveStyled)
      } else {
        this.wrapperTab.children[i].classList.remove(labelActiveStyled)
      }
    }
    this.currentTab = value
    const isBlock = value === TABS.BLOCKS
    if (isBlock) {
      this.initBlockPicker()
    } else {
      this.initComponentPicker()
    }
    this.pnlComponentPicker.visible = !isBlock
    this.pnlBlockPicker.visible = isBlock
  }

  private onFilterComponent() {
    if (this.currentTab === TABS.BLOCKS) {
      this.initBlockPicker()
    } else {
      this.initComponentPicker()
    }
  }

  private onShowComponentPicker() {
    this.wrapperComponentPicker.visible = true
  }

  private onSelectComponent(component: IComponent) {
    const path = component.path;
    if (path) {
      const control = this.pathMapping.get(path);
      if (control) this.handleSelectControl(control);
    }
  }

  private renderComponent(parent: Control, component: IControl, select?: boolean) {
    if (!component?.name) return;
    let control = createControl(parent, component.name, component.props);
    if (!control.style.position) control.style.position = "relative";

    (component as IControl).control = control;
    this.bindControlEvents(component as IControl);
    control.tag = new ControlResizer(control);
    component.items?.forEach(item => this.renderComponent(control, {...item, control: null}));
    this.pathMapping.set(component.path, {...component});
    if (select) this.handleSelectControl(component);
  }

  private bindControlEvents(control: IControl) {
    control.control.onclick = event => {
      if (control.control instanceof Container) {
        let com = this.handleAddControl(event, control.control);
        if (com) {
          control.items = control.items || [];
          control.items.push(com);
        }
      }
    };
    control.control.onMouseDown = () => this.handleSelectControl(control);
    control.control.onDblClick = (target, event) => {
      event?.stopPropagation();
      let id = control.control.id;
      if (id) {
        // let name = control.control._getDesignPropValue("onClick");
        // if (!name) {
        //   this.modified = true;
        //   control.control._setDesignPropValue("onClick", `{this.${id}Click}`);
        //   this.studio.addEventHandler(this, "onClick", `${id}Click`);
        // } else if (name.startsWith("{this."))
        //   this.studio.addEventHandler(this, "onClick", name.substring(6, name.length - 1));
      }
    };
  }

  private handleSelectControl(target: IControl) {
    if (this.selectedControl) this.selectedControl.control.tag.hideResizers();
    this.selectedControl = target;
    this.selectedControl.control.tag.showResizers();
    this.showDesignProperties();
  }

  private showDesignProperties() {
    if (!this.selectedControl) return;
    this.designerProperties.component = this.selectedControl;
  }

  private onCloseComponentPicker() {
    this.wrapperComponentPicker.visible = false
  }

  private handleAddControl(event: MouseEvent, parent?: Control) {
    event.stopPropagation();
    let pos = { x: event.offsetX, y: event.offsetY };
    if (this.selectedDesignComponent) {
      let com: IControl = {
        name: this.selectedDesignComponent.name,
        path: '',
        props: {
          left: `{${pos.x}}`,
          top: `{${pos.y}}`,
          width: `{${40}}`,
          height: `{${20}}`,
        },
        control: null
      };
      if (parent) {
        this.renderComponent(parent, com, true);
      } else {
        this.renderComponent(this.pnlFormDesigner, com, true);
        this._rootComponent.items.push(com);
      }
      this.selectedDesignComponent.control.classList.remove("selected");
      this.selectedDesignComponent = null;
      return com;
    }
  }

  private initComponentPicker() {
    const nodeItems: HTMLElement[] = []
    for (const picker of this.pickerComponentsFiltered) {
      const pickerElm = new DesignerPickerComponents(undefined, {
        ...picker,
        display: 'block',
        margin: { bottom: 1 },
      })
      nodeItems.push(pickerElm)
    }
    this.pnlComponentPicker.clearInnerHTML()
    this.pnlComponentPicker.append(...nodeItems)
  }

  private initBlockPicker() {
    const pickerElm = new DesignerPickerBlocks(undefined, {
      items: this.pickerBlocksFiltered,
    })
    this.pnlBlockPicker.clearInnerHTML()
    this.pnlBlockPicker.append(pickerElm)
  }

  private initComponentScreen() {
    const newScreen = this.parseScreen;
    this.designerComponents.screen = newScreen
    this._rootComponent = newScreen?.elements[0];
    if (this._rootComponent) {
      this.renderComponent(this.pnlFormDesigner, {
        ...this._rootComponent,
        control: null
      });
    }
  }

  private get parseScreen() {
    const clonedScreen = JSON.parse(JSON.stringify(screen));
    if (clonedScreen?.elements?.length) {
      clonedScreen.elements = this.parseComponents(clonedScreen.elements)
    }
    return clonedScreen;
  }

  private parseComponents(elements: IComponent[]) {
    return elements.map(element => {
      const parserComp = this.getParserComponent(element)
      element = {...element, ...parserComp}
      if (element.items?.length) {
        element.items = this.parseComponents(element.items)
      }
      return element
    })
  }

  private getParserComponent(component: IComponent) {
    if (component.name === 'View') {
      return {
        name: "i-panel",
        props: {
          width: '500px',
          height: '600px',
          background: {
            color: '#ffffff'
          }
        }
      }
    } else {
      return {
        name: "i-button",
        props: {
          width: '20%',
          height: '50px',
          top: '10px',
          left: '220px',
          caption: 'Button',
          background: {
            color: '#0000ff'
          }
        }
      }
    }
  }

  private initDesignerProperties() {
    // TODO
    if (this.selectedControl)
      this.designerProperties.component = this.selectedControl;
  }

  private renderUI() {
    this.initComponentPicker()
    this.initBlockPicker()
    this.initComponentScreen()
    this.initDesignerProperties()
  }

  init() {
    super.init()
    this.wrapperComponentPicker.style.borderBottom = 'none'
    if (!this.compiler) this.compiler = new Compiler();
    this.compiler.addPackage("@ijstech/components", { dts: {'index.d.ts': Dts.components} });
    this.renderUI()
  }

  async openFile(file: IIPFSData, endpoint: string, parentCid: string, parent: Control) {
    parent.append(this);
    const path = file.path.startsWith('/') ? file.path.slice(1) : file.path;
    const mediaUrl = `${endpoint}/ipfs/${parentCid}/${path}`;
    console.log('Open: ', mediaUrl)
    // TODO: fetch data
  }

  render() {
    return (
      <i-vstack
        width='100%'
        height='100%'
        maxWidth={Theme.layout.container.maxWidth}
        margin={{ left: 'auto', right: 'auto' }}
        position='relative'
      >
        <i-hstack width='100%' height='100%'>
          <i-vstack
            width='100%'
            height='100%'
            border={{
              top: { width: 1, style: 'solid', color: Theme.divider },
            }}
            maxWidth={300}
          >
            <designer-screens
              id='designerScreens'
              height='40%'
              minHeight={160}
              onScreenChanged={this.onScreenChanged}
              onScreenHistoryShown={this.onScreenHistoryShown}
            />
            <designer-components
              id='designerComponents'
              height='60%'
              minHeight={200}
              onShowComponentPicker={this.onShowComponentPicker}
              onSelect={this.onSelectComponent}
            />
          </i-vstack>
          <i-vstack
            id='wrapperComponentPicker'
            visible={false}
            width={250}
            height='100%'
            border={{
              width: 1,
              style: 'solid',
              color: Theme.divider,
              bottom: { width: 0 },
            }}
            background={{ color: Theme.background.main }}
            overflow='auto'
          >
            <i-vstack
              gap={12}
              padding={{ top: 12, bottom: 12, left: 8, right: 8 }}
              border={{
                bottom: { width: 1, style: 'solid', color: Theme.divider },
              }}
            >
              <i-hstack
                gap={8}
                verticalAlignment='center'
                horizontalAlignment='space-between'
              >
                <i-label
                  caption='Add Components'
                  font={{ size: '0.75rem', bold: true }}
                />
                <i-icon
                  name='times'
                  width={14}
                  height={14}
                  cursor='pointer'
                  onClick={this.onCloseComponentPicker}
                />
              </i-hstack>
              <i-grid-layout
                id='wrapperTab'
                width='100%'
                background={{ color: Theme.action.hoverBackground }}
                templateColumns={['1fr', '1fr', '1fr']}
                class={`${borderRadiusLeft} ${borderRadiusRight}`}
              >
                <i-label
                  caption='Recent'
                  class={`${customLabelTabStyled} ${borderRadiusLeft}`}
                  onClick={() => this.onTabChanged(TABS.RECENT)}
                />
                <i-label
                  caption='Bits'
                  class={`${customLabelTabStyled} ${labelActiveStyled}`}
                  border={{
                    radius: 0,
                    left: { width: 1, style: 'solid', color: Theme.divider },
                    right: { width: 1, style: 'solid', color: Theme.divider },
                  }}
                  onClick={() => this.onTabChanged(TABS.BITS)}
                />
                <i-label
                  caption='Blocks'
                  class={`${customLabelTabStyled} ${borderRadiusRight}`}
                  onClick={() => this.onTabChanged(TABS.BLOCKS)}
                />
              </i-grid-layout>
              <i-input
                id='inputSearch'
                placeholder='Search'
                width='100%'
                height={24}
                border={{
                  radius: 8,
                  width: 0,
                }}
                padding={{ left: 4, right: 4 }}
                font={{ size: '0.75rem' }}
                onChanged={this.onFilterComponent}
              />
            </i-vstack>
            <i-panel id='pnlComponentPicker' width='100%' />
            <i-panel id='pnlBlockPicker' width='100%' visible={false} />
          </i-vstack>
          <i-panel
            id="pnlFormDesigner"
            stack={{grow: '1'}}
            background={{ color: "gray" }}
          ></i-panel>
          <designer-properties
            id='designerProperties'
            display='flex'
          />
        </i-hstack>
      </i-vstack>
    )
  }
}
