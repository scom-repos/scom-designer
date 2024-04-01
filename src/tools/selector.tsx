import { Control, ControlElement, GridLayout, HStack, Icon, Label, Module, customElements, Image } from "@ijstech/components";
import { borderRadiusLeft, borderRadiusRight, customIconLayoutActiveStyled, customIconLayoutStyled } from "./index.css";
import { customIconTabActiveStyled } from "../index.css";

type selectorChanged = (type: string, value: string|number) => void;
interface DesignerSelectorElement extends ControlElement {
  items?: IItem[];
  title?: string;
  direction?: 'horizontal' | 'vertical';
  activeItem?: string;
  onChanged?: selectorChanged;
}

interface IItem {
  caption?: string;
  tooltip?: string;
  value: string|number;
  type: string;
  icon?: any;
  placement?: string;
  rotate?: number;
  isActive?: boolean;
}

interface ISelector {
  items: IItem[];
  title?: string;
  direction?: 'horizontal' | 'vertical';
  activeItem?: string|number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'designer-selector': DesignerSelectorElement;
    }
  }
}

@customElements('designer-selector')
export default class DesignerSelector extends Module {
  private pnlList: GridLayout;
  private lblTitle: Label;
  private currentTarget: Control;
  private gridSelector: GridLayout;
  private listMap: Map<any, HStack> = new Map();

  onChanged: selectorChanged;

  private _data: ISelector = {
    items: [],
    direction: 'horizontal'
  }

  get items() {
    return this._data.items || [];
  }
  set items(value: IItem[]) {
    this._data.items = value || [];
  }

  get title() {
    return this._data.title || '';
  }
  set title(value: string) {
    this._data.title = value || '';
  }

  get activeItem() {
    return this._data.activeItem;
  }
  set activeItem(value: string|number) {
    this._data.activeItem = value;
    const target = this.listMap.get(value)
    if (target) {
      this.updateActiveItem(target);
    } else if (this.currentTarget) {
      if (this.direction === 'horizontal')
        this.currentTarget.classList.remove(customIconLayoutActiveStyled);
      else this.currentTarget.classList.remove(customIconTabActiveStyled);
    }
  }

  get direction() {
    return this._data.direction ?? 'horizontal';
  }
  set direction(value: 'horizontal' | 'vertical') {
    this._data.direction = value ?? 'horizontal';
  }

  setData(value: ISelector) {
    this._data = value;
    this.renderUI();
  }

  private renderUI() {
    this.lblTitle.caption = this.title;
    this.gridSelector.templateColumns = this.direction === 'horizontal' ? ['70px', 'auto'] : ['auto'];
    this.pnlList.clearInnerHTML();
    const length = this.items.length;
    for (let i = 0; i < length; i++) {
      const item = this.items[i];
      const elm = <i-hstack
        gap={1}
        verticalAlignment="center"
        horizontalAlignment="center"
        height={'100%'}
        cursor="pointer"
        stack={{grow: '1', shrink: '1'}}
        class={`${customIconLayoutStyled} ${i === 0 ? borderRadiusLeft : i === length - 1 ? borderRadiusRight : ''} ${item.isActive ? customIconLayoutActiveStyled : ''}`}
        tooltip={{ content: item.tooltip || '', placement: item.placement as 'left' }}
        onClick={(target: Control) => this.onActiveChanged(target, item.type, item.value)}
      ></i-hstack> as HStack;
      if (item.tooltip) {
        elm.tooltip.content = item.tooltip;
        if (item.placement) elm.tooltip.placement = item.placement as 'left';
      }
      if (item.caption) {
        const lb = <i-label
          caption={item.caption}
          stack={{grow: '1', shrink: '1'}}
          class={`text-center`}
          padding={{ top: '0.25rem', bottom: '0.25rem' }}
        />;
        elm.append(lb);
      }
      if (item.icon) {
        let img;
        if (item.icon?.image) {
          img = new Image(elm, {
            width: '1rem',
            height: '1rem',
            display: 'flex',
            ...item.icon.image
          });
          if (item.rotate) img.rotate = item.rotate;
        } else {
          img = new Icon(elm, {
            width: '1rem',
            height: '1rem',
            display: 'flex',
            ...item.icon
          });
        }
        elm.append(img);
      }
      if (item.isActive) this.currentTarget = elm;
      this.pnlList.appendChild(elm);
      this.listMap.set(item.value, elm);
    }
  }

  private onActiveChanged(target: Control, type: string, value: string|number) {
    this.updateActiveItem(target);
    if (this.onChanged) this.onChanged(type, value);
  }
  
  private updateActiveItem(target: Control) {
    const activeStyle = this.direction === 'horizontal' ? customIconLayoutActiveStyled : customIconTabActiveStyled;
    if (this.currentTarget) this.currentTarget.classList.remove(activeStyle);
    target.classList.add(activeStyle);
    this.currentTarget = target;
  }

  init() {
    super.init();
    const items = this.getAttribute('items', true, []);
    const title = this.getAttribute('title', true, '');
    const direction = this.getAttribute('direction', true, 'horizontal');
    this.setData({ items, title, direction });
  }

  render(): void {
    return (
      <i-grid-layout
        id="gridSelector"
        templateColumns={['70px', 'auto']}
        verticalAlignment="center"
        gap={{column: '0.5rem', row: '0.5rem'}}
      >
        <i-label id="lblTitle" caption="" font={{ size: '0.75rem' }} />
        <i-hstack id="pnlList" gap={`1px`} verticalAlignment="center" height={'1.5rem'}></i-hstack>
      </i-grid-layout>
    )
  }
}
