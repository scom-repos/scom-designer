import {
  Module,
  customElements,
  Styles,
  Panel,
  GridLayout,
  Input,
  ControlElement,
  Container,
  Control,
  IdUtils,
  getCustomElements,
  IconName,
  Menu,
  Link,
  Icon,
  Image,
  Tabs,
  RadioGroup,
  TreeView
} from '@ijstech/components'
import {
  DesignerScreens,
  DesignerComponents,
  DesignerProperties,
  DesignerPickerComponents,
  DesignerPickerBlocks
} from './components/index'
import { IComponent, IComponentItem, IComponentPicker, IControl, IScreen, IStudio } from './interface'
import { customLabelTabStyled, labelActiveStyled } from './index.css'
import {
  blockComponents
} from './data'
import { borderRadiusLeft, borderRadiusRight } from './tools/index'
import { Parser } from "@ijstech/compiler";
import { parseProps } from './helpers/utils'

const Theme = Styles.Theme.ThemeVars

enum TABS {
  RECENT,
  BITS,
  BLOCKS,
}

export function createControl(parent: Control, name: string, options?: any): Control {
  const controlConstructor: any = window.customElements.get(name);
  if (name === 'i-stack') {
    options = options || {};
    options = {direction: 'vertical', ...options};
  }
  const control: Control = new controlConstructor(parent, options);
  if (options) control._setDesignProps(options);
  return control;
}

export function addControl(parent: any, name: string, options?: any) {
  const control = parent.add(options);
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
    resizer.className = "i-resizer " + className;
  }
  hideResizers() {
    this.resizers.forEach(resizer => this._control?.contains(resizer) && this._control.removeChild(resizer));
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

interface ScomDesignerFormElement extends ControlElement {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-designer--form']: ScomDesignerFormElement
    }
  }
}

@customElements('i-scom-designer--form')
export class ScomDesignerForm extends Module {
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

  private pathMapping: Map<string, IControl> = new Map();
  private mouseDown: boolean = false;
  private resizing: boolean = false;
  private resizerPos: string = "";
  private mouseDownPos: { x: number; y: number };
  private recentComponents: IComponent[] = [];
  private _rootComponent: IComponent
  private selectedComponent: IControl

