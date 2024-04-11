import {
  Module,
  ControlElement,
  customElements,
  Icon,
  Label,
  Container,
  Switch,
  Styles
} from '@ijstech/components'

const Theme = Styles.Theme.ThemeVars

interface DesignerToolHeaderElement extends ControlElement {
  name: string;
  tooltipText?: string;
  hasMediaQuery?: boolean;
  onCollapse: (isShown: boolean) => void;
  onToggleMediaQuery?: (value: boolean) => void;
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
  private _name: string = '';
  private _tooltipText: string = '';
  private _hasMediaQuery: boolean = false;
  private isShown = false;

  private lbName: Label;
  private iconArrow: Icon;
  private iconTooltip: Icon;
  private querySwitch: Switch;

  onCollapse: (isShown: boolean) => void;
  onToggleMediaQuery: (value: boolean) => void;

  constructor(parent?: Container, options?: DesignerToolHeaderElement) {
    super(parent, options);
  }

  get name() {
    return this._name ?? '';
  }
  set name(value: string) {
    this._name = value ?? '';
    this.lbName.caption = this.name;
  }

  get tooltipText() {
    return this._tooltipText ?? '';
  }
  set tooltipText(value: string) {
    this._tooltipText = value ?? '';
    this.iconTooltip.visible = !!this.tooltipText;
    this.iconTooltip.tooltip.content = this.tooltipText || '';
  }

  get hasMediaQuery() {
    return this._hasMediaQuery ?? false;
  }
  set hasMediaQuery(value: boolean) {
    this._hasMediaQuery = value ?? false;
  }

  get checked() {
    return this.hasMediaQuery ? this.querySwitch.checked : false;
  }
  set checked(value: boolean) {
    this.querySwitch.checked = value ?? false;
  }

  private renderUI() {
    this.lbName.caption = this.name;
    this.iconArrow.name = 'angle-down';
    this.iconTooltip.visible = !!this.tooltipText;
    this.iconTooltip.tooltip.content = this.tooltipText || '';
    this.querySwitch.visible = this.hasMediaQuery;
    // this.lbName.font = { size: '0.75rem', bold: true, color: this.isShown ? Theme.colors.primary.main : Theme.text.primary };
  }

  private _onCollapse() {
    this.isShown = !this.isShown;
    this.iconArrow.name = this.isShown ? 'angle-down' : 'angle-right';
    this.onCollapse(this.isShown);
    // this.lbName.font = { size: '0.75rem', bold: true, color: this.isShown ? Theme.colors.primary.main : Theme.text.primary};
  }

  private onQueryChanged() {
    if (this.onToggleMediaQuery) this.onToggleMediaQuery(this.checked);
  }

  init() {
    super.init();
    this.name = this.getAttribute('name', true) || '';
    this.tooltipText = this.getAttribute('tooltipText', true);
    this.hasMediaQuery = this.getAttribute('hasMediaQuery', true, false);
    this.onCollapse = this.getAttribute('onCollapse', true);
    this.renderUI();
  }

  render() {
    return (
      <i-hstack gap={8} verticalAlignment="center" cursor="pointer" padding={{ left: 8, right: 8, bottom: 8, top: 8 }} background={{ color: '#26324b' }} onClick={this._onCollapse}>
        <i-icon id="iconArrow" name="angle-down" width={14} height={14} />
        <i-label id="lbName" font={{ size: '0.75rem', bold: true }} />
        <i-icon id="iconTooltip" name="exclamation-circle" width={14} height={14} opacity={0.8} />
        <i-panel margin={{ left: 'auto' }}>
          <i-hstack
            verticalAlignment='center' horizontalAlignment='end'
          >
            <i-switch
              id="querySwitch"
              onChanged={this.onQueryChanged.bind(this)}
            ></i-switch>
          </i-hstack>
        </i-panel>
      </i-hstack>
    )
  }
}
