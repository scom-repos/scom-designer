import {
  Container,
  Control,
  ControlElement,
  customElements,
  getCustomElements,
  GridLayout,
  Icon,
  IconName,
  IdUtils,
  Iframe,
  Image,
  Input,
  Link,
  Modal,
  Module,
  Panel,
  Repeater,
  Styles,
  TreeView,
  VStack,
  TreeNode,
  HStack,
  application
} from '@ijstech/components';
import {
  DesignerScreens,
  DesignerComponents,
  DesignerProperties,
  DesignerPickerComponents,
  DesignerPickerBlocks
} from '../components/index';
import { IComponent, IComponentItem, IComponentPicker, IControl, IScreen, IStudio, IBlock, ActionType } from '../interface'
import { customLabelTabStyled, customModalStyled, customScrollbar, customTransition, labelActiveStyled, toggleClass } from '../index.css'
import {
  blockComponents
} from '../data'
import { borderRadiusLeft, borderRadiusRight } from '../tools/index'
import { Parser } from "@ijstech/compiler";
import { isSameValue, mergeObjects, parseProps } from '../helpers/utils'
import { GroupMetadata, breakpointsMap, getDefaultMediaQuery, getMediaQueryProps, CONTAINERS, ControlItemMapper, ITEMS, findMediaQueryCallback, pageWidgets } from '../helpers/config'
import { getBreakpoint } from '../helpers/store'
import { mainJson } from '../languages/index';
import { selectedStyle, hoverStyle } from './index.css'

const Theme = Styles.Theme.ThemeVars

enum TABS {
  RECENT,
  BITS,
  BLOCKS,
}

class ControlResizer {
  private _control: Control;
  private _type: ActionType = 'click';
  private resizers: HTMLElement[] = [];

  constructor(control: Control, type: ActionType) {
    this._control = control;
    this._type = type ?? 'click';
  }

  get type() {
    return this._type ?? 'click';
  }

  set type(value: ActionType) {
    this._type = value ?? 'click';
  }

  addResizer(className: string) {
    let resizer = document.createElement("div");
    this._control.appendChild(resizer);
    this.resizers.push(resizer);
    resizer.className = "i-resizer " + className;
  }

  hideResizers() {
    if (this.type === 'click') {
      this.resizers.forEach(resizer => this._control?.contains(resizer) && this._control.removeChild(resizer));
      this.resizers = [];
    } else {
      const parentEl = this._control.closest('#designerWrapper') as Control;
      const selectedEl = parentEl?.querySelector(`.${selectedStyle}`) as Control;
      if (selectedEl) selectedEl.classList.remove(selectedStyle);
      const addToChatPanel = parentEl.querySelector('#pnlAddToChat') as Panel;
      if (addToChatPanel) addToChatPanel.visible = false;
    }
  }

  showResizers() {
    if (this.type === 'click') {
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
    } else {
      if (this._control.tagName === 'I-PANEL') return

      if (this._control.tag?.isGenerated === false) return;

      this._control.classList.add(selectedStyle);
      const parentEl = this._control.closest('#designerWrapper') as Control;
      const addToChatPanel = parentEl.querySelector('#pnlAddToChat') as Panel;
      if (addToChatPanel) {
        const { top, left } = this._control.getBoundingClientRect();
        addToChatPanel.visible = true;
        addToChatPanel.position = 'fixed';
        addToChatPanel.top = top + window.scrollY - 35 + 'px';
        addToChatPanel.left = left + window.scrollX + 'px';
        addToChatPanel.zIndex = 1000;
      }
    } 
  }
}