  selectedControl: IControl
  modified: boolean;
  studio: IStudio;

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    this.onPropertiesChanged = this.onPropertiesChanged.bind(this);
    this.onDeleteComponent = this.onDeleteComponent.bind(this);
    this.onVisibleComponent = this.onVisibleComponent.bind(this);
  }

  static async create(options?: ScomDesignerFormElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  setData() {}

  get pickerComponentsFiltered() {
    let components: IComponentPicker[]
    if (this.currentTab === TABS.RECENT) {
      components = [{
        name: 'Frequently Used',
        tooltipText: 'Components that you use most frequently',
        items: [...this.recentComponents]
      }]
    } else {
      components = [
        {
          name: 'Basic',
          tooltipText: 'The most simple & essential components to build a screen',
          items: this.getComponents()
        }
      ]
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

  private getComponents() {
    let result: IComponentItem[] = [];
    let components = getCustomElements();
    for (let name in components) {
      const component = components[name];
      const icon: any = component?.icon as IconName;
      const className = component?.className;
      if (icon && className) {
        result.push({
          ...component,
          icon,
          path: '',
          name: component.tagName
        })
      }
    }
    return result;
  }

  get pickerBlocksFiltered() {
    if (this.inputSearch.value) {
      return blockComponents.filter((v) =>
        v.caption.toLowerCase().includes(this.inputSearch.value.toLowerCase())
      )
    }
    return blockComponents
  }

  get rootComponent(): Parser.IComponent {
    return this._rootComponent;
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

  private onVisibleComponent(component: IComponent, visible: boolean) {
    const path = component.path;
    if (path) {
      const control = this.pathMapping.get(path);
      if (control?.control) {
        control.control.visible = visible;
        control.control._setDesignPropValue("visible", visible);
        control.props.visible = `{${visible}}`;
      }
    }
  }

  private onDeleteComponent(component: IComponent) {
    const path = component.path;
    if (path) {
      const control = this.pathMapping.get(path);
      if (control?.control) {
        control.control.remove();
        this.pathMapping.delete(path);
      }
    }
  }

  private renderComponent(parent: Control, component: IControl, select?: boolean) {
    if (!component?.name) return;
    let control = this.renderControl(parent, component);
    if (!control) return;
    if (!control.style.position) control.style.position = "relative";
    (component as IControl).control = control;
    this.bindControlEvents(component as IControl);
    control.tag = new ControlResizer(control);
    component.items?.forEach(item => this.renderComponent(control, {...item, control: null}));
    this.pathMapping.set(component.path, {...component});
    if (select) this.handleSelectControl(component);
  }

  private renderControl(parent: Control, component: IControl) {
    const options = parseProps(component.props);
    let control = null;
    let isTab = component.name === 'i-tab' && parent instanceof Tabs;
    let isMenu = component.name === 'i-menu-item' && parent instanceof Menu;
    let isRadio = component.name === 'i-radio' && parent instanceof RadioGroup;
    let isTree = component.name === 'i-tree-node' && parent instanceof TreeView;
    if (isTab || isMenu || isRadio || isTree) {
      control = (parent as any).add(options);
    } else {
      control = createControl(parent, component.name, options);
    }
    return control;
  }

  private isParentGroup(control: Control) {
    return control instanceof Container ||
      control instanceof Tabs ||
      control instanceof Menu ||
      control instanceof RadioGroup ||
      control instanceof TreeView;
  }

  private bindControlEvents(control: IControl) {
    control.control.onclick = event => {
      if (this.isParentGroup(control.control)) {
        let com = this.handleAddControl(event, control.control);
        if (com) {
          control.items = control.items || [];
          control.items.push(com);
          this.updateStructure();
        }
      }
    };
    control.control.onMouseDown = () => this.handleSelectControl(control);
    control.control.onDblClick = (target, event) => {
      event?.stopPropagation();
      let id = control.control.id;
      if (id) {
        let name = control.control._getDesignPropValue("onClick") as string;
        if (!name) {
          this.modified = true;
          control.control._setDesignPropValue("onClick", `{this.${id}Click}`);
          this.studio.addEventHandler(this, "onClick", `${id}Click`);
        } else if (name.startsWith("{this."))
          this.studio.addEventHandler(this, "onClick", name.substring(6, name.length - 1));
      }
    };
  }

  private handleSelectControl(target: IControl) {
    if (this.selectedControl) this.selectedControl.control.tag.hideResizers();
    this.selectedControl = target;
    this.selectedControl.control.tag.showResizers();
    this.designerComponents.activeComponent = this.selectedControl;
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
    if (this.selectedComponent) {
      let com: IControl = {
        name: this.selectedComponent.name,
        path: IdUtils.generateUUID(),
        props: {
          width: `{${100}}`,
          height: `{${20}}`
        },
        control: null
      };
      if (parent) {
        this.renderComponent(parent, com, true);
      } else {
        com.props = {
          ...com.props,
          left: `{${pos.x}}`,
          top: `{${pos.y}}`,
        }
        this.renderComponent(this.pnlFormDesigner, com, true);
        if (!this._rootComponent.items) this._rootComponent.items = []!
        this._rootComponent.items.push(com);
        this.updateStructure();
      }
      this.selectedComponent.control.classList.remove("selected");
      this.selectedComponent = null;
      return com;
    }
  }

  private updateStructure() {
    this.designerComponents.screen = {
      ...this.designerComponents.screen,
      elements: [this._rootComponent]
    }
  }

  private initComponentPicker() {
    const nodeItems: HTMLElement[] = []
    const components = this.pickerComponentsFiltered;
    for (const picker of components) {
      const pickerElm = new DesignerPickerComponents(undefined, {
        ...picker,
        display: 'block',
        margin: { bottom: 1 },
        onSelect: (target: Control, component: IComponentItem) => {
          if (this.selectedComponent?.control)
            this.selectedComponent.control.classList.remove("selected");
          this.selectedComponent = { ...component, control: target } as any;
          this.selectedComponent.control.classList.add("selected");
          const finded = this.recentComponents.find(x => x.name === this.selectedComponent.name);
          if (!finded) {
            this.recentComponents.push(this.selectedComponent);
          }
        }
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

  private initDesignerProperties() {
    if (this.selectedControl)
      this.designerProperties.component = this.selectedControl;
  }

  private onPropertiesChanged(prop: string, value: any) {
    this.modified = true;
    const control = this.selectedControl.control
    control._setDesignPropValue(prop, value);
    if (prop === 'link' && value.href) {
      const linkEl = new Link(control, value);
      control[prop] = linkEl;
    } else if (prop.includes('icon') && (value.name || value.image?.url)) {
      const iconEl = new Icon(control, {width: '1rem', height: '1rem', display: 'flex', ...value});
      control[prop] = iconEl;
    } else if (prop === 'image' && value.url) {
      const imageEl = new Image(control, {width: '1rem', height: '1rem', display: 'flex', ...value});
      control[prop] = imageEl;
    }
    let props = this.selectedControl.control._getCustomProperties();
    let property = props.props[prop];
    let valueStr = '';
    if (property) {
      switch (property.type) {
        case "number": {
          valueStr = typeof value === 'number' || value === undefined ? "{" + value + "}" : "'" + value + "'";
          break;
        }
        case "string": {
          valueStr = "'" + value + "'";
          break;
        }
        case "boolean": {
          valueStr = "{" + value + "}";
          break;
        }
        case "object": {
          valueStr = `{${JSON.stringify(value)}}`;
          break;
        }
        case "array": {
          valueStr = `{${JSON.stringify(value)}}`;
          break;
        }
      }
      this.selectedControl.props[prop] = valueStr;
    }
  }

  private updatePath(items: Parser.IComponent[]) {
    return [...items].map((item) => {
      (item as IComponent).path = IdUtils.generateUUID();
      if (item.items?.length) {
        item.items = this.updatePath(item.items);
      }
      return item;
    })
  }

  renderUI(root: Parser.IComponent) {
    if (root?.items?.length) {
      root.items = this.updatePath(root.items);
    }
    this._rootComponent = {...root, path: IdUtils.generateUUID()} as IComponent;
    this.pnlFormDesigner.clearInnerHTML();
    if (this._rootComponent) {
      this.designerComponents.screen = {
        name: 'Screen',
        id: IdUtils.generateUUID(),
        elements: [this._rootComponent]
      }
      this.renderComponent(this.pnlFormDesigner, {
        ...this._rootComponent,
        control: null
      });
    }
  }

  private handleControlMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      let mouseMovePos = { x: event.clientX, y: event.clientY };
      let mouseMoveDelta = { x: mouseMovePos.x - this.mouseDownPos.x, y: mouseMovePos.y - this.mouseDownPos.y };
      this.mouseDownPos = mouseMovePos;
      const currentControl = this.selectedControl?.control;
      if (!currentControl) return;
      if (this.resizing) {
        this.modified = true;
        switch (this.resizerPos) {
          case "tl": {
            let left = (currentControl.left as number) + mouseMoveDelta.x;
            let top = (currentControl.top as number) + mouseMoveDelta.y;
            let width = (currentControl.width as number) - mouseMoveDelta.x;
            let height = (currentControl.height as number) - mouseMoveDelta.y;
            this.updatePosition({ left, top, width, height })
            break;
          }
          case "tm": {
            let top = (currentControl.top as number) + mouseMoveDelta.y;
            let height = (currentControl.height as number) - mouseMoveDelta.y;
            this.updatePosition({ top, height })
            this.updatePosition({ top, height })
            break;
          }
          case "tr": {
            let top = (currentControl.top as number) + mouseMoveDelta.y;
            let width = (currentControl.width as number) + mouseMoveDelta.x;
            let height = (currentControl.height as number) - mouseMoveDelta.y;
            this.updatePosition({ top, width, height })
            break;
          }
          case "ml": {
            let left = (currentControl.left as number) + mouseMoveDelta.x;
            let width = (currentControl.width as number) - mouseMoveDelta.x;
            this.updatePosition({ left, width })
            break;
          }
          case "mr": {
            let width = (currentControl.width as number) + mouseMoveDelta.x;
            this.updatePosition({ width })
            break;
          }
          case "bl": {
            let left = (currentControl.left as number) + mouseMoveDelta.x;
            let width = (currentControl.width as number) - mouseMoveDelta.x;
            let height = (currentControl.height as number) + mouseMoveDelta.y;
            this.updatePosition({ left, width, height })
            break;
          }
          case "bm": {
            let height = (currentControl.height as number) + mouseMoveDelta.y;
            this.updatePosition({ height })
            break;
          }
          case "br": {
            let width = (currentControl.width as number) + mouseMoveDelta.x;
            let height = (currentControl.height as number) + mouseMoveDelta.y;
            this.updatePosition({ width, height })
            break;
          }
        }
      } else {
        if (Math.abs(mouseMoveDelta.x) > 10 || Math.abs(mouseMoveDelta.y) > 10) {
          let left = (currentControl.left as number) + mouseMoveDelta.x;
          let top = (currentControl.top as number) + mouseMoveDelta.y;
          this.updatePosition({ left, top })
        }
      }
    }
  }

  private updatePosition(value: any) {
    for (let prop in value) {
      if (value.hasOwnProperty(prop)) {
        this.onPropertiesChanged(prop, value[prop]);
      }
    }
  }

  private initEvents() {
    this.pnlFormDesigner.onmouseleave = event => {
      this.mouseDown = false;
    };
    this.pnlFormDesigner.onmousedown = event => {
      this.mouseDown = true;
      this.mouseDownPos = { x: event.clientX, y: event.clientY };
      let elm = event.target as HTMLElement;
      const resizers = elm.querySelectorAll('.i-resizer');
      let currentResizer = null;
      for (let i = 0; i < resizers.length; i++) {
        const resizer = resizers[i] as HTMLElement;
        const resizerRect = resizer.getBoundingClientRect();
        if (resizerRect.left <= event.clientX && event.clientX <= resizerRect.right && resizerRect.top <= event.clientY && event.clientY <= resizerRect.bottom) {
          currentResizer = resizer;
          break;
        }
      }
      if (currentResizer) {
        this.resizing = currentResizer.classList?.contains("i-resizer");
        this.resizerPos = currentResizer.className?.split(" ")[1];
      } else {
        this.resizing = false;
        this.resizerPos = '';
      }
    };
    this.pnlFormDesigner.onclick = this.handleAddControl.bind(this);
    this.pnlFormDesigner.onmouseup = event => {
      this.mouseDown = false;
    };
    this.pnlFormDesigner.onmousemove = this.handleControlMouseMove.bind(this);
  }

  init() {
    super.init()
    this.wrapperComponentPicker.style.borderBottom = 'none'
    this.initComponentPicker()
    this.initBlockPicker()
    this.initDesignerProperties()
    this.initEvents()
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
              minHeight={160}
              onScreenChanged={this.onScreenChanged}
              onScreenHistoryShown={this.onScreenHistoryShown}
              visible={false}
            />
            <designer-components
              id='designerComponents'
              height='100%'
              minHeight={200}
              onShowComponentPicker={this.onShowComponentPicker}
              onSelect={this.onSelectComponent}
              onVisible={this.onVisibleComponent}
              onDelete={this.onDeleteComponent}
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
            overflow={{y: 'auto'}}
            background={{ color: "gray" }}
          ></i-panel>
          <designer-properties
            id='designerProperties'
            display='flex'
            onChanged={this.onPropertiesChanged}
          />
        </i-hstack>
      </i-vstack>
    )
  }
}
