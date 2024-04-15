import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Button,
  Input,
  Panel,
  Label
} from '@ijstech/components'
import { buttonAutoStyled, textInputRight } from './index.css';
import DesignerToolModalSpacing from './modal-spacing';
import { onChangedCallback, onUpdateCallback } from '../interface';
import { isSameValue, parseNumberValue } from '../helpers/utils';
import DesignerSelector from './selector';
import DesignerToolHeader from './header';
import { getBreakpoint } from '../helpers/store';
import { getBreakpointInfo } from '../helpers/config';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolPositionElement extends ControlElement {
  onChanged?: onChangedCallback;
  onUpdate?: onUpdateCallback;
}

interface IDesignerPosition {
  position?: string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  overflow?: {x?: string, y?: string};
  zIndex?: string;
  mediaQueries?: any[];
  default?: {[name: string]: any};
}

export const DESIGNER_POSITION_PROPS = ['position', 'top', 'right', 'bottom', 'left', 'overflow', 'zIndex'];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-position']: DesignerToolPositionElement
    }
  }
}

@customElements('designer-tool-position')
export default class DesignerToolPosition extends Module {
  private vStackContent: VStack;
  private mdSpacing: DesignerToolModalSpacing;
  private zIndexInput: Input;
  private pnlPosition: Panel;
  private overflowSelector: DesignerSelector;
  private posSelector: DesignerSelector;
  private designerHeader: DesignerToolHeader;
  private lblZIndex: Label;
  private spacingBtn: Button|undefined = undefined;

  private _data: IDesignerPosition = {};

  onChanged: onChangedCallback;
  onUpdate: onUpdateCallback;

  constructor(parent?: Container, options?: DesignerToolPositionElement) {
    super(parent, options);
    this.onSpacingChanged = this.onSpacingChanged.bind(this);
    this.onSelectChanged = this.onSelectChanged.bind(this);
    this.onToggleMediaQuery = this.onToggleMediaQuery.bind(this);
    this.onResetData = this.onResetData.bind(this);
  }

  private get isChecked() {
    return this.designerHeader.checked;
  }

  private get currentData() {
    let data = this._data;
    if (this.isChecked) {
      const breakpointProps = this._data.mediaQueries?.[getBreakpoint()]?.properties|| {};
      data = {...data, ...breakpointProps};
    }
    return data;
  }

  private hasMediaQuery() {
    const breakpointProps = this._data.mediaQueries?.[getBreakpoint()]?.properties|| {};
    return Object.keys(breakpointProps).some(prop => DESIGNER_POSITION_PROPS.includes(prop));
  }

