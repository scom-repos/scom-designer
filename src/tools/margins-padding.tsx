import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Modal,
  Label,
  Button,
  Input
} from '@ijstech/components'
import { bgInputTransparent, buttonAutoStyled, textInputRight, unitStyled } from './index.css';
import DesignerToolModalSpacing from './modal-spacing';
import { IMediaQuery, onChangedCallback, onUpdateCallback } from '../interface';
import { isSameValue, parseNumberValue } from '../helpers/utils';
import DesignerToolHeader from './header';
import { getBreakpointInfo, getFont } from '../helpers/config';
import { getBreakpoint } from '../helpers/store';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolMarginsAndPaddingElement extends ControlElement {
  onChanged?: onChangedCallback;
  onUpdate?: onUpdateCallback;
}

interface IDesignerSpacing {
  margin?: {
    top?: string|number;
    right?: string|number;
    bottom?: string|number;
    left?: string|number;
  };
  padding?: {
    top?: string|number;
    right?: string|number;
    bottom?: string|number;
    left?: string|number;
  };
  mediaQuery?: IMediaQuery;
  default?: {[name: string]: any};
}

export const DESIGNER_SPACING_PROPS = ['margin', 'padding'];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-margins-padding']: DesignerToolMarginsAndPaddingElement
    }
  }
}

@customElements('designer-tool-margins-padding')
export default class DesignerToolMarginsAndPadding extends Module {
  private vStackContent: VStack;
  private mdUnits: Modal;
  private mdSpacing: DesignerToolModalSpacing;
  private currentLabel: Label;
  private marginInput: Input;
  private paddingInput: Input;
  private vStackIndividual: VStack;
  private designerHeader: DesignerToolHeader;
  private lblPadding: Label;
  private lblMargin: Label;

  private _data: IDesignerSpacing = {};
  private currentProp: string = '';
  private _idvChanged: boolean = false;

  onChanged: onChangedCallback;
  onUpdate: onUpdateCallback;

  constructor(parent?: Container, options?: DesignerToolMarginsAndPaddingElement) {
    super(parent, options);
    this.onSpacingChanged = this.onSpacingChanged.bind(this);
    this.onToggleMediaQuery = this.onToggleMediaQuery.bind(this);
    this.onResetData = this.onResetData.bind(this);
  }

  private get isChecked() {
    return this.designerHeader.checked;
  }

  private get currentData() {
    let data = JSON.parse(JSON.stringify(this._data));
    if (this.isChecked) {
      const { margin, padding } = this._data.mediaQuery?.properties|| {};
      if (margin) data.margin = {...(data?.margin || {}), ...margin};
      if (padding) data.padding = {...(data?.padding || {}), ...padding};
    }
    return data;
  }

  private hasMediaQuery() {
    const breakpointProps = this._data.mediaQuery?.properties|| {};
    return Object.keys(breakpointProps).some(prop => DESIGNER_SPACING_PROPS.includes(prop));
  }

