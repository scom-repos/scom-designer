import {
  Module,
  ControlElement,
  customElements,
  Icon,
  Label,
  Container
} from '@ijstech/components'

interface DesignerToolHeaderElement extends ControlElement {
  name: string;
  tooltipText?: string;
  onCollapse: (isShown: boolean) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-header']: DesignerToolHeaderElement
    }
  }
}

@customElements('designer-tool-header')
export default class DesignerToolHeader extends Module {
  private name: string;
  private tooltipText: string;
  private isShown = true;

  private lbName: Label;
  private iconArrow: Icon;
  private iconTooltip: Icon;
  public onCollapse: (isShown: boolean) => void;

  constructor(parent?: Container, options?: DesignerToolHeaderElement) {
    super(parent, options);
  }

  private renderUI() {
    this.lbName.caption = this.name;
    this.iconArrow.name = 'angle-down';
    this.iconTooltip.visible = !!this.tooltipText;
    this.iconTooltip.tooltip.content = this.tooltipText || '';
  }

  private _onCollapse() {
    this.isShown = !this.isShown;
    this.iconArrow.name = this.isShown ? 'angle-down' : 'angle-right';
    this.onCollapse(this.isShown);
  }

  init() {
    super.init();
    this.name = this.getAttribute('name', true) || '';
    this.tooltipText = this.getAttribute('tooltipText', true);
    this.onCollapse = this.getAttribute('onCollapse', true);
    this.renderUI();
  }

  render() {
    return (
      <i-hstack gap={8} verticalAlignment="center" cursor="pointer" padding={{ left: 8, right: 8, bottom: 8, top: 8 }} background={{ color: '#26324b' }} onClick={this._onCollapse}>
        <i-icon id="iconArrow" name="angle-down" width={14} height={14} />
        <i-label id="lbName" font={{ size: '0.75rem', bold: true }} />
        <i-icon id="iconTooltip" name="exclamation-circle" width={14} height={14} opacity={0.8} />
      </i-hstack>
    )
  }
}
