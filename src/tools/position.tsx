import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Button,
  Input,
  Control,
  Panel
} from '@ijstech/components'
import { buttonAutoStyled, customIconLayoutActiveStyled, textInputRight } from './index.css';
import DesignerToolModalSpacing from './modal-spacing';
import { onChangedCallback } from '../interface';
import { parseNumberValue } from '../utils';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolPositionElement extends ControlElement {
  onChanged?: onChangedCallback;
}

interface IDesignerPosition {
  position?: string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  overflow?: string;
  zIndex?: string;
}

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

  private _data: IDesignerPosition = {};

  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: DesignerToolPositionElement) {
    super(parent, options);
    this.onSpacingChanged = this.onSpacingChanged.bind(this);
    this.onSelectChanged = this.onSelectChanged.bind(this);
  }

  setData(data: IDesignerPosition) {
    this._data = data;
    this.renderUI();
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {
    const { zIndex, position, overflow } = this._data;
    if (zIndex !== undefined) this.zIndexInput.value = `${zIndex}`;
    if (position) {
      const positionEl = this.vStackContent.querySelector(`#lb${position.charAt(0).toUpperCase() + position.slice(1)}`) as Control;
      if (positionEl) positionEl.classList.add(customIconLayoutActiveStyled);
    }
    if (overflow) {
      const overflowEl = this.vStackContent.querySelector(`#lb${overflow.charAt(0).toUpperCase() + overflow.slice(1)}`) as Control;
      if (overflowEl) overflowEl.classList.add(customIconLayoutActiveStyled);
    }
    this.updateButtons();
  }

  private updateButtons() {
    const buttons = this.pnlPosition.querySelectorAll('i-button');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i] as Button;
      const id = button.id || '';
      const parseData = parseNumberValue(this._data[id]);
      button.caption = parseData?.value !== '' ? `${parseData?.value}${parseData?.unit}` : 'auto';
    }
  }

  private onShowModal(target: Button, position: string) {
    const spacing = {
      type: '',
      position,
      value: this._data[position] || ''
    }
    const config = {
      title: `${position}`,
      icon: 'mobile-alt',
      breakpointText: 'Configure a value for Mobile screen sizes or larger'
    }
    this.mdSpacing.onShowModal(target, spacing, config);
  }

  private onZIndexChanged(input: Input, prop: string) {
    const value = input.value;
    this._data[prop] = value;
    if (this.onChanged) this.onChanged(prop, value);
  }

  private onSelectChanged(type: string, value: string) {
    this._data[type] = value;
    if (this.onChanged) this.onChanged(type, value);
  }

  private onSpacingChanged(type: string, position: string, value: string) {
    this._data[position] = value;
    this.updateButtons();
    if (this.onChanged) this.onChanged(position, value);
  }

  init() {
    super.init();
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
        <designer-tool-header name="Position" tooltipText="Define a relative or absolute position from the parent element." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
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
              <i-label caption="Z-Index" font={{ size: '0.75rem' }} />
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
                onChanged={(target: Input) => this.onZIndexChanged(target, 'zIndex')}
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