  setData(data: IDesignerPosition) {
    this.spacingBtn = undefined;
    this._data = data;
    const olChecked = this.designerHeader.checked;
    this.designerHeader.checked = !!this.hasMediaQuery();
    this.renderUI(olChecked !== this.designerHeader.checked);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI(needUpdate = false) {
    let data = this.currentData;
    this.designerHeader.isQueryChanged = !!this.hasMediaQuery();
    const { zIndex, position, overflow } = data;
    this.zIndexInput.value = zIndex !== undefined ? `${zIndex}` : '';
    this.posSelector.activeItem = position || '';
    this.overflowSelector.activeItem = overflow?.y || '';
    this.updateButtons(data);
    this.updateHighlight();
    if (this.onUpdate && needUpdate) this.onUpdate(this.isChecked, DESIGNER_POSITION_PROPS);
  }

  private updateHighlight() {
    const pValue = this.posSelector.activeItem;
    this.posSelector.isChanged = !this.checkValues('position', pValue);
    const oValue = this.overflowSelector.activeItem;
    this.overflowSelector.isChanged = !this.checkValues('overflow', oValue);
    const zIndexVal = this.zIndexInput.value;
    const zChanged = !this.checkValues('zIndex', zIndexVal);
    this.lblZIndex.font = { size: '0.75rem', color: zChanged ? Theme.colors.success.main : Theme.text.primary };
    this.designerHeader.isChanged = !this.isChecked && (zChanged || this.posSelector.isChanged || this.overflowSelector.isChanged);
  }

  private checkValues(prop: string, newVal: any) {
    let pResult = false;
    if (this.isChecked) {
      pResult = isSameValue((prop === 'overflow' ? this._data[prop]?.y : this._data[prop]) || '', newVal);
    } else {
      pResult = isSameValue((prop === 'overflow' ? this._data.default?.[prop]?.y : this._data.default?.[prop]) || '', newVal);
    }
    return pResult;
  }

  private updateButtons(data: IDesignerPosition) {
    const buttons = this.pnlPosition.querySelectorAll('i-button');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i] as Button;
      const id = button.id || '';
      const parseData = parseNumberValue(data[id]);
      let isSame = true;
      if (this.isChecked) {
        isSame = isSameValue(this._data[id] || '', data[id] || '');
      } else {
        isSame = !data[id];
      }
      button.border.color = isSame ? Theme.action.selectedBackground : Theme.colors.success.main;
      button.caption = parseData?.value !== '' ? `${parseData?.value}${parseData?.unit}` : 'auto';
    }
  }

  private onShowModal(target: Button, position: string) {
    let data = this.currentData;
    const spacing = {
      type: '',
      position,
      value: data[position] || ''
    }
    const breakpoint = getBreakpointInfo(getBreakpoint())
    const config = {
      title: `${position}`,
      iconName: breakpoint?.icon,
      breakpointText: `Configure a value for ${breakpoint?.name || ''} screen sizes or larger`
    }
    this.mdSpacing.onShowModal(target, spacing, config);
    this.spacingBtn = target;
  }

  private onSelectChanged(type: string, value: string) {
    let updated: any = value;
    if (type === 'overflow') {
      updated = {x: 'hidden', y: value};
    }
    this.handleValueChanged(type, updated);
  }

  private onSpacingChanged(type: string, position: string, value: string) {
    this.handleValueChanged(position, value);
    if (this.spacingBtn) {
      const parseData = parseNumberValue(value);
      this.spacingBtn.caption = parseData?.value !== '' ? `${parseData?.value}${parseData?.unit}` : 'auto';
    }
    this.spacingBtn = undefined;
  }

  private handleValueChanged(type: string, value: any) {
    if (this.isChecked) {
      this.handleMediaQuery(type, value);
    } else {
      this._data[type] = value;
      if (this.onChanged) this.onChanged(type, value);
    }
    this.renderUI();
  }

  private handleMediaQuery(prop: string, value: any) {
    this._data.mediaQueries[getBreakpoint()]['properties'][prop] = value;
    if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQueries, prop);
  }

  private onToggleMediaQuery(value: boolean) {
    this.renderUI(true);
  }

  private onResetData() {
    if (this.isChecked) {
      const breakpoint = this._data.mediaQueries[getBreakpoint()].properties;
      this._data.mediaQueries[getBreakpoint()].properties = (({ position, top, right, bottom, left, overflow, zIndex, ...o }) => o)(breakpoint);
      if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQueries);
    } else {
      const clonedData = JSON.parse(JSON.stringify(this._data));
      const cloneDefault = JSON.parse(JSON.stringify(clonedData.default));
      this._data = { ...clonedData, ...cloneDefault };
      for (let prop of DESIGNER_POSITION_PROPS) {
        if (this.onChanged) this.onChanged(prop, this._data[prop]);
      }
    }
    this.renderUI(true);
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    this.onUpdate = this.getAttribute('onUpdate', true) || this.onUpdate;
    this.position = 'relative';
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
          name="Position"
          tooltipText="Define a relative or absolute position from the parent element."
          hasMediaQuery={true}
          onCollapse={this.onCollapse}
          onToggleMediaQuery={this.onToggleMediaQuery}
          onReset={this.onResetData}
        />
        <i-vstack id="vStackContent" padding={{ top: 16, bottom: 16, left: 12, right: 12 }} visible={false}>
          <i-vstack gap={8}>
            <designer-selector
              id="posSelector"
              title="Position"
              items={[
                { value: 'relative', caption: 'Relative', type: 'position' },
                { value: 'absolute', caption: 'Absolute', type: 'position' },
              ]}
              onChanged={this.onSelectChanged}
            />
            <i-panel width={320} padding={{ top: 10, bottom: 10, left: 20, right: 20 }} border={{ radius: 8, width: 1, style: 'solid', color: Theme.action.selectedBackground }}>
              <i-vstack id="pnlPosition" gap={4} horizontalAlignment="center">
                <i-button id="top" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowModal(target, 'top')} />
                <i-hstack width="100%" horizontalAlignment="space-between">
                  <i-button id="left" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowModal(target, 'left')} />
                  <i-button id="right" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowModal(target, 'right')} />
                </i-hstack>
                <i-button id="bottom" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowModal(target, 'bottom')} />
              </i-vstack>
            </i-panel>
            <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label id="lblZIndex" caption="Z-Index" font={{ size: '0.75rem' }} />
              <i-input
                id="zIndexInput"
                inputType="number"
                placeholder="auto"
                width="100%"
                height={24}
                border={{
                  radius: 8,
                  width: 0
                }}
                padding={{ left: 4, right: 4 }}
                font={{ size: '0.75rem' }}
                onBlur={(target: Input) => this.onSelectChanged('zIndex', target.value)}
                onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && this.onSelectChanged('zIndex', target.value)}
                class={textInputRight}
              />
            </i-grid-layout>
            <designer-selector
              id="overflowSelector"
              title="Overflow"
              items={[
                { value: 'auto', caption: 'Visible', type: 'overflow' },
                { value: 'hidden', caption: 'Hidden', type: 'overflow' },
              ]}
              onChanged={this.onSelectChanged}
            />
          </i-vstack>
        </i-vstack>
        <designer-tool-modal-spacing id="mdSpacing" onChanged={this.onSpacingChanged} />
      </i-vstack>
    )
  }
}
