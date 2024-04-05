import {
  Module,
  Styles,
  ControlElement,
  customElements,
  Icon,
  Label,
  HStack,
  Panel,
  Container,
  Control,
} from '@ijstech/components'
import { IComponentItem } from '../interface';
import { blockItemHoverStyled } from '../index.css';
const Theme = Styles.Theme.ThemeVars;

type onSelectCallback = (target: Control, component: IComponentItem) => void;

interface DesignerPickerComponentsElement extends ControlElement {
  name: string;
  tooltipText?: string;
  items: IComponentItem[];
  onSelect?: onSelectCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-picker-components']: DesignerPickerComponentsElement
    }
  }
}

@customElements('designer-picker-components')
export default class DesignerPickerComponents extends Module {
  private name: string;
  private tooltipText: string;
  private items: IComponentItem[];
  private isShown = true;

  private lbName: Label;
  private iconArrow: Icon;
  private iconTooltip: Icon;
  private hStackItems: HStack;

  onSelect: onSelectCallback;

  constructor(parent?: Container, options?: DesignerPickerComponentsElement) {
    super(parent, options);
  }

  private renderUI() {
    this.lbName.caption = this.name;
    this.iconArrow.name = 'angle-down';
    this.iconTooltip.visible = !!this.tooltipText;
    this.iconTooltip.tooltip.content = this.tooltipText || '';

    const nodeItems: HTMLElement[] = [];
    for (const item of this.items) {
      const { name, image, icon } = item;
      const block = new Panel(undefined, { width: 'calc(50% - 0.5px)', height: '5rem', background: { color: Theme.background.main } });
      block.appendChild(
        <i-vstack
          gap={'0.5rem'} width="100%" height="100%"
          verticalAlignment="center" horizontalAlignment="center"
          onClick={(target: Control) => this.onItemSelected(target, item)}
        >
          {icon ? <i-icon name={icon} width={'1.5rem'} height={'1.5rem'} /> : (image ? <i-image url={image} width={'1.5rem'} height={'1.5rem'} /> : [])}
          <i-label caption={name} font={{ size: '0.75rem' }} />
        </i-vstack>
      );
      block.classList.add(blockItemHoverStyled);
      nodeItems.push(block);
    }
    if (this.items.length % 2 === 1) {
      nodeItems.push(<i-panel width="calc(50% - 0.5px)" height={80} background={{ color: Theme.background.main }} />);
    }
    this.hStackItems.clearInnerHTML();
    this.hStackItems.append(...nodeItems);
  }

  private onItemSelected(target: Control, item: IComponentItem) {
    if (this.onSelect) this.onSelect(target, item);
  }

  private onCollapse() {
    this.isShown = !this.isShown;
    this.hStackItems.visible = this.isShown;
    this.iconArrow.name = this.isShown ? 'angle-down' : 'angle-right';
  }

  init() {
    super.init();
    this.onSelect = this.getAttribute('onSelect', true) || this.onSelect;
    this.name = this.getAttribute('name', true) || '';
    this.tooltipText = this.getAttribute('tooltipText', true);
    this.items = this.getAttribute('items', true) || [];
    this.renderUI();
  }

  render() {
    return (
      <i-vstack
        width="100%"
        height="100%"
        margin={{ left: "auto", right: "auto" }}
        position="relative"
        background={{ color: '#26324b' }}
      >
        <i-hstack gap={8} verticalAlignment="center" cursor="pointer" padding={{ left: 8, right: 8, bottom: 8, top: 8 }} onClick={this.onCollapse}>
          <i-icon id="iconArrow" name="angle-down" width={14} height={14} />
          <i-label id="lbName" font={{ size: '0.75rem', bold: true }} />
          <i-icon id="iconTooltip" name="question-circle" width={14} height={14} opacity={0.8} />
        </i-hstack>
        <i-hstack id="hStackItems" gap={1} width="100%" verticalAlignment="center" wrap="wrap" />
      </i-vstack>
    )
  }
}