interface ScomDesignerFormElement extends ControlElement {
  onPreview?: ()=> Promise<{module: string, script: string}>;
  onTogglePreview?: (value: boolean) => void;
  onClose?: () => void;
  onSelectControl?: () => void;
  onDesignerChange?: (target: ScomDesignerForm, event: Event) => void;
}

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
  private pnlPreview: Panel;
  private ifrPreview: Iframe;
  private mdPicker: Modal
  private designerWrapper: VStack
  private pnlScreens: Panel
  private pnlLoading: VStack
  private pnlLeftIcon: Panel
  private pnlRightIcon: Panel
  private btnClosePreview: Icon
  private mdMobile: Modal
  private pnlWrap: Panel
  private pnlDesignHeader: HStack
  private pnlProperties: Panel
  private pnlAddToChat: Panel

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
  private _customElements = getCustomElements();
  private isPreviewing: boolean = false;
  baseUrl: string = '';
  private _previewUrl: string = '';
  private _selectedType: ActionType = 'click';
  private _isPreviewDefault: boolean = false;
  private isPreviewMode: boolean = false;

  private handleMouseMoveBound: (event: MouseEvent) => void;
  private handleMouseUpBound: (event: MouseEvent) => void;

  selectedControl: IControl
  modified: boolean;
  studio: IStudio;
  onPreview?: ()=> Promise<{module: string, script: string}>;
  onTogglePreview?: (value: boolean) => void;
  onClose?: () => void;
  onSelectControl?: () => void;
  onDesignerChange?: (target: ScomDesignerForm) => void;

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
    this.onAddItem = this.onAddItem.bind(this);
    this.handlePreviewChanged = this.handlePreviewChanged.bind(this);
  }

  static async create(options?: ScomDesignerFormElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  setData() {}
  
  get selectedType() {
    return this._selectedType ?? 'click';
  }

  set selectedType(value: ActionType) {
    this._selectedType = value ?? 'click';
  }

  get isPreviewDefault() {
    return this._isPreviewDefault ?? false;
  }

  set isPreviewDefault(value: boolean) {
    this._isPreviewDefault = value ?? false;
    this.pnlLeftIcon && this.toggleLeftRightPanel(this.pnlLeftIcon, !this.isPreviewDefault);
    this.pnlRightIcon && this.toggleLeftRightPanel(this.pnlRightIcon, !this.isPreviewDefault);
  }

  set previewUrl(url: string){
    this._previewUrl = url || 'https://decom.dev/debug.html';
    this.ifrPreview.url = url;
  }
  get previewUrl() {
    return this._previewUrl || 'https://decom.dev/debug.html';
  }

  get pickerComponentsFiltered() {
    let components: IComponentPicker[]
    if (this.currentTab === TABS.RECENT) {
      components = [{
        name: '$frequently_used',
        tooltipText: '$components_that_you_use_most_frequently',
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

  getSelectedPosition() {
    const path = this.selectedControl?.path;
    const keys = Array.from(this.pathMapping.keys());
    return keys.findIndex(x => x === path);
  }

  private getComponents() {
    let result: {[name: string]: IComponentPicker} = {};

    for (let group in GroupMetadata) {
      result[group] = {...GroupMetadata[group], items: []};
    }

    let components = getCustomElements();
    const hasItem = (tagName: string) => tagName && ITEMS.includes(tagName);

    components = Object.entries(components)
      .filter(([name, component]) => component.icon && component.className && !hasItem(component.tagName))
      .reduce((obj, [name, component]) => {
        obj[name] = component;
        return obj;
      }, {} as Record<string, any>);

    for (let name in components) {
      const component = components[name];
      const icon: any = component?.icon as IconName;
      const group = component?.group ?? 'Basic';
      result[group]['items'].push({
        ...component,
        icon,
        path: '',
        name: component.tagName
      });
    }

    return result;
  }

  get pickerBlocksFiltered(): IBlock[] {
    if (this.inputSearch.value) {
      return blockComponents.filter((v) =>
        v.caption.toLowerCase().includes(this.inputSearch.value.toLowerCase())
      )
    }
    return blockComponents
  }

  private get isCustomWidget() {
    return !!(this.selectedControl?.control as any)?.showConfigurator;
  }

  private get isPageWidget() {
    const controlName = this.selectedControl?.name || '';
    const name = controlName.replace(/^i-/, '@scom/');
    return name && pageWidgets.includes(name);
  }

  private async createControl(parent: Control|undefined, name: string, config: {mediaQueries: any, options: any}) {
    const { mediaQueries, options } = config;
    const controlConstructor: any = window.customElements.get(name);
    if (!controlConstructor) return;
    let controlProps = JSON.parse(JSON.stringify(options));
    for (let key in controlProps) {
      const value = controlProps?.[key];
      if (typeof value === 'string' && value.startsWith('this.')) {
        delete controlProps[key];
      }
      if (key === 'class') {
        delete controlProps[key];
      }
    }

    let control
    if (name === 'i-scom-carousel' || name === 'i-page-form') {
      control = this.createElement(name, parent);
      control.designMode = true;
      control.cursor = 'pointer';
      const {tag, ...props} = controlProps
      props.data && await control.setData(props.data);
      tag && control.setTag(tag);
    } else {
      control = await controlConstructor.create({...controlProps, designMode: true, cursor: 'pointer'});

      if (name.includes('scom')) {
        parent?.appendChild(control);
      } else {
        control.parent = parent;
      }
    }

    const breakpointProps = getMediaQueryProps(mediaQueries);
    control._setDesignProps({...options, mediaQueries}, breakpointProps);

    const hasBackground = 'background' in options;
    const hasFont = 'font' in options;
    const isCustomWidget = !!(control as any)?.showConfigurator;
    if (isCustomWidget && (hasBackground || hasFont)) {
      let customTag = {...(control.tag || {})};
      const value = options[hasBackground ? 'background' : 'font'];
      customTag.customBackgroundColor = true;
      customTag.backgroundColor = value?.color || '';
      customTag.customFontColor = true;
      customTag.fontColor = value?.color || '';
      if ((control as any)?.setTag) (control as any).setTag(customTag);
    }

    return control;
  }

  private revertImageUrl(value: string) {
    let result = '';
    if (value && typeof value === 'string') {
      const baseUrl = `${this.baseUrl || ''}/assets/`;
      if (value.includes(baseUrl)) {
        const newValue = value.replace(baseUrl, '');
        if (newValue) result = `assets.fullPath('${newValue}')`;
      } else if (value.includes('assets.fullPath')) {
        result = value;
      }
    }
    return result;
  }

  private getOptions(props: any) {
    let options: any = parseProps(props, this.baseUrl) || {};
    let newOptions: any = {}
    try {
      newOptions = (({ mediaQueries, ...o }) => o)(JSON.parse(JSON.stringify(options)));
    } catch {}
    return {
      mediaQueries: options.mediaQueries,
      options: {...newOptions}
    };
  }

  private updateDesignProps(component: Parser.IComponent) {
    if (!component) return;
    const control = this.pathMapping.get((component as IComponent).path);
    let props: any = control?.control?._getDesignProps();
    if (!props) return;
    const customProps = control?.control?._getCustomProperties()?.props || {};
    const newProps: any = {};
    for (let prop in props) {
      const defaultValue = customProps[prop]?.default;
      if (prop === 'mediaQueries' && Array.isArray(props[prop])) {
        props[prop] = (props[prop] || []).filter(v => (v && Object.keys(v.properties).length > 0));
        if (props[prop].length === 0) {
          continue;
        }
      }
      this.removeEmptyValue(props[prop]);
      if (isSameValue(defaultValue, props[prop]) || props[prop] === undefined) {
        continue;
      }

      if (typeof props[prop] === 'object' && (!props[prop] || Object.keys(props[prop]).length === 0)) {
        continue;
      }

      newProps[prop] = this.formatDesignProp(prop, props[prop], control);
    }
    component.props = {...newProps};
    component.items?.forEach(item => {
      this.updateDesignProps(item);
    });
  }

  private removeEmptyValue(value: any) {
    if (typeof value === 'object' && value) {
      for (let subProp in value) {
        if (value[subProp] === '' || value[subProp] === undefined) {
          delete value[subProp];
        } else if (typeof value[subProp] === 'object') {
          this.removeEmptyValue(value[subProp]);
          if (!value[subProp] || Object.keys(value[subProp]).length === 0) {
            delete value[subProp];
          }
        }
      }
    }
  }

  private formatDesignProp(prop: string, value: any, control: IControl) {
    if (value === undefined) return `{undefined}`;

    let props = control.control._getCustomProperties();
    let valueStr = value;
  
    if (props.events[prop]) {
      valueStr = `{${value}}`;
    } else if (prop === 'class') {
      valueStr = typeof value === 'string' && value.includes('-') ? '"' + value + '"' : `{${value}}`;
    } else {
      if (typeof value === 'number') {
        valueStr = "{" + value + "}";
      } else if (typeof value === 'boolean') {
        valueStr = "{" + value + "}";
      } else if (typeof value === 'object') {
        let revertedValue = '';
        if (value?.image?.url) {
          revertedValue = this.revertImageUrl(value.image.url);
          if (revertedValue) value.image.url = '{assets}';
        } else if (value?.url) {
          revertedValue = this.revertImageUrl(value.url);
          if (revertedValue) value.url = '{assets}';
        }
        valueStr = `{${JSON.stringify(value)}}`;
        if (revertedValue) {
          valueStr = valueStr.replace(/\:\s*\"\{assets\}\"/, `:${revertedValue}`);
        }
      } else if (typeof value === 'string') {
        if ((this.baseUrl && value.startsWith(this.baseUrl))) {
          const reverted = this.revertImageUrl(value);
          valueStr = reverted ? `{${reverted}}` : value;
        } else if (value.startsWith('assets.fullPath')) {
          valueStr = `{${value}}`;
        } else if (value.startsWith('()') || value.startsWith('this.')) {
          valueStr = "{" + value + "}";
        } else if (value.includes("'")) {
          valueStr = '"' + value + '"';
        } else {
          valueStr = "'" + value + "'";
        }
      }
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
    this.handleBreakpoint(0);
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
    this.currentParent = component;
    this.mdPicker.visible = true;
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
        const findedBreakpoint = mediaQueries.find((v) => findMediaQueryCallback(v, defaultBreakpoint));
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

        if (typeof this.onDesignerChange === 'function') this.onDesignerChange(this);
      }
    }
  }

  private async onDuplicateComponent(component: IComponent) {
    this.modified = true;
    const control = this.pathMapping.get(component.path);
    this.updateDesignProps(control);
    const newComponent = this.duplicateItem(control);
    const parentPath = component.parent;
    const parent = this.pathMapping.get(parentPath);
    await this.renderComponent(parent, newComponent, true);
    if (control.control && newComponent.control && parent.name !== "i-carousel-slider") {
      control.control.insertAdjacentElement('afterend', newComponent.control);
    }

    if (parent) {
      parent.items = parent.items || [];
      const index = parent.items.findIndex(x => x.path === component.path);
      parent.items.splice(index + 1, 0, newComponent);
      this.pathMapping.set(parentPath, parent);
    }
    this.updateStructure();

    if (typeof this.onDesignerChange === 'function') this.onDesignerChange(this);
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
      icon: component.icon,
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
    if (!control.tag) control.tag = {};
    control.tag.resizer = new ControlResizer(control, this.selectedType);
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
    control.onmouseenter = (event: MouseEvent) => {
      if (this.selectedType === 'click') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const hoveredControl = this.pnlFormDesigner.querySelector(`.${hoverStyle}`) as Control;
      if (hoveredControl) hoveredControl.classList.remove(hoverStyle);
      control.classList.add(hoverStyle);
    }
    control.onmouseleave = (event: MouseEvent) => {
      if (this.selectedType === 'click') return;
      event.preventDefault();
      event.stopPropagation();
      control.classList.remove(hoverStyle);
    }
    return component;
  }

  private async renderControl(parent: Control, component: IControl) {
    const config = this.getOptions(component.props);
    const tag: any = component.tag ? this.getOptions(component.tag) : {};
    if (config.options) config.options.tag = tag?.options;
    let control = null;

    if (parent.id === 'pnlFormDesigner') {
      control = await this.createControl(parent, component.name, config);
      return control;
    }

    const parenNodeName = parent.nodeName;
    const isAddOption = (component.name === 'i-tab' && parenNodeName === 'I-TABS') ||
      (component.name === 'i-menu-item' && parenNodeName === 'I-MENU') ||
      (component.name === 'i-menu-item' && parenNodeName === 'I-MENU-ITEM') ||
      (component.name === 'i-accordion-item' && parenNodeName === 'I-ACCORDION');
      (component.name === 'i-radio-group' && parenNodeName === 'I-RADIO');
    const isAddControl = (parenNodeName === 'I-CAROUSEL-SLIDER') ||
      (parenNodeName === 'I-REPEATER') ||
      (parenNodeName === 'I-ACCORDION-ITEM') ||
      (parenNodeName === 'I-PAGE-BLOCK');

    if (isAddOption) {
      control = (parent as any).add({...config.options, designMode: true, cursor: 'pointer'});
      const breakpointProps = getMediaQueryProps(config.mediaQueries);
      control._setDesignProps({...config.options, mediaQueries: config.mediaQueries}, breakpointProps);
    } else if (isAddControl) {
      const isNeedParent = component.name === 'i-scom-carousel' || component.name === 'i-page-form';
      const childControl = await this.createControl(isNeedParent ? parent : undefined, component.name, config);
      control = childControl && (parent as any).add(childControl);
    } else if (component.name === 'i-tree-node' && parenNodeName === 'I-TREE-VIEW') {
      control = (parent as TreeView).add(null, config.options?.caption || '');
      control.designMode = true;
      control.cursor = 'pointer';
      const breakpointProps = getMediaQueryProps(config.mediaQueries);
      control._setDesignProps({...config.options, mediaQueries: config.mediaQueries}, breakpointProps);
    } else if (component.name === 'i-tree-node' && parenNodeName === 'I-TREE-NODE') {
      const childControl = await this.createControl(undefined, component.name, config);
      control = (parent as TreeNode).appendNode(childControl);
    } else {
      control = await this.createControl(parent, component.name, config);
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
          const fnName = id
            .split("-")
            .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
            .join("");
          this.modified = true;
          control.control._setDesignPropValue("onClick", `this.${fnName}Click`);
          this.studio.addEventHandler(this, "onClick", `${fnName}Click`);
        } else if (name.startsWith("this."))
          this.studio.addEventHandler(this, "onClick", name.substring(5));

        if (typeof this.onDesignerChange === 'function') this.onDesignerChange(this);
      }
    };
  }

  private handleSelectControl(target: IControl) {
    if (this.selectedControl) this.selectedControl.control?.tag?.resizer?.hideResizers();
    this.selectedControl = target;

    if (this.selectedControl?.control?.tag?.resizer) {
      this.selectedControl.control.tag.resizer.type = this.selectedType;
      this.selectedControl.control.tag.resizer.showResizers();
    }

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
    // else if (this.isPageWidget) {
    //   const tag = control._getDesignPropValue('tag');
    //   if (tag) {
    //     for (const key in tag) {
    //       control._setDesignPropValue(key, tag[key]);
    //     }
    //   }
    // }

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
        icon: this.selectedComponent.icon,
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

      if (typeof this.onDesignerChange === 'function') this.onDesignerChange(this);
      return com;
    }
  }

  private getDefaultProps(name: string) {
    let props: any = {
      position: 'relative',
      width: '100%'
    };
    switch(name) {
      case 'i-panel':
      case 'i-vstack':
      case 'i-hstack':
      case 'i-accordion':
      case 'i-menu':
      case 'i-tree-view':
        props = {...props}
        break;
      case 'i-markdown':
        props = {
          ...props,
          display: 'block',
          minHeight: `{10}`
        }
        break;
      case 'i-stack':
        props = {
          ...props,
          direction: 'vertical'
        }
        break;
      case 'i-grid-layout':
        props = {
          ...props,
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
          ...props,
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
          ...props,
          height: '{200}',
          display: 'block'
        }
        break;
      case 'i-tab':
        props = {
          ...props,
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
          ...props,
          minHeight: '{200}',
          display: 'block'
        }
        break;
      case 'i-carousel-slider':
        props = {
          ...props,
          type: 'dot',
          minHeight: '100px',
          indicators: '{true}'
        }
        break;
      case 'i-video':
      case 'i-scom-table':
        props = {
          ...props,
          display: 'block'
        }
        break;
      case 'i-repeater':
        props = {
          ...props,
          display: 'block',
          count: '{3}'
        }
        break;
      case 'i-accordion-item':
        props = {
          ...props,
          name: 'Accordion Item',
          defaultExpanded: '{true}'
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
          minHeight: '{5}',
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
      case 'i-tree-node':
        props = {
          caption: 'Tree Node'
        }
        break;
      case 'i-menu-item':
        props = {
          title: 'Menu Item',
          textAlign: 'left'
        }
        break;
      case 'i-radio-group':
        props = {
          width: '100%',
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
        break;
      case 'i-modal':
        props = {
          minWidth: '300px'
        }
        break;
      default:
        props = {
          ...props,
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

  private onAddItem(parent: IComponent) {
    if (!parent?.name) return;
    this.currentParent = parent;
    const itemName = ControlItemMapper[parent.name];
    if (!itemName) return;
    const props = this.getDefaultProps(itemName);
    const component: IComponentItem = {
      props: { ...props },
      items: [],
      path: '',
      icon: this._customElements[itemName]?.icon as IconName,
      name: itemName
    }
    this.onAddComponent(null, component);
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
      const findedIndex = mediaQueries.findIndex((v: any) => findMediaQueryCallback(v, value));
      if (findedIndex !== -1) {
        mediaQueries[findedIndex] = value;
      } else {
        mediaQueries.push(value);
      }
      control._setDesignPropValue('mediaQueries', mediaQueries);
    } else {
      const controlName = this.selectedControl?.name || '';
      if (prop === 'data' && value && typeof value === 'object' && ['i-scom-image-gallery', 'i-scom-image'].includes(controlName)) {
        for (const key in value) {
          control._setDesignPropValue(key, value[key]);
        }
      }
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
      } else if (this.isPageWidget && prop !== 'data') {
        const {resizer, ...customTag} = control.tag || {};
        const tag: any = customTag || {};
        mergeObjects(tag, {[prop]: value});
        const configurator = (control as any)?.getConfigurators()?.find(c => c.target === 'Builders');
        if (configurator?.setTag) configurator.setTag(tag);
        control._setDesignPropValue('tag', tag);
      }
    }

    if (mediaQueryProp) {
      const breakpointProps = getMediaQueryProps(control._getDesignPropValue('mediaQueries'));
      const designProp = control._getDesignPropValue(mediaQueryProp);
      control._setDesignPropValue(mediaQueryProp, designProp, breakpointProps?.[mediaQueryProp]);
    }

    if (prop.includes('icon') && this.selectedControl?.name === 'i-combo-box' && (!value.name && !value.image?.url)) {
      value.name = 'angle-down';
    }
    if (prop === 'link') {
      this.updateLinkProp(prop, value, control);
    } else if ((prop.toLowerCase()).includes('icon')) {
      this.updateIconProp(prop, value, control);
    } else if (prop === 'image') {
      this.updateImageProp(prop, value, control);
    }

    if (prop === "id" && value && oldVal !== value) this.studio.renameComponent(this, oldVal, value);
    if (this.selectedControl.repeater) {
      this.updateDesignProps(this.selectedControl);
      this.updateRepeater(this.selectedControl.repeater);
    }
    this.pathMapping.set(this.selectedControl.path, this.selectedControl);

    if (typeof this.onDesignerChange === 'function') this.onDesignerChange(this);
  }

  private updateIconProp(prop: string, value: any, control: Control) {
    if (this.selectedControl?.name === 'i-tree-node') {
      const treeNode = control as TreeNode;
      treeNode[prop].name = value.name || '';
      treeNode[prop].image = value.image;
      if (value.fill) treeNode[prop].fill = value.fill;
      if (value.width) treeNode[prop].width = value.width;
      if (value.height) treeNode[prop].height = value.height;
    } else {
      if (value.name || value.image?.url) {
        const options: any = {
          width: value.width || 16,
          height: value.height || 16,
          fill: value.fill || Theme.text.primary
        }
        if (value.image?.url) {
          options.image = value.image;
        } else if (value.name) {
          options.name = value.name;
        }
        control._setDesignPropValue(prop, options);
        control[prop] = new Icon(control, {...options, display: 'flex', designMode: true, cursor: 'pointer'});
      } else {
        control[prop] = undefined;
      }
    }
  }

  private updateLinkProp(prop: string, value: any, control: Control) {
    if (value?.href) {
      const linkEl = new Link(control, {...value, designMode: true, cursor: 'pointer'});
      control[prop] = linkEl;
    } else {
      control[prop] = undefined;
    }
  }

  private updateImageProp(prop: string, value: any, control: Control) {
    if (value.url) {
      const width = value.width || '1rem';
      const height = value.height || '1rem';
      const imageEl = new Image(control, {display: 'flex', ...value, width, height, designMode: true, cursor: 'pointer'});
      control._setDesignPropValue('name', '');
      control[prop] = imageEl;
    } else {
      control[prop] = undefined;
    }
  }

  private onControlEventChanged(prop: string, newValue: string, oldValue: string) {
    if (this.selectedControl?.control && oldValue !== newValue) {
      this.modified = true;
      this.selectedControl.control._setDesignPropValue(prop, `this.${newValue}`);
      if (oldValue) this.studio.renameEventHandler(this, oldValue, newValue);
      else this.studio.addEventHandler(this, prop, `${newValue}`);

      if (typeof this.onDesignerChange === 'function') this.onDesignerChange(this);
    }
  }

  private onControlEventDblClick(funcName: string) {
    if (funcName) {
      this.studio.locateMethod(this, funcName);
    }
  }

  async renderUI(root: IComponent) {
    this.selectedControl = null;
    this._rootComponent = root;
    this.designerComponents.screen = {
      name: 'Screen',
      id: '',
      elements: [this._rootComponent]
    }
    await this.onUpdateDesigner(false);
    this.designerProperties?.clear()
  }

  private async onUpdateDesigner(refresh = true) {
    if (refresh) {
      this.updateDesignProps(this._rootComponent);
    }
    this.pnlFormDesigner.clearInnerHTML();
    this.pathMapping = new Map();
    await this.renderComponent(undefined, {
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
      const currentWidth = currentControl.offsetWidth;
      const currentHeight = currentControl.offsetHeight;
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
    if (typeof control?.resize === 'function' && (this.designPos.width || this.designPos.height)) {
      control.resize();
    }
    this.designPos = {};
    this.designerProperties.onUpdate();
  }

  private async handlePreviewChanged(type: string, value: string) {
    this.isPreviewMode = value === '1';
    if (this.isPreviewMode) {
      await this.preview();
    }
    else {
      this.design();
    }
  }

  async preview() {
    if (this.isPreviewing) return;
    this.pnlProperties.mediaQueries = [
      {
        maxWidth: '767px',
        properties: {
          maxWidth: '100%',
          width: '100%',
          visible: false
        }
      }
    ]
    this.pnlLoading.visible = true;
    this.isPreviewing = true;
    if (typeof this.onPreview === 'function') {
      let result = await this.onPreview();
      if (result?.module) {
        if (typeof this.onTogglePreview === 'function')
          this.onTogglePreview(true);
        this.togglePanels(true);
        this.pnlFormDesigner.visible = false;
        this.pnlPreview.visible = true;
        this.btnClosePreview.visible = true;
        if (!this.ifrPreview.url || this._previewUrl !== this.ifrPreview.url)
          this.ifrPreview.url = this.previewUrl;
        if (result) {
          await this.ifrPreview.reload();
          this.ifrPreview.postMessage(JSON.stringify(result));
        }
      } else {
        this.designerProperties.closePreview();
      }
    }
    this.isPreviewing = false;
    this.pnlLoading.visible = false;
  }

  async design() {
    this.pnlProperties.mediaQueries = [
      {
        maxWidth: '767px',
        properties: {
          maxWidth: '100%',
          width: '100%'
        }
      }
    ]
    if (typeof this.onTogglePreview === 'function')
      this.onTogglePreview(false);
    this.togglePanels(false);
    this.pnlFormDesigner.visible = true;
    this.pnlPreview.visible = false;
    this.pnlLoading.visible = false;
    this.btnClosePreview.visible = false;
    if (this.ifrPreview)
      this.ifrPreview.unload();
  }

  private togglePanels(value: boolean) {
    if (this.pnlScreens) {
      this.pnlScreens.width = value ? 0: '100%';
    }
    if (this.designerProperties) {
      this.designerProperties.show(value);
      this.designerProperties.height = value ? 'auto' : '100%';
    }
    if (this.pnlLeftIcon) this.pnlLeftIcon.visible = !value;
    if (this.pnlDesignHeader) {
      this.pnlDesignHeader.mediaQueries = value ? [] : [{maxWidth: '767px', properties: {visible: true}}];
      this.pnlDesignHeader.display = value ? 'none' : 'flex';
    }
  }

  closePreview() {
    this.designerProperties.closePreview();
    if (this.isPreviewMode) this.handlePreviewChanged('preview', '0');
    if (typeof this.onClose === 'function') this.onClose();
  }

  private handleBreakpoint(value: number) {
    const { minWidth, maxWidth } = breakpointsMap[value];
    if (minWidth !== undefined) {
      this.pnlFormDesigner.minWidth = minWidth;
      this.pnlFormDesigner.maxWidth = maxWidth || '1400px';
      if (!maxWidth) {
        this.pnlPreview.minWidth = minWidth;
        this.pnlPreview.width = "100%";
        this.pnlPreview.maxWidth = '1400px';
      } else {
        this.pnlPreview.width = minWidth;
        this.pnlPreview.minWidth = minWidth;
        this.pnlPreview.maxWidth = maxWidth;
      }
    }
    this.designerWrapper.alignItems = value >= 3 ? 'start' : 'center';
    this.onUpdateDesigner();
    this.designerComponents.renderUI();
  }

  private onToggleClick(target: Panel, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const parentEl = target.parent || target.parentElement as Control;
    const parentWidth = parentEl && Number(parentEl.width || 0);
    this.toggleLeftRightPanel(target, parentWidth === 0);
  }

  private toggleLeftRightPanel(target: Panel, visible: boolean) {
    const parentEl = target.parent || target.parentElement as Control;
    const icon = target.children[0] as Icon;

    if (parentEl) {
      const childPanel = parentEl?.id === 'pnlProperties' && parentEl.querySelector('i-panel') as Control;
      if (visible) {
        parentEl.width = '100%';
        childPanel && (childPanel.left = '-1rem');
      } else {
        parentEl.width = 0;
        childPanel && (childPanel.left = '-1.15rem');
      }
      if (icon) {
        icon.name = icon.name === 'angle-left' ? 'angle-right' : 'angle-left';
      }
    }
  }

  private initEvents() {
    this.pnlFormDesigner.addEventListener('mousedown', this.handleControlMouseDown.bind(this));
  }

  private onToggleStructure() {
    this.mdMobile.visible = true;
  }

  private handleClose() {
    this.mdMobile.visible = false;
  }

  private onModalOpen() {
    this.pnlWrap.clearInnerHTML();
    this.pnlWrap.appendChild(this.designerComponents);
  }

  private onModalClose() {
    this.pnlScreens.appendChild(this.designerComponents);
  }

  private handleAddToChat() {
    if (typeof this.onSelectControl === 'function') this.onSelectControl();
    this.pnlAddToChat.visible = false;
  }

  hideAddToChatWidget() {
    this.pnlAddToChat.visible = false;
  }

  onHide(): void {
    super.onHide();
    this.designerComponents?.onHide();
    this.pnlFormDesigner.removeEventListener('mousedown', this.handleControlMouseDown.bind(this));
    this.pnlFormDesigner.removeEventListener('mousemove', this.handleMouseMoveBound);
    this.pnlFormDesigner.removeEventListener('mouseup', this.handleMouseUpBound);
    if (this.ifrPreview?.clear)this.ifrPreview.clear();
  }

  init() {
    this.i18n.init({...mainJson});
    super.init()
    this.onClose = this.getAttribute('onClose', true) || this.onClose;
    this.onPreview = this.getAttribute('onPreview', true) || this.onPreview;
    this.onSelectControl = this.getAttribute('onSelectControl', true) || this.onSelectControl;
    this.onDesignerChange = this.getAttribute('onDesignerChange', true) || this.onDesignerChange;
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
        <i-hstack
          id="pnlDesignHeader"
          verticalAlignment='center'
          stack={{ shrink: '0' }}
          width={'100%'}
          height={48}
          padding={{ left: 16, right: 16 }}
          gap={8}
          boxShadow={Theme.shadows[1]}
          background={{ color: Theme.background.main }}
          visible={false}
          mediaQueries={[
            {
              maxWidth: '767px',
              properties: {
                visible: true
              }
            }
          ]}
        >
          <i-button
            id="btnScreens"
            icon={{name: 'ellipsis-h'}}
            boxShadow='none'
            padding={{top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem'}}
            background={{color: 'transparent'}}
            onClick={this.onToggleStructure}
          ></i-button>
        </i-hstack>
        <i-stack
          width='100%' height='100%'
          direction='horizontal'
          mediaQueries={[
            {
              maxWidth: '767px',
              properties: {
                direction: 'vertical',
                overflow: 'auto',
                padding: {bottom: '2rem'}
              }
            }
          ]}
        >
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
            mediaQueries={[
              {
                maxWidth: '767px',
                properties: {
                  visible: false
                }
              }
            ]}
          >
            <i-panel
              id="pnlLeftIcon"
              position='absolute'
              top={'2rem'} right={'-1rem'}
              width={'2rem'} height={'2rem'}
              border={{radius: '50%'}}
              background={{ color: Theme.background.main }}
              cursor='pointer'
              class={toggleClass}
              onClick={this.onToggleClick}
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
              onAdd={this.onAddItem}
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
                        caption='$add_components'
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
                        caption='$recent'
                        class={`${customLabelTabStyled} ${borderRadiusLeft}`}
                        onClick={() => this.onTabChanged(TABS.RECENT)}
                      />
                      <i-label
                        caption='$bits'
                        class={`${customLabelTabStyled} ${labelActiveStyled}`}
                        border={{
                          radius: 0,
                          left: { width: 1, style: 'solid', color: Theme.divider },
                          right: { width: 1, style: 'solid', color: Theme.divider },
                        }}
                        onClick={() => this.onTabChanged(TABS.BITS)}
                      />
                      <i-label
                        caption='$blocks'
                        class={`${customLabelTabStyled} ${borderRadiusRight}`}
                        onClick={() => this.onTabChanged(TABS.BLOCKS)}
                      />
                    </i-grid-layout>
                    <i-input
                      id='inputSearch'
                      placeholder='$search'
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
            overflow="hidden"
            zIndex={0}
            alignItems='center'
            position='relative'
            mediaQueries={[
              {
                maxWidth: '767px',
                properties: {
                  minHeight: 'calc(100% - 61px)'
                }
              }
            ]}
          >
            <i-vstack
              id="pnlLoading"
              width="100%" minHeight={200}
              position="absolute"
              bottom={0}
              zIndex={1000}
              visible={false}
              background={{ color: Theme.background.main }}
              class="i-loading-overlay"
              opacity={0.7}
              mediaQueries={[
                {
                  maxWidth: '767px',
                  properties: {
                    height: '100%',
                    top: 0
                  }
                }
              ]}
            >
              <i-vstack
                horizontalAlignment="center" verticalAlignment="center"
                position="absolute" top="calc(50% - 0.75rem)" left="calc(50% - 0.75rem)"
              >
                <i-icon
                  class="i-loading-spinner_icon"
                  name="spinner"
                  width={24}
                  height={24}
                  fill={Theme.colors.primary.main}
                />
              </i-vstack>
            </i-vstack>
            <i-panel
              id="pnlFormDesigner"
              width={'auto'} minHeight={'100%'}
              background={{ color: Theme.background.main }}
              overflow={{x: 'visible', y: 'auto'}}
              class={customScrollbar}
              mediaQueries={[
                {
                  maxWidth: '1024px',
                  properties: {
                    maxHeight: '100%'
                  }
                }
              ]}
            ></i-panel>
            <i-hstack
              id="pnlAddToChat"
              verticalAlignment='center'
              padding={{top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem'}}
              width={'150px'}
              border={{radius: '0.25rem', width: 1, style: 'solid', color: Theme.divider}}
              cursor='pointer'
              visible={false}
              boxShadow={Theme.shadows[1]}
              background={{color: Theme.background.modal}}
              onClick={this.handleAddToChat}
            >
              <i-label caption='Add to Chat' font={{size: '0.875rem', weight: 500}}></i-label>
            </i-hstack>
            <i-panel
              id="pnlPreview"
              width={'auto'} minHeight={'100%'}
              background={{ color: Theme.background.main }}
              overflow={'hidden'}
              visible={false}
              mediaQueries={[
                {
                  maxWidth: '1024px',
                  properties: {
                    maxHeight: '100%'
                  }
                }
              ]}
            >
              <i-iframe id="ifrPreview" width={'100%'} height={'100%'} allowFullscreen={true}></i-iframe>
            </i-panel>
          </i-vstack>
          <i-panel
            id="pnlProperties"
            overflow={'visible'}
            maxWidth={360}
            width={'100%'}
            height={'100%'}
            class={customTransition}
            mediaQueries={[
              {
                maxWidth: '767px',
                properties: {
                  maxWidth: '100%',
                  width: '100%',
                  visible: false
                }
              }
            ]}
          >
            <i-panel
              id="pnlRightIcon"
              position='absolute'
              top={'2rem'} left={'-1rem'}
              width={'2rem'} height={'2rem'}
              border={{radius: '50%'}}
              background={{ color: Theme.background.main }}
              cursor='pointer'
              class={toggleClass}
              onClick={this.onToggleClick}
              mediaQueries={[
                {
                  maxWidth: '767px',
                  properties: {
                    visible: false
                  }
                }
              ]}
            >
              <i-icon
                name="angle-left"
                width={'1rem'}
                height={'1rem'}
                fill={Theme.text.primary}
                position='absolute' top={'0.5rem'} left={'0.15rem'}
              ></i-icon>
            </i-panel>
            <i-icon
              id="btnClosePreview"
              name="times"
              width={16} height={16}
              visible={false}
              top={5} right={10}
              zIndex={999}
              cursor='pointer'
              onClick={this.closePreview}
            ></i-icon>
            <designer-properties
              id='designerProperties'
              display='flex'
              width={'100%'} height={'100%'}
              onChanged={this.onPropertiesChanged}
              onEventChanged={this.onControlEventChanged}
              onEventDblClick={this.onControlEventDblClick}
              onBreakpointChanged={this.handleBreakpoint}
              onPreviewChanged={this.handlePreviewChanged}
            />
          </i-panel>
        </i-stack>
        <i-modal
          id="mdMobile"
          width={'100dvw'}
          height={'50dvh'}
          popupPlacement='bottom'
          zIndex={999}
          overflow={{y: 'auto'}}
          padding={{top: 0, right: 0, bottom: 0, left: 0}}
          border={{top: {width: '1px', style: 'solid', color: Theme.divider}}}
          showBackdrop={true}
          visible={false}
          closeOnBackdropClick={false}
          class={customModalStyled}
          onOpen={this.onModalOpen}
          onClose={this.onModalClose}
        >
          <i-vstack
            width={'100%'} height={'100%'}
            overflow={'hidden'}
          >
            <i-panel
              id="pnlWrap"
              stack={{grow: '1'}}
              maxHeight={'calc(100% - 60px)'}
            ></i-panel>
            <i-hstack
              verticalAlignment='center'
              width={'100%'}
              gap={8}
              cursor='pointer'
              padding={{left: 16, right: 16}}
              margin={{top: 10, bottom: 10}}
              height={40}
              border={{radius: '1rem', width: 1, style: 'solid', color: Theme.divider}}
              hover={{opacity: 0.7}}
              stack={{shrink: '0'}}
              horizontalAlignment='center'
              onClick={this.handleClose}
            >
              <i-label caption='Close'></i-label>
            </i-hstack>
          </i-vstack>
        </i-modal>
      </i-vstack>
    )
  }
}
