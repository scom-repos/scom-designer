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
  TreeView,
  Modal,
  VStack,
  Tab,
  CarouselSlider,
  Repeater
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
import { isSameValue, parseProps } from './helpers/utils'
import { GroupMetadata, breakpointsMap, getDefaultMediaQuery, getMediaQueryProps, CONTAINERS } from './helpers/config'
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

  private pathMapping: Map<string, IControl> = new Map();
  private mouseDown: boolean = false;
  private resizing: boolean = false;
  private resizerPos: string = "";
  private mouseDownPos: { x: number; y: number };
  private recentComponents: IComponent[] = [];
  private _rootComponent: IComponent
  private selectedComponent: IControl
  private currentParent: IComponent;
  private designPos: any = {};
  private libsMap: Record<string, boolean> = {}

  private handleMouseMoveBound: (event: MouseEvent) => void;
  private handleMouseUpBound: (event: MouseEvent) => void;

  selectedControl: IControl
  modified: boolean;
  studio: IStudio;

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    this.onPropertiesChanged = this.onPropertiesChanged.bind(this);
    this.onControlEventChanged = this.onControlEventChanged.bind(this);
    this.onControlEventDblClick = this.onControlEventDblClick.bind(this);
    this.onDeleteComponent = this.onDeleteComponent.bind(this);
    this.onDuplicateComponent = this.onDuplicateComponent.bind(this);
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

  private isCustomWidget() {
    return !!(this.selectedControl?.control as any)?.showConfigurator;
  }

  private async createControl(parent: Control|undefined, name: string, options?: any) {
    const controlConstructor: any = window.customElements.get(name);
    if (!controlConstructor) return;
    options = options || {}
    let newOptions = {}
    try {
      newOptions = (({ mediaQueries, ...o }) => o)(JSON.parse(JSON.stringify(options)));
    } catch {}
    const control = await controlConstructor.create({...newOptions, designMode: true, cursor: 'pointer'});
    parent?.appendChild(control);
    if (name === 'i-icon') { // TODO: fix this
      control.setAttribute('name', options.name);
    }

    const breakpointProps = getMediaQueryProps(options.mediaQueries);
    control._setDesignProps(options, breakpointProps);

    const hasBackground = 'background' in newOptions;
    const hasFont = 'font' in newOptions;
    const isCustomWidget = !!(control as any)?.showConfigurator;
    if (isCustomWidget && (hasBackground || hasFont)) {
      let customTag = {...(control.tag || {})};
      const value = newOptions[hasBackground ? 'background' : 'font'];
      customTag.customBackgroundColor = true;
      customTag.backgroundColor = value?.color || '';
      customTag.customFontColor = true;
      customTag.fontColor = value?.color || '';
      if ((control as any)?.setTag) (control as any).setTag(customTag);
    }
    return control;
  }

  private updateDesignProps(component: Parser.IComponent) {
    if (!component) return;
    const control = this.pathMapping.get((component as IComponent).path);
    const props: any = control?.control?._getDesignProps();
    if (!props) return;
    const customProps = control?.control?._getCustomProperties()?.props || {};
    const newProps: any = {};
    for (let prop in props) {
      const defaultValue = customProps[prop]?.default;
      if (prop === 'mediaQueries') {
        props[prop] = (props[prop] || []).filter(v => (v && Object.keys(v.properties).length > 0));
        if (props[prop].length === 0) {
          continue;
        }
      }
      if (isSameValue(defaultValue, props[prop]) || props[prop] === undefined) {
        continue;
      }
      if (typeof props[prop] === 'object') {
        for (let subProp in props[prop]) {
          if (props[prop][subProp] === '') {
            delete props[prop][subProp];
          }
        }
      }
      if (typeof props[prop] === 'object' && Object.keys(props[prop]).length === 0) {
        continue;
      }
      newProps[prop] = this.formatDesignProp(prop, props[prop], control);
    }
    component.props = {...newProps};
    component.items?.forEach(item => {
      this.updateDesignProps(item);
    });
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
          valueStr = '"' + value + '"';
          break;
        }
        case "boolean": {
          valueStr = "{" + value + "}";
          break;
        }
        case "object": {
          valueStr = typeof value === 'string' ? "'" + value + "'" : `{${JSON.stringify(value)}}`;
          break;
        }
        case "array": {
          valueStr = typeof value === 'string' ? "'" + value + "'" : `{${JSON.stringify(value)}}`;
          break;
        }
      }
      control.props[prop] = valueStr;
    } else if (props.events[prop]) {
      valueStr = `{${value}}`;
    }
    return valueStr;
  }

  get rootComponent(): Parser.IComponent {
    this.updateDesignProps(this._rootComponent);
    return this._rootComponent;
  }

  clear() {
    this.pathMapping = new Map();
    this.libsMap = {};
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

  private onShowComponentPicker(component: IComponent) {
    this.mdPicker.linkTo = this.pnlScreens;
    this.mdPicker.height = this.designerComponents.height;
    this.mdPicker.visible = true;
    this.currentParent = component;
  }

  private onSelectComponent(component: IComponent) {
    const path = component.path;
    if (path) {
      const control = this.pathMapping.get(path);
      if (control) {
        this.handleSelectControl(control);
      }
    }
  }

  private onVisibleComponent(component: IComponent, visible: boolean) {
    const path = component.path;
    if (path) {
      const control = this.pathMapping.get(path);
      if (control?.control) {
        let mediaQueries = control?.control._getDesignPropValue('mediaQueries') as any[];
        if (!mediaQueries) mediaQueries = [];
        const defaultBreakpoint = getDefaultMediaQuery(getBreakpoint());
        const findedBreakpoint = mediaQueries.find((v) => v && v.minWidth === defaultBreakpoint.minWidth);
        if (findedBreakpoint) {
          findedBreakpoint['properties']['visible'] = visible;
        } else {
          defaultBreakpoint['properties']['visible'] = visible;
          mediaQueries.push(defaultBreakpoint);
        }
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
        this.modified = true;
        control.control.remove();
        this.pathMapping.delete(path);
        this.studio.removeComponent(this);
      }
    }
  }

  private async onDuplicateComponent(component: IComponent) {
    this.modified = true;
    this.updateDesignProps(this._rootComponent);
    const control = this.pathMapping.get(component.path);
    const newComponent = this.duplicateItem(component);
    const parentPath = component.parent;
    const parent = this.pathMapping.get(parentPath);

    await this.renderComponent(parent, newComponent, true);
    if (control.control && newComponent.control) {
      control.control.insertAdjacentElement('afterend', newComponent.control);
    }

    if (parent) {
      parent.items = parent.items || [];
      const index = parent.items.findIndex(x => x.path === component.path);
      parent.items.splice(index + 1, 0, newComponent);
      this.pathMapping.set(parentPath, parent);
    }
    this.updateStructure();
  }

  private duplicateItem(component: IComponent) {
    const control = this.pathMapping.get(component.path);
    const designerProps = control?.control?._getDesignProps() || {};
    const newProps = JSON.parse(JSON.stringify(designerProps));
    delete newProps['id'];
    let newComponent: IControl = {
      name: component.name,
      path: IdUtils.generateUUID(),
      parent: component.parent,
      props: {...newProps},
      control: null
    }
    if (component.items) {
      newComponent.items = component.items.map(item => {
        item.parent = newComponent.path;
        return this.duplicateItem(item)
      })
    }
    return newComponent;
  }

  private async renderComponent(parent: IControl|undefined, component: IControl, select?: boolean) {
    if (!component?.name) return;
    const parentControl = parent?.control || this.pnlFormDesigner;
    const control: Control = await this.renderControl(parentControl, component);
    if (!control) return;
    control.onclick = null;
    if (!control.style.position) control.style.position = "relative";
    component.control = control;
    component.parent = parent?.path;
    component.repeater = parent?.name === 'i-repeater' ? parent.path : (parent?.repeater || '');
    control.tag = new ControlResizer(control);
    this.bindControlEvents(component as IControl);
    this.pathMapping.set(component.path, component);
    if (component?.items?.length) {
      for (let item of component.items) {
        await this.renderComponent(component, {...item, control: null});
      }
    }
    const beforeSelected = this.selectedControl?.path;
    if (select || (beforeSelected && beforeSelected === component.path)) {
      this.handleSelectControl(component);
    }
    if (component.repeater) {
      this.updateRepeater(component.repeater);
    }
    return component;
  }

  private async renderControl(parent: Control, component: IControl) {
    const options: any = parseProps(component.props);
    let control = null;
    let isTab = component.name === 'i-tab' && parent instanceof Tabs;
    let isMenu = component.name === 'i-menu-item' && parent instanceof Menu;
    let isTree = component.name === 'i-tree-node' && parent instanceof TreeView;
    if (isTab || isMenu || isTree) {
      control = (parent as any).add(options);
    } else if (parent instanceof CarouselSlider || parent instanceof Repeater) {
      const childControl = await this.createControl(undefined, component.name, options);
      control = parent.add(childControl);
    } else {
      control = await this.createControl(parent, component.name, options);
    }
    return control;
  }

  private updateRepeater(path: string) {
    const repeater = this.pathMapping.get(path)?.control as Repeater;
    if (repeater) repeater.update();
  }

  private isParentGroup(name: string) {
    if (!name) return false;
    return CONTAINERS.includes(name);
  }

  private bindControlEvents(control: IControl) {
    control.control.onMouseDown = () => {
      this.handleSelectControl(control);
      this.designerComponents.activeComponent = control;
    };
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
    const name = this.selectedControl.name;
    const control = this.selectedControl?.control as any;
    if (control?.register && !this.libsMap[name]) {
      this.libsMap[name] = true;
      const packageName = '@scom/' + name.replace(/^i-/, '');
      const { types, defaultData } = control.register();
      const hasData = control._getDesignPropValue('data');
      if (!hasData) {
        control._setDesignPropValue('data', defaultData);
        control.setData(defaultData, defaultData);
      }
      this.studio.registerWidget(this, packageName, types);
    }
    this.showDesignProperties();
  }

  private showDesignProperties() {
    this.designerProperties.component = this.selectedControl;
  }

  private onCloseComponentPicker() {
    this.mdPicker.visible = false
  }

  private async handleAddControl(parent: IControl, event?: MouseEvent) {
    if (!parent) return;
    if (event) event.stopPropagation();
    this.modified = true;
    if (this.selectedComponent) {
      const props = this.getDefaultProps(this.selectedComponent.name);
      let com: IControl = {
        name: this.selectedComponent.name,
        path: IdUtils.generateUUID(),
        items: [],
        props,
        control: null
      };
      if (parent) {
        await this.renderComponent(parent, com, true);
      } else {
        let pos = { x: event?.offsetX || 0, y: event?.offsetY || 0};
        com.props = {
          ...com.props,
          left: `{${pos.x}}`,
          top: `{${pos.y}}`,
        }
        await this.renderComponent(undefined, com, true);
        if (!this._rootComponent.items) this._rootComponent.items = [];
        this._rootComponent.items.push(com);
        this.updateStructure();
      }
      this.selectedComponent = null;
      return com;
    }
  }

  private getDefaultProps(name: string) {
    let props: any = {};
    switch(name) {
      case 'i-panel':
        props = {
          width: '100%',
        }
        break;
      case 'i-stack':
        props = {
          width: '100%',
          position: 'relative',
          direction: 'vertical'
        }
        break;
      case 'i-grid-layout':
        props = {
          width: '100%',
          minHeight: '100px',
          gap: '{{"column":"8px","row":"8px"}}',
          templateColumns: '{["auto"]}',
          templateRows: '{["auto"]}',
          padding: '{{"top":"8px","right":"8px","bottom":"8px","left":"8px"}}',
          autoFillInHoles: '{false}'
        }
        break;
      case 'i-card-layout':
        props = {
          width: '100%',
          templateColumns: '{["auto"]}',
          templateRows: '{["auto"]}',
          gap: '{{"column":"8px","row":"8px"}}',
          padding: '{{"top":"8px","right":"8px","bottom":"8px","left":"8px"}}',
          cardMinWidth: '{100}',
          cardHeight: '{100}'
        }
        break;
      case 'i-markdown-editor':
      case 'i-iframe':
      case 'i-code-editor':
      case 'i-tabs':
        props = {
          width: '100%',
          height: '{200}',
          display: 'block'
        }
        break;
      case 'i-tab':
        props = {
          caption: 'Tab Title',
        }
        break;
      case 'i-scom-line-chart':
      case 'i-scom-bar-chart':
      case 'i-scom-scatter-chart':
      case 'i-scom-pie-chart':
      case 'i-scom-area-chart':
      case 'i-scom-mixed-chart':
      case 'i-scom-counter':
        props = {
          width: '100%',
          minHeight: '{200}',
          display: 'block'
        }
        break;
      case 'i-scom-table':
        props = {
          width: '100%',
          display: 'block'
        }
        break;
      case 'i-carousel-slider':
        props = {
          width: '100%',
          type: 'dot',
          minHeight: '100px',
          indicators: '{true}'
        }
        break;
      case 'i-video':
        props = {
          width: '100%',
          display: 'block'
        }
        break;
      case 'i-repeater':
        props = {
          width: '100%',
          display: 'block',
          count: '{3}'
        }
        break;
      case 'i-accordion':
        props = {
          width: '100%',
          display: 'block'
        }
        break;
      case 'i-image':
        props = {
          url: 'https://placehold.co/600x400?text=No+Image',
          display: 'block',
          width: '100%'
        }
        break;
      case 'i-label':
        props = {
          caption: 'Label'
        }
        break;
      case 'i-icon':
        props = {
          width: '24px',
          height: '24px'
        }
        break;
      case 'i-progress':
        props = {
          width: '100%',
          percent: '{100}',
          strokeWidth: '{5}',
          border: '{{"radius":"4px"}}'
        }
        break;
      case 'i-pagination':
        props = {
          width: '100%',
          pageSize: '{10}',
          currentPage: '{1}',
          totalPages: '{2}',
        }
        break;
      case 'i-tree-view':
        props = {
          width: '100%',
          data: '{[{"caption":"Tree node 1", "active": true},{"caption":"Tree node 2"}]}'
        }
        break;
      case 'i-menu':
        props = {
          width: '100%',
          data: '{[{"title":"Menu item 1","textAlign":"left"}, {"title":"Menu Item 2","textAlign":"left"}]}'
        }
        break;
      case 'i-radio-group':
        props = {
          width: '100%',
          radioItems: '{[{"caption":"Option 1","value":"1"},{"caption":"Option 2","value":"2"},{"caption":"Option 3","value":"3"}]}'
        }
        break;
      case 'i-datepicker':
      case 'i-input':
      case 'i-combo-box':
      case 'i-range':
        props = {
          width: '100%',
          height: '32px',
          background: '{{"color":"transparent"}}',
        }
        break;
      case 'i-button':
        props = {
          padding: '{{"top":"8px","right":"10px","bottom":"8px","left":"10px"}}',
          caption: 'Button',
          border: '{{"radius":"4px"}}',
        }
      default:
        props = {
          width: `{100}`,
          height: `{20}`
        }
        break;
    }
    return props;
  }

  private updateStructure() {
    this.designerComponents.screen = {
      ...this.designerComponents.screen,
      elements: [this._rootComponent]
    }
    this.designerComponents.activeComponent = this.selectedControl;
  }

  private initComponentPicker() {
    const nodeItems: HTMLElement[] = []
    const components = this.pickerComponentsFiltered;
    for (let i = 0; i < components.length; i++) {
      const pickerElm = new DesignerPickerComponents(undefined, {
        ... components[i],
        display: 'block',
        isShown: i === 0,
        margin: { bottom: 1 },
        onSelect: (target: Control, component: IComponentItem) => {
          this.onCloseComponentPicker();
          this.onAddComponent(target, component);
        }
      })
      nodeItems.push(pickerElm)
    }
    this.pnlComponentPicker.clearInnerHTML()
    this.pnlComponentPicker.append(...nodeItems)
  }

  private async onAddComponent(target: Control, component: IComponentItem) {
    this.selectedComponent = { ...component, control: target } as any;
    if (this.selectedComponent) {
      const finded = this.recentComponents.find(x => component?.name && x?.name && x.name === component.name);
      if (!finded) this.recentComponents.push(this.selectedComponent);
    }
    if (this.isParentGroup(this.currentParent?.name)) {
      const parentControl = this.pathMapping.get(this.currentParent.path);
      const com = await this.handleAddControl(parentControl);
      if (com && parentControl) {
        parentControl.items = parentControl.items || [];
        parentControl.items.push(com);
        this.pathMapping.set(this.currentParent.path, parentControl);
        this.updateStructure();
      }
    }
  }

  private initBlockPicker() {
    const pickerElm = new DesignerPickerBlocks(undefined, {
      items: this.pickerBlocksFiltered,
    })
    this.pnlBlockPicker.clearInnerHTML()
    this.pnlBlockPicker.append(pickerElm)
  }

  private onPropertiesChanged(prop: string, value: any, mediaQueryProp?: string) {
    const control = this.selectedControl?.control as Control;
    if (!control) return;
    this.modified = true;
    const oldVal: any = control._getDesignPropValue(prop);
    if (prop === 'mediaQueries') {
      const mediaQueries: any = control._getDesignPropValue('mediaQueries') || [];
      const findedIndex = mediaQueries.findIndex((v: any) => v && v.minWidth === value.minWidth);
      if (findedIndex !== -1) {
        mediaQueries[findedIndex] = value;
      } else {
        mediaQueries.push(value);
      }
      control._setDesignPropValue('mediaQueries', mediaQueries);
    } else {
      control._setDesignPropValue(prop, value);
      if (this.isCustomWidget && (prop === 'background' || prop === 'font')) {
        let customTag = {...(control.tag || {})};
        if (prop === 'background') {
          customTag.customBackgroundColor = true;
          customTag.backgroundColor = value?.color || '';
        } else if (prop === 'font') {
          customTag.customFontColor = true;
          customTag.fontColor = value?.color || '';
        }
        if ((control as any)?.setTag) (control as any).setTag(customTag);
      }
    }

    if (mediaQueryProp) {
      const breakpointProps = getMediaQueryProps(control._getDesignPropValue('mediaQueries'));
      const designProp = control._getDesignPropValue(mediaQueryProp);
      control._setDesignPropValue(mediaQueryProp, designProp, breakpointProps?.[mediaQueryProp]);
    }
    if (prop.includes('icon') &&this.selectedControl?.name === 'i-combo-box' && (!value.name && !value.image?.url)) {
      value.name = 'angle-down';
    }
    if (prop === 'link' && value.href) {
      const linkEl = new Link(control, {...value, designMode: true});
      control[prop] = linkEl;
    } else if (prop.includes('icon') && (value.name || value.image?.url)) {
      const iconEl = new Icon(control, {width: '1rem', height: '1rem', display: 'flex', ...value});
      control[prop] = iconEl;
    } else if (prop === 'image' && value.url) {
      const imageEl = new Image(control, {width: '1rem', height: '1rem', display: 'flex', ...value});
      control[prop] = imageEl;
    }
    if (prop === "id" && value && oldVal !== value) this.studio.renameComponent(this, oldVal, value);
    if (this.selectedControl.repeater) {
      this.updateDesignProps(this.selectedControl);
      if (this.selectedControl.name === 'i-icon' && control._getDesignPropValue('name')) {
        control.setAttribute('name', control._getDesignPropValue('name') as string);
      }
      this.updateRepeater(this.selectedControl.repeater);
    }
    this.pathMapping.set(this.selectedControl.path, this.selectedControl);
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
    this.onUpdateDesigner(false);
    this.designerProperties.clear();
  }

  private onUpdateDesigner(refresh = true) {
    if (refresh) {
      this.updateDesignProps(this._rootComponent);
    }
    this.pnlFormDesigner.clearInnerHTML();
    this.pathMapping = new Map();
    this.renderComponent(undefined, {
      ...this._rootComponent,
      control: null
    });
  }

  private handleControlMouseMove(event: MouseEvent) {
    const currentControl = this.selectedControl?.control;
    if (!currentControl || !this.mouseDown) {
      event.preventDefault();
      return;
    }

    let mouseMovePos = { x: event.clientX, y: event.clientY };
    let mouseMoveDelta = { x: mouseMovePos.x - this.mouseDownPos.x, y: mouseMovePos.y - this.mouseDownPos.y };
    this.mouseDownPos = mouseMovePos;
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
      if (Math.abs(mouseMoveDelta.x) > 5 || Math.abs(mouseMoveDelta.y) > 5) {
        this.modified = true;
        let left = (currentControl.left as number) + mouseMoveDelta.x;
        let top = (currentControl.top as number) + mouseMoveDelta.y;
        this.updatePosition({ left, top });
      }
    }
  }

  private updatePosition(value: any) {
    const control = this.selectedControl?.control
    if (!control) return;
    for (let prop in value) {
      if ((prop === 'width' || prop === 'height') && value[prop] < 0) value[prop] = 0;
      this.designPos[prop] = value[prop];
      control[prop] = value[prop];
    }
  }

  private handleControlMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.mouseDown = true;
    this.mouseDownPos = { x: event.clientX, y: event.clientY };
    let elm = event.target as HTMLElement;
    const resizers = elm.querySelectorAll('.i-resizer');
    let currentResizer = null;
    for (let i = 0; i < resizers.length; i++) {
      const resizer = resizers[i] as HTMLElement;
      const { left, right, top, bottom } = resizer.getBoundingClientRect();
      if (left <= event.clientX && event.clientX <= right && top <= event.clientY && event.clientY <= bottom) {
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
    this.handleMouseMoveBound = this.handleControlMouseMove.bind(this);
    this.handleMouseUpBound = (event: MouseEvent) => {
      this.handleControlMouseUp(event);
      this.pnlFormDesigner.removeEventListener('mousemove', this.handleMouseMoveBound);
      this.pnlFormDesigner.removeEventListener('mouseup', this.handleMouseUpBound);
    };

    this.pnlFormDesigner.addEventListener('mousemove', this.handleMouseMoveBound);
    this.pnlFormDesigner.addEventListener('mouseup', this.handleMouseUpBound);
  }

  private handleControlMouseUp(event: MouseEvent) {
    event.preventDefault();
    this.mouseDown = false;
    this.resizing = false;
    this.resizerPos = '';
    this.updateDesignPosition();
  }

  private updateDesignPosition() {
    for (let prop in this.designPos) {
      this.onPropertiesChanged(prop, this.designPos[prop]);
    }
    const control = this.selectedControl?.control as any;
    if (control?.resize && (this.designPos.width || this.designPos.height)) {
      control.resize();
    }
    this.designPos = {};
    this.designerProperties.onUpdate();
  }

  private handleBreakpoint(value: number) {
    const { minWidth } = breakpointsMap[value];
    if (minWidth !== undefined) {
      this.pnlFormDesigner.width = minWidth;
    }
    this.designerWrapper.alignItems = value >= 3 ? 'start' : 'center';
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
    this.pnlFormDesigner.addEventListener('mousedown', this.handleControlMouseDown.bind(this));
  }

  init() {
    super.init()
    this.wrapperComponentPicker.style.borderBottom = 'none'
    this.initComponentPicker()
    this.initBlockPicker()
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
              onDuplicate={this.onDuplicateComponent}
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