  setData(data: IDesignerSpacing) {
    this._data = data;
    const olChecked = this.designerHeader.checked;
    this.designerHeader.checked = !!this.hasMediaQuery();
    this.renderUI(olChecked !== this.designerHeader.checked);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI(needUpdate = false) {
    const data = this.currentData;
    this._idvChanged = false;
    this.designerHeader.isQueryChanged = !!this.hasMediaQuery();
    this.updateButtons(data);
    this.resetInputs(data);
    this.updateHighlight(data);
    if (this.onUpdate && needUpdate) this.onUpdate(this.isChecked, DESIGNER_SPACING_PROPS);
  }

  private resetInputs(data: IDesignerSpacing) {
    const { padding, margin } = data;
    const paddingValues = Object.values(padding || {});
    const marginValues = Object.values(margin || {});
    const samePValue = paddingValues.length === 4 && paddingValues.every(v => v === paddingValues[0]);
    const sameMValue = marginValues.length === 4 && marginValues.every(v => v === marginValues[0]);
    if (samePValue) {
      this.paddingInput.value = `${parseNumberValue(paddingValues[0])?.value || ''}`;
    }
    if (sameMValue) {
      this.marginInput.value =  `${parseNumberValue(marginValues[0])?.value || ''}`;
    }
  }

  private updateHighlight(data: IDesignerSpacing) {
    const isSameMargin = this.checkValues('margin', data.margin) || this.marginInput.value === '';
    const isSamePadding = this.checkValues('padding', data.padding) || this.paddingInput.value === '';
    this.lblMargin.font = getFont(isSameMargin);
    this.lblPadding.font = getFont(isSamePadding);
    const hasChanged = this._idvChanged || !isSameMargin || !isSamePadding;
    if (!this.isChecked) this.designerHeader.isChanged = hasChanged;
  }

  private checkValues(prop: string, newVal: any) {
    let result = false;
    if (this.isChecked) {
      result = isSameValue(this._data[prop] || '', newVal);
    } else {
      result = isSameValue(this._data.default?.[prop] || '', newVal);
    }
    return result;
  }

  private updateButtons(data: IDesignerSpacing) {
    const buttons = this.vStackIndividual.querySelectorAll('i-button');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i] as Button;
      const id = button.id || '';
      const match = /^(margin|padding)(.*)/.exec(id);
      if (match?.length) {
        const position = (match[2] || '').toLowerCase();
        const valueStr = data[match[1]]?.[position];
        const parseData = parseNumberValue(valueStr);
        let isSame = true;
        if (this.isChecked) {
          isSame = isSameValue(this._data[match[1]]?.[position] || '', valueStr || '');
        } else {
          isSame = !valueStr;
          if (!isSame && !this._idvChanged) this._idvChanged = true;
        }
        button.border.color = isSame ? Theme.action.selectedBackground : Theme.colors.success.main;
        button.caption = parseData?.value !== '' ? `${parseData?.value}${parseData?.unit}` : 'auto';
      }
    }
  }

  private onOverallChanged(target: Input, prop: 'padding' | 'margin') {
    const nextLabel = target.nextSibling as Label;
    const targetVal = target.value;
    const unit = nextLabel?.caption || 'px';
    const value = targetVal !== '' ? `${targetVal}${unit}` : '';
    this.handleValueChanged(prop, { top: value, right: value, bottom: value, left: value});
  }

  private onShowUnitsModal(target: Label, prop: string) {
    this.currentLabel = target as Label;
    this.currentProp = prop;
    const rect = target.getBoundingClientRect();
    const { x, y } = rect;
    const mdWrapper = this.mdUnits.querySelector('.modal-wrapper') as HTMLElement;
    mdWrapper.style.top = `${y + 24}px`;
    mdWrapper.style.left = `${x}px`;
    this.mdUnits.visible = true;
  }

  private async initModalUnits() {
    this.mdUnits = await Modal.create({
      visible: false,
      showBackdrop: false,
      minWidth: '1.5rem',
      height: 'auto',
      popupPlacement: 'bottom'
    });
    const mdWrapper = this.mdUnits.querySelector('.modal-wrapper') as HTMLElement;
    mdWrapper.style.width = '1.5rem';
    mdWrapper.style.paddingInline = '0px';
    const onUnitChanged = (value: 'px' | '%') => {
      this.currentLabel.caption = value;
      const valueObj = this._data[this.currentProp]
      if (valueObj) {
        for (let prop in valueObj) {
          const numValue = parseNumberValue(valueObj[prop])?.value;
          const valueStr = numValue !== '' ? `${numValue}${value}` : '';
          this.handleValueChanged(this.currentProp, valueStr, prop);
        }
      }
      this.mdUnits.visible = false;
    }
    const itemUnits = new VStack(undefined, { gap: 8, border: { radius: 8 } });
    itemUnits.appendChild(<i-button background={{ color: 'transparent' }} boxShadow="none" caption="px" font={{ size: '0.625rem' }} onClick={() => onUnitChanged('px')} />);
    itemUnits.appendChild(<i-button background={{ color: 'transparent' }} boxShadow="none" caption="%" font={{ size: '0.625rem' }} onClick={() => onUnitChanged('%')} />);
    this.mdUnits.item = itemUnits;
    document.body.appendChild(this.mdUnits);
  }

  private onShowSpacingModal(target: Button, type: 'margin'|'padding', position: 'left' | 'right' | 'top' | 'bottom') {
    const data = this.currentData;
    const spacing = {
      type,
      position,
      value: data[type]?.[position] || ''
    }
    const breakpoint = getBreakpointInfo(getBreakpoint())
    const config = {
      title: `${type} ${position}`,
      iconName: breakpoint?.icon,
      breakpointText: `Configure a value for ${breakpoint?.name || ''} screen sizes or larger`
    }
    this.mdSpacing.onShowModal(target, spacing, config);
  }

  private onSpacingChanged(type: string, position: string, value: string) {
    this.handleValueChanged(type, value, position);
  }

  private handleValueChanged(type: string, value: any, position?: string) {
    if (this.isChecked) {
      this.handleMediaQuery(type, value, position);
    } else {
      if (position) {
        if (!this._data[type]) this._data[type] = {};
        this._data[type][position] = value;
      } else {
        this._data[type] = value;
      }
      if (this.onChanged) this.onChanged(type, this._data[type]);
    }
    this.renderUI();
  }

  private handleMediaQuery(prop: string, value: any, position?: string) {
    if (position) {
      const propObj = this._data.mediaQuery['properties'][prop] || {};
      propObj[position] = value;
      this._data.mediaQuery['properties'][prop] = propObj;
    } else {
      this._data.mediaQuery['properties'][prop] = value;
    }
    if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQuery, prop);
  }

  private onToggleMediaQuery(value: boolean) {
    this.renderUI(true);
  }

  private onResetData() {
    if (this.isChecked) {
      const breakpoint = this._data.mediaQuery.properties;
      this._data.mediaQuery.properties = (({ margin, padding, ...o }) => o)(breakpoint);
      if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQuery);
    } else {
      const clonedData = JSON.parse(JSON.stringify(this._data));
      const cloneDefault = JSON.parse(JSON.stringify(clonedData.default));
      this._data = { ...clonedData, ...cloneDefault };
      for (let prop of DESIGNER_SPACING_PROPS) {
        if (this.onChanged) this.onChanged(prop, this._data[prop]);
      }
    }
    this.renderUI(true);
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    this.initModalUnits();
  }

  render() {
    return (
      <i-vstack
        width="100%"
        height="100%"
        margin={{ left: "auto", right: "auto" }}
        position="relative"
      >
        <designer-tool-header
          id="designerHeader"
          name="Margins And Padding"
          hasMediaQuery={true}
          tooltipText="Margins create extra space around an element, while padding creates extra space within an element."
          onCollapse={this.onCollapse}
          onToggleMediaQuery={this.onToggleMediaQuery}
          onReset={this.onResetData}
        />
        <i-vstack id="vStackContent" gap={16} padding={{ top: 16, bottom: 16, left: 12, right: 12 }} visible={false}>
          <i-vstack gap={8}>
            <i-label caption="OVERALL" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-hstack gap={16} verticalAlignment="center">
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label id="lblMargin" caption="Margin" font={{ size: '0.75rem' }} />
                <i-hstack verticalAlignment="center" width={80} border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
                  <i-input
                    id="marginInput"
                    inputType="number"
                    placeholder="auto"
                    background={{ color: 'transparent' }}
                    width="calc(100% - 1.5rem)"
                    height={24}
                    border={{ width: 0 }}
                    padding={{ left: 4, right: 2 }}
                    font={{ size: '0.675rem' }}
                    onBlur={(target: Input) => this.onOverallChanged(target, 'margin')}
                    onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && this.onOverallChanged(target, 'margin')}
                    class={`${textInputRight} ${bgInputTransparent}`}
                  />
                  <i-label
                    caption="px"
                    font={{ size: '0.675rem' }}
                    cursor="pointer"
                    width={24}
                    height={24}
                    lineHeight="1.5rem"
                    opacity={1}
                    border={{
                      left: {
                        width: 1,
                        style: 'solid',
                        color: Theme.action.focus
                      }
                    }}
                    class={`text-center ${unitStyled}`}
                    onClick={(target: Label) => this.onShowUnitsModal(target, 'margin')}
                  />
                </i-hstack>
              </i-grid-layout>
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label id="lblPadding" caption="Padding" font={{ size: '0.75rem' }} />
                <i-hstack verticalAlignment="center" width={80} border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
                  <i-input
                    id="paddingInput"
                    inputType="number"
                    placeholder="auto"
                    background={{ color: 'transparent' }}
                    width="calc(100% - 1.5rem)"
                    height={24}
                    border={{ width: 0 }}
                    padding={{ left: 4, right: 2 }}
                    font={{ size: '0.675rem' }}
                    onBlur={(target: Input) => this.onOverallChanged(target, 'padding')}
                    onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && this.onOverallChanged(target, 'padding')}
                    class={`${textInputRight} ${bgInputTransparent}`}
                  />
                  <i-label
                    caption="px"
                    font={{ size: '0.675rem' }}
                    cursor="pointer"
                    width={24}
                    height={24}
                    lineHeight="1.5rem"
                    opacity={1}
                    border={{
                      left: {
                        width: 1,
                        style: 'solid',
                        color: Theme.action.focus
                      }
                    }}
                    class={`text-center ${unitStyled}`}
                    onClick={(target: Label) => this.onShowUnitsModal(target, 'padding')}
                  />
                </i-hstack>
              </i-grid-layout>
            </i-hstack>
          </i-vstack>
          <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
          <i-vstack id="vStackIndividual" gap={8}>
            <i-label caption="INDIVIDUAL" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={8} width="100%" horizontalAlignment="center">
              <i-hstack position="relative" width="100%" horizontalAlignment="center">
                <i-label caption="Margin" font={{ size: '0.75rem' }} position="absolute" top={0} left={0} />
                <i-button id="marginTop" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'margin', 'top')} />
              </i-hstack>
              <i-hstack width="100%" verticalAlignment="center" horizontalAlignment="space-between">
                <i-button id="marginLeft" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'margin', 'left')} />
                <i-panel position="relative" width={200} padding={{ top: 10, bottom: 10, left: 10, right: 10 }} border={{ width: 4, style: 'solid', color: Theme.action.selectedBackground }}>
                  <i-label caption="Padding" font={{ size: '0.75rem' }} position="absolute" top={10} left={10} />
                  <i-vstack horizontalAlignment="center">
                    <i-button id="paddingTop" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'padding', 'top')} />
                    <i-hstack width="100%" horizontalAlignment="space-between">
                      <i-button id="paddingLeft" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'padding', 'left')} />
                      <i-button id="paddingRight" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'padding', 'right')} />
                    </i-hstack>
                    <i-button id="paddingBottom" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'padding', 'bottom')} />
                  </i-vstack>
                </i-panel>
                <i-button id="marginRight" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'margin', 'right')} />
              </i-hstack>
              <i-button id="marginBottom" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'margin', 'bottom')} />
            </i-vstack>
          </i-vstack>
        </i-vstack>
        <designer-tool-modal-spacing id="mdSpacing" onChanged={this.onSpacingChanged} />
      </i-vstack>
    )
  }
}
