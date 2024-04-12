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
  TreeView,
  Modal,
  VStack
} from '@ijstech/components'
import {
  DesignerScreens,
  DesignerComponents,
  DesignerProperties,
  DesignerPickerComponents,
  DesignerPickerBlocks
} from './components/index'
import { IComponent, IComponentItem, IComponentPicker, IControl, IScreen, IStudio } from './interface'
import { customLabelTabStyled, customTransition, labelActiveStyled } from './index.css'
import {
  blockComponents
} from './data'
import { borderRadiusLeft, borderRadiusRight } from './tools/index'
import { Parser } from "@ijstech/compiler";
import { parseProps } from './helpers/utils'
import { GroupMetadata, breakpointsMap, getDefaultMediaQuery, getMediaQueries } from './helpers/config'
import { getBreakpoint } from './helpers/store'

const Theme = Styles.Theme.ThemeVars

enum TABS {
  RECENT,
  BITS,
  BLOCKS,
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
  private mdPicker: Modal
  private designerWrapper: VStack
  private pnlScreens: Panel
  private pnlProperties: Panel

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
    this.onControlEventChanged = this.onControlEventChanged.bind(this);
    this.onControlEventDblClick = this.onControlEventDblClick.bind(this);
    this.onDeleteComponent = this.onDeleteComponent.bind(this);
    this.onVisibleComponent = this.onVisibleComponent.bind(this);
    this.handleBreakpoint = this.handleBreakpoint.bind(this);
    this.onUpdateDesigner = this.onUpdateDesigner.bind(this);
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
      const group = this.getComponents();
      components = Object.values(group);
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
    let result: {[name: string]: IComponentPicker} = {};
    for (let group in GroupMetadata) {
      result[group] = {...GroupMetadata[group], items: []};
    }
    let components = getCustomElements();
    for (let name in components) {
      const component = components[name];
      const icon: any = component?.icon as IconName;
      const className = component?.className;
      const group = component?.group ?? 'Basic';
      if (icon && className) {
        result[group]['items'].push({
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

  get breakpointProps() {
    const breakpoint = getBreakpoint();
    return this.selectedControl?.control?._getDesignPropValue('mediaQueries')?.[breakpoint]?.properties || {};
  }

  private createControl(parent: Control, name: string, options?: any): Control {
    const controlConstructor: any = window.customElements.get(name);
    options = options || {}
    if (name === 'i-stack') {
      options = {direction: 'vertical', ...options};
    }
    const newOptions = (({ mediaQueries, ...o }) => o)(JSON.parse(JSON.stringify(options)));
    const control: Control = new controlConstructor(parent, {...newOptions});
    const breakpointProps = options.mediaQueries?.[getBreakpoint()]?.properties;
    control._setDesignProps(options, breakpointProps);
    return control;
  }

  private updateDesignProps(component: Parser.IComponent) {
    if (!component) return;
    const control = this.pathMapping.get((component as IComponent).path);
    const props = JSON.parse(JSON.stringify(control?.control?._getDesignProps() || '{}'));
    const customProps = control?.control?._getCustomProperties()?.props || {};
    const newProps: any = {};
    for (let prop in props) {
      const defaultValue = customProps[prop]?.default;
      if (prop === 'mediaQueries') {
        props[prop] = props[prop].filter(v => (v && Object.keys(v.properties).length > 0));
        if (props[prop].length === 0) {
          continue;
        }
      }
      if (this.isSameValue(defaultValue, props[prop])) {
        continue;
      }
      newProps[prop] = this.formatDesignProp(prop, props[prop], control);
    }
    component.props = {...newProps};
    component.items?.forEach(item => {
      this.updateDesignProps(item);
    });
  }

  private isSameValue(defaultVal: any, value: any) {
    if (defaultVal === value) return true;
    if (typeof defaultVal === 'object' && typeof value === 'object') {
      return JSON.stringify(defaultVal) === JSON.stringify(value);
    }
    return false;
  }

  private formatDesignProp(prop: string, value: any, control: IControl) {
    if (value === undefined) return `{undefined}`;
    let props = control.control._getCustomProperties();
    let property = props.props[prop];
    let valueStr = value;
    if (property) {
      switch (property.type) {
        case "number": {
          valueStr = typeof value === 'number' ? "{" + value + "}" : "'" + value + "'";
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
      control.props[prop] = valueStr;
    } else if (props.events[prop]) {
      valueStr = "{" + value + "}";
    }
    return valueStr;
  }

  get rootComponent(): Parser.IComponent {
    this.updateDesignProps(this._rootComponent);
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
    this.mdPicker.linkTo = this.pnlScreens;
    this.mdPicker.height = this.designerComponents.height;
    this.mdPicker.visible = true;
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
        let mediaQueries = control?.control._getDesignPropValue('mediaQueries');
        if (!mediaQueries) mediaQueries = [];
        const breakpoint = getBreakpoint();
        if (!mediaQueries[breakpoint]) mediaQueries[breakpoint] = getDefaultMediaQuery(breakpoint);
        mediaQueries[breakpoint]['properties']['visible'] = visible;
        control.control._setDesignPropValue("mediaQueries", mediaQueries);
        control.control._setDesignPropValue("visible", true, visible);
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
    control.onclick = null;
    this.bindControlEvents(component as IControl);
    control.tag = new ControlResizer(control);
    component.items?.forEach(item => this.renderComponent(control, {...item, control: null}));
    this.pathMapping.set(component.path, {...component});
    const beforeSelected = this.selectedControl?.path;
    if (select || (beforeSelected && beforeSelected === component.path)) this.handleSelectControl(component);
  }

  private renderControl(parent: Control, component: IControl) {
    const options: any = parseProps(component.props);
    let control = null;
    let isTab = component.name === 'i-tab' && parent instanceof Tabs;
    let isMenu = component.name === 'i-menu-item' && parent instanceof Menu;
    let isRadio = component.name === 'i-radio' && parent instanceof RadioGroup;
    let isTree = component.name === 'i-tree-node' && parent instanceof TreeView;
    if (isTab || isMenu || isRadio || isTree) {
      control = (parent as any).add({...(options || {})});
    } else {
      control = this.createControl(parent, component.name, options);
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
    control.control.onclick = (event) => {
      if (this.isParentGroup(control.control)) {
        const com = this.handleAddControl(event, control.control);
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
      const id = control.control.id;
      if (id) {
        const name = control.control._getDesignPropValue("onClick") as string;
        if (!name) {
          this.modified = true;
          control.control._setDesignPropValue("onClick", `this.${id}Click`);
          this.studio.addEventHandler(this, "onClick", `${id}Click`);
        } else if (name.startsWith("this."))
          this.studio.addEventHandler(this, "onClick", name.substring(5));
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
    this.designerProperties.component = this.selectedControl;
  }

  private onCloseComponentPicker() {
    this.mdPicker.visible = false
  }

  private handleAddControl(event: MouseEvent, parent?: Control) {
    event.stopPropagation();
    this.modified = true;
    let pos = { x: event.offsetX, y: event.offsetY };
    if (this.selectedComponent) {
      let com: IControl = {
        name: this.selectedComponent.name,
        path: IdUtils.generateUUID(),
        props: {
          width: `{${100}}`,
          height: `{${20}}`,
          mediaQueries: `{${JSON.stringify(getMediaQueries())}}`
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
        if (!this._rootComponent.items) this._rootComponent.items = [];
        this._rootComponent.items.push(com);
        this.updateStructure();
      }
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
          this.onCloseComponentPicker();
          this.selectedComponent = { ...component, control: target } as any;
          const finded = this.recentComponents.find(x => x.name === component.name);
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

  private onPropertiesChanged(prop: string, value: any, mediaQueryProp?: string) {
    const control = this.selectedControl?.control
    if (!control) return;
    this.modified = true;
    const oldVal: any = control._getDesignPropValue(prop);
    const breakpointProps = this.breakpointProps;
    const hasProp = Object.hasOwnProperty.call(breakpointProps, prop);
    control._setDesignPropValue(prop, value, hasProp ? breakpointProps[prop] : undefined);
    if (mediaQueryProp) {
      const designProp = control._getDesignPropValue(mediaQueryProp);
      control._setDesignPropValue(mediaQueryProp, designProp, breakpointProps[mediaQueryProp]);
    }
    if (prop.includes('icon') &&this.selectedControl?.name === 'i-combo-box' && (!value.name && !value.image?.url)) {
      value.name = 'angle-down';
    }
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
    if (prop === "id" && oldVal !== value) this.studio.renameComponent(this, oldVal, value);
  }

  private onControlEventChanged(prop: string, newValue: string, oldValue: string) {
    if (this.selectedControl?.control && oldValue !== newValue) {
      this.modified = true;
      this.selectedControl.control._setDesignPropValue(prop, `this.${newValue}`);
      if (oldValue) this.studio.renameEventHandler(this, oldValue, newValue);
      else this.studio.addEventHandler(this, prop, `${newValue}`);
    }
  }

  private onControlEventDblClick(funcName: string) {
    if (funcName) {
      this.studio.locateMethod(this, funcName);
    }
  }

  renderUI(root: IComponent) {
    this.selectedControl = null;
    this._rootComponent = root;
    this.designerComponents.screen = {
      name: 'Screen',
      id: '',
      elements: [this._rootComponent]
    }
    this.onUpdateDesigner();
    this.designerProperties.clear();
  }

  private onUpdateDesigner() {
    this.pnlFormDesigner.clearInnerHTML();
    this.pathMapping = new Map();
    this.renderComponent(this.pnlFormDesigner, {
      ...this._rootComponent,
      control: null
    });
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
        const currentWidth = (currentControl.width || this.selectedControl?.control?._getDesignPropValue('width')) as number;
        const currentHeight = (currentControl.height || this.selectedControl?.control?._getDesignPropValue('height')) as number;
        switch (this.resizerPos) {
          case "tl": {
            let left = (currentControl.left as number) + mouseMoveDelta.x;
            let top = (currentControl.top as number) + mouseMoveDelta.y;
            let width = currentWidth - mouseMoveDelta.x;
            let height = currentHeight - mouseMoveDelta.y;
            this.updatePosition({ left, top, width, height })
            break;
          }
          case "tm": {
            let top = (currentControl.top as number) + mouseMoveDelta.y;
            let height = currentHeight - mouseMoveDelta.y;
            this.updatePosition({ top, height })
            this.updatePosition({ top, height })
            break;
          }
          case "tr": {
            let top = (currentControl.top as number) + mouseMoveDelta.y;
            let width = currentWidth + mouseMoveDelta.x;
            let height = currentHeight - mouseMoveDelta.y;
            this.updatePosition({ top, width, height })
            break;
          }
          case "ml": {
            let left = (currentControl.left as number) + mouseMoveDelta.x;
            let width = currentWidth - mouseMoveDelta.x;
            this.updatePosition({ left, width })
            break;
          }
          case "mr": {
            let width = currentWidth + mouseMoveDelta.x;
            this.updatePosition({ width })
            break;
          }
          case "bl": {
            let left = (currentControl.left as number) + mouseMoveDelta.x;
            let width = currentWidth - mouseMoveDelta.x;
            let height = currentHeight + mouseMoveDelta.y;
            this.updatePosition({ left, width, height })
            break;
          }
          case "bm": {
            let height = currentHeight + mouseMoveDelta.y;
            this.updatePosition({ height })
            break;
          }
          case "br": {
            let width = currentWidth + mouseMoveDelta.x;
            let height = currentHeight + mouseMoveDelta.y;
            this.updatePosition({ width, height })
            break;
          }
        }
      } else {
        if (Math.abs(mouseMoveDelta.x) > 10 || Math.abs(mouseMoveDelta.y) > 10) {
          this.modified = true;
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
    this.designerProperties.onUpdate();
  }

  private handleBreakpoint(value: number) {
    const { minWidth } = breakpointsMap[value];
    if (minWidth !== undefined) {
      this.pnlFormDesigner.width = minWidth;
    }
    // if (value >= 2) {
    //   this.pnlScreens.width = 0
    //   this.pnlProperties.width = 0
    // }
    this.designerWrapper.alignItems = value >= 3 ? 'start' : 'center';
    this.updateDesignProps(this._rootComponent);
    this.onUpdateDesigner();
    this.designerComponents.renderUI();
  }

  private onToggleClick(target: Panel) {
    const parentEl = target.parent;
    const icon = target.children[0] as Icon;
    if (parentEl) {
      const parentWidth = Number(parentEl.width || 0);
      if (parentWidth === 0) {
        parentEl.width = '100%';
      } else {
        parentEl.width = 0;
      }
      if (icon) {
        icon.name = icon.name === 'angle-left' ? 'angle-right' : 'angle-left';
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
    this.showDesignProperties()
    this.initEvents()
  }

  render() {
    return (
      <i-vstack
        width='100%'
        height='100%'
        // maxWidth={Theme.layout.container.maxWidth}
        // margin={{ left: 'auto', right: 'auto' }}
        position='relative'
      >
        <i-hstack width='100%' height='100%'>
          <i-vstack
            id="pnlScreens"
            width='100%'
            height='100%'
            border={{
              top: { width: 1, style: 'solid', color: Theme.divider },
            }}
            maxWidth={300}
            position='relative'
            overflow={'visible'}
            zIndex={10}
            class={customTransition}
          >
            <i-panel
              position='absolute'
              top={'2.5rem'} right={'-1rem'}
              width={'2rem'} height={'2rem'}
              border={{radius: '50%'}}
              background={{ color: Theme.background.main }}
              cursor='pointer'
              boxShadow={Theme.shadows[1]}
              onClick={this.onToggleClick.bind(this)}
            >
              <i-icon
                name="angle-right"
                width={'1rem'}
                height={'1rem'}
                fill={Theme.text.primary}
                position='absolute' top={'0.5rem'} right={'0.15rem'}
              ></i-icon>
            </i-panel>
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
              overflow={'hidden'}
              onShowComponentPicker={this.onShowComponentPicker}
              onSelect={this.onSelectComponent}
              onVisible={this.onVisibleComponent}
              onDelete={this.onDeleteComponent}
              onUpdate={this.onUpdateDesigner}
            />
             <i-modal
              id="mdPicker"
              width={'16rem'}
              maxWidth={'100%'}
              height={'100dvh'}
              overflow={'hidden'}
              showBackdrop={false}
              popupPlacement='rightTop'
              zIndex={2000}
              padding={{top: 0, bottom: 0, left: 0, right: 0}}
            >
              <i-panel
                width={'100%'}
                height='100%'
                overflow={'hidden'}
              >
                <i-vstack
                  id='wrapperComponentPicker'
                  width={'100%'}
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
              </i-panel>
            </i-modal>
          </i-vstack>
          <i-vstack
            id="designerWrapper"
            stack={{grow: '1'}}
            padding={{top: '1rem', bottom: '1rem', left: '1rem', right: '1rem'}}
            overflow={'hidden'}
            zIndex={0}
            alignItems='center'
            position='relative'
          >
            <i-panel
              id="pnlFormDesigner"
              width={'auto'} minHeight={'100%'}
              background={{ color: '#26324b' }}
              overflow={{x: 'visible', y: 'auto'}}
              mediaQueries={[
                {
                  maxWidth: '1024px',
                  properties: {
                    maxHeight: '100%'
                  }
                }
              ]}
            ></i-panel>
          </i-vstack>
          <i-panel
            id="pnlProperties"
            overflow={'visible'}
            maxWidth={360}
            width={'100%'}
            height={'100%'}
            class={customTransition}
            zIndex={10}
          >
            <i-panel
              position='absolute'
              top={'2.5rem'} left={'-1rem'}
              width={'2rem'} height={'2rem'}
              border={{radius: '50%'}}
              background={{ color: Theme.background.main }}
              cursor='pointer'
              boxShadow={Theme.shadows[1]}
              onClick={this.onToggleClick.bind(this)}
            >
              <i-icon
                name="angle-right"
                width={'1rem'}
                height={'1rem'}
                fill={Theme.text.primary}
                position='absolute' top={'0.5rem'} left={'0.15rem'}
              ></i-icon>
            </i-panel>
            <designer-properties
              id='designerProperties'
              display='flex'
              width={'100%'} height={'100%'}
              onChanged={this.onPropertiesChanged}
              onEventChanged={this.onControlEventChanged}
              onEventDblClick={this.onControlEventDblClick}
              onBreakpointChanged={this.handleBreakpoint}
            />
          </i-panel>
        </i-hstack>
      </i-vstack>
    )
  }
}
