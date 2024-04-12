import {
  Module,
  ControlElement,
  customElements,
  Icon,
  Label,
  Container,
  Switch,
  Styles,
  Control
} from '@ijstech/components'
import { customSwitchStyle } from './index.css';

const Theme = Styles.Theme.ThemeVars

interface DesignerToolHeaderElement extends ControlElement {
  name: string;
  tooltipText?: string;
  hasMediaQuery?: boolean;
  onCollapse: (isShown: boolean) => void;
  onReset?: () => void;
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
  private lblSwitch: Label;

  onCollapse: (isShown: boolean) => void;
  onReset: () => void;
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

  set isChanged(value: boolean) {
    if (this.lbName) {
      this.lbName.font = { size: '0.75rem', bold: true, color: value ? Theme.colors.success.main : Theme.text.primary };
    }
  }

  set isQueryChanged(value: boolean) {
    if (this.lblSwitch) {
      this.lblSwitch.font = { size: '0.75rem', bold: true, color: value ? Theme.colors.success.main : Theme.text.primary };
    }
  }

  private renderUI() {
    this.lbName.caption = this.name;
    this.iconArrow.name = 'angle-down';
    this.iconTooltip.visible = !!this.tooltipText;
    this.iconTooltip.tooltip.content = this.tooltipText || '';
    this.querySwitch.visible = this.hasMediaQuery;
  }

  private _onCollapse() {
    this.isShown = !this.isShown;
    this.iconArrow.name = this.isShown ? 'angle-down' : 'angle-right';
    this.onCollapse(this.isShown);
  }

  private _onClear(target: Control, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.onReset) this.onReset();
  }

  private onQueryChanged() {
    if (this.onToggleMediaQuery) this.onToggleMediaQuery(this.checked);
  }

  init() {
    super.init();
    this.name = this.getAttribute('name', true) || '';
    this.tooltipText = this.getAttribute('tooltipText', true);
    this.hasMediaQuery = this.getAttribute('hasMediaQuery', true, false);
    this.onCollapse = this.getAttribute('onCollapse', true) || this.onCollapse;
    this.onToggleMediaQuery = this.getAttribute('onToggleMediaQuery', true) || this.onToggleMediaQuery;
    this.onReset = this.getAttribute('onReset', true) || this.onReset;
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
            verticalAlignment='center'
            horizontalAlignment='end'
            gap="0.5rem"
          >
            <i-hstack verticalAlignment='center' horizontalAlignment='end' gap="0.5rem" stack={{shrink: '0'}}>
              <i-label id="lblSwitch" caption='Media Query' font={{size: '0.75rem'}}></i-label>
              <i-switch
                id="querySwitch"
                class={customSwitchStyle}
                onChanged={this.onQueryChanged.bind(this)}
              ></i-switch>
            </i-hstack>
            <i-panel hover={{opacity: 1}}>
              <i-button
                icon={{ name: 'times', width: '0.75rem', height: '0.75rem', fill: Theme.text.primary }}
                boxShadow='none'
                border={{radius: '50%', width: '1px', style: 'solid', color: Theme.divider}}
                padding={{top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem'}}
                background={{color: 'transparent'}}
                cursor='pointer'
                opacity={0.8}
                tooltip={{ content: 'Reset values', placement: 'topRight' }}
                onClick={this._onClear}
              ></i-button>
            </i-panel>
          </i-hstack>
        </i-panel>
      </i-hstack>
    )
  }
}
