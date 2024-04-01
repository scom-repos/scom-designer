import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Button,
  IBorder,
  Input,
  ColorPicker,
} from '@ijstech/components'
import { bgInputTransparent, buttonAutoStyled, customColorStyled, textInputRight } from './index.css';
import DesignerToolModalSpacing from './modal-spacing';
import { onChangedCallback } from '../interface';
import { backgroundOptions, borderStyles } from '../helpers/utils';
import DesignerSelector from './selector';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolBordersElement extends ControlElement {
  onChanged?: onChangedCallback;
}

interface IDesignerBorder {
  border?: IBorder;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-borders']: DesignerToolBordersElement
    }
  }
}

@customElements('designer-tool-borders')
export default class DesignerToolBorders extends Module {
  private vStackContent: VStack;
  private mdSpacing: DesignerToolModalSpacing;
  private inputRadius: Input;
  private inputWidth: Input;
  private pnlIndividual: VStack;
  private styleSelector: DesignerSelector;

  private _data: IDesignerBorder = {};
  private radiusObj = {
    topLeft: '',
    topRight: '',
    bottomLeft: '',
    bottomRight: ''
  }

  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: DesignerToolBordersElement) {
    super(parent, options);
    this.onSpacingChanged = this.onSpacingChanged.bind(this);
  }

  setData(value: IDesignerBorder) {
    this._data = value;
    this.renderUI();
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {
    const { border } = this._data;
    this.inputRadius.value = border?.radius ?? '';
    this.inputWidth.value = border?.width ?? '';
    const radius = this._data.border?.radius;
    if (radius !== undefined) {
      const radiusStr = typeof radius === 'number' ? `${radius}px` : radius;
      this.setRadiusByPosition(radiusStr);
    }
    this.updateButtons();
    border.style = border?.style || 'solid';
    this.styleSelector.activeItem = border.style;
  }

  private updateButtons() {
    const buttons = this.pnlIndividual.querySelectorAll('i-button');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i] as Button;
      const id = button.id || '';
      const result = /(.*)(Radius|Width)$/.exec(id);
      if (!result) continue;
      const type = result[2];
      const position = result[1];
      const value = type === 'width' ? this._data.border?.[position]?.[type] : this.radiusObj[position];
      button.caption = (typeof value === 'number' ? `${value}px` : value) || 'auto';
    }
  }

  private onShowSpacingModal(target: Button, type: string, position: string) {
    let value = '';
    if (type === 'width') {
      value = this._data.border?.[position]?.width ?? '';
    } else {
      value = this.radiusObj[position];
    }
    const spacing = {
      value,
      type,
      position
    }
    const config = {
      title: `Border ${position} ${type}`,
      icon: 'mobile-alt',
      breakpointText: 'Configure a value for Mobile screen sizes or larger'
    }
    this.mdSpacing.onShowModal(target, spacing, config);
  }

  private setRadiusByPosition(radius: string) {
    const arr = radius.split(' ');
    if (arr?.length) {
      let [topLeft, topRight, bottomRight, bottomLeft] = arr;
      if (topRight === undefined) topRight = topLeft;
      if (bottomLeft === undefined) bottomLeft = topRight;
      if (bottomRight === undefined) bottomRight = bottomLeft;
      this.radiusObj.topLeft = topLeft;
      this.radiusObj.topRight = topRight;
      this.radiusObj.bottomRight = bottomRight;
      this.radiusObj.bottomLeft = bottomLeft;
    }
  }

  private onPropChanged(target: Input, prop: string) {
    const value = target.value;
    this._data.border[prop] = `${value}px`;
    if (this.onChanged) this.onChanged('border', this._data.border);
  }

  private onSpacingChanged(type: string, position: string, value: string) {
    if (type === 'width') {
      if (!this._data.border[position]) this._data.border[position] = {};
      this._data.border[position].width = value;
    } else {
      this.radiusObj[position] = value;
      const radiusText = `${this.radiusObj.topLeft} ${this.radiusObj.topRight} ${this.radiusObj.bottomRight} ${this.radiusObj.bottomLeft}`;
      this._data.border.radius = radiusText;
    }
    this.updateButtons();
    if (this.onChanged) this.onChanged('border', this._data.border);
  }

  private onStyleChanged(type: string, value: string) {
    const border = {
      ...(this._data.border || {}),
      [type]: value
    }
    this._data.border = border;
    if (this.onChanged) this.onChanged('border', border);
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true);
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
        <designer-tool-header name="Borders" tooltipText="Define the border size and styles." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" gap={16} padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-vstack gap={8}>
            <i-label caption="OVERALL" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-hstack gap={16} verticalAlignment="center">
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label caption="Width" font={{ size: '0.75rem' }} />
                <i-hstack verticalAlignment="center" width={80} border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
                  <i-input
                    id="inputWidth"
                    inputType="number"
                    placeholder="auto"
                    background={{ color: 'transparent' }}
                    width="100%"
                    height={24}
                    border={{ width: 0 }}
                    padding={{ left: 4, right: 4 }}
                    font={{ size: '0.675rem' }}
                    class={`${textInputRight} ${bgInputTransparent}`}
                    onChanged={(target: Input) => this.onPropChanged(target, 'width')}
                  />
                </i-hstack>
              </i-grid-layout>
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label caption="Radius" font={{ size: '0.75rem' }} />
                <i-hstack verticalAlignment="center" width={80} border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
                  <i-input
                    id="inputRadius"
                    inputType="number"
                    placeholder="auto"
                    background={{ color: 'transparent' }}
                    width="100%"
                    height={24}
                    border={{ width: 0 }}
                    padding={{ left: 4, right: 4 }}
                    font={{ size: '0.675rem' }}
                    class={`${textInputRight} ${bgInputTransparent}`}
                    onChanged={(target: Input) => this.onPropChanged(target, 'radius')}
                  />
                </i-hstack>
              </i-grid-layout>
            </i-hstack>
          </i-vstack>
          <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
          <i-vstack id="pnlIndividual" gap={8}>
            <i-label caption="INDIVIDUAL EDGES" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={8} width="100%" horizontalAlignment="center">
              <i-hstack position="relative" width="100%" horizontalAlignment="center">
                <i-label caption="Width" font={{ size: '0.75rem' }} position="absolute" top={0} left={0} />
                <i-button id="topWidth" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'width', 'top')} />
              </i-hstack>
              <i-hstack width="100%" verticalAlignment="center" horizontalAlignment="space-between">
                <i-button id="leftWidth" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'width', 'left')} />
                <i-vstack verticalAlignment="space-between" width={200} height={100} padding={{ top: 4, bottom: 4, left: 4, right: 4 }} border={{ width: 4, style: 'solid', color: Theme.action.selectedBackground }}>
                  <i-hstack width="100%" verticalAlignment="center" horizontalAlignment="space-between">
                    <i-button id="topLeftRadius" caption="0" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'radius', 'topLeft')} />
                    <i-label caption="Radius" font={{ size: '0.75rem' }} />
                    <i-button id="topRightRadius" caption="0" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'radius', 'topRight')} />
                  </i-hstack>
                  <i-hstack width="100%" horizontalAlignment="space-between">
                    <i-button id="bottomLeftRadius" caption="0" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'radius', 'bottomLeft')} />
                    <i-button id="bottomRightRadius" caption="0" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'radius', 'bottomRight')} />
                  </i-hstack>
                </i-vstack>
                <i-button id="rightWidth" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'width', 'right')} />
              </i-hstack>
              <i-button id="bottomWidth" caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'width', 'bottom')} />
            </i-vstack>
          </i-vstack>
          <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
          <i-vstack gap={8}>
            <i-label caption="DECORATION" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-grid-layout width="100%" templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label caption="Color" font={{ size: '0.75rem' }} />
              <i-hstack gap={4} width="100%" verticalAlignment="center">
                <i-color
                  id="bgColor"
                  onChanged={(target: ColorPicker) => this.onStyleChanged('color', target.value)}
                  class={customColorStyled}
                />
                <i-combo-box
                  width="calc(100% - 28px)"
                  items={backgroundOptions}
                  placeholder="Type or select a color..."
                />
              </i-hstack>
            </i-grid-layout>
            <designer-selector
              id="styleSelector"
              title="Style"
              items={borderStyles}
              onChanged={this.onStyleChanged}
            />
          </i-vstack>
        </i-vstack>
        <designer-tool-modal-spacing id="mdSpacing" onChanged={this.onSpacingChanged} />
      </i-vstack>
    )
  }
}
