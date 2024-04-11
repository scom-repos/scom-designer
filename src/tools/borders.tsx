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
  Label,
} from '@ijstech/components'
import { bgInputTransparent, buttonAutoStyled, customColorStyled, textInputRight } from './index.css';
import DesignerToolModalSpacing from './modal-spacing';
import { onChangedCallback, onUpdateCallback } from '../interface';
import { backgroundOptions, borderStyles, parseNumberValue } from '../helpers/utils';
import DesignerSelector from './selector';
import DesignerToolHeader from './header';
import { getBreakpoint } from '../helpers/store';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolBordersElement extends ControlElement {
  onChanged?: onChangedCallback;
  onUpdate?: onUpdateCallback;
}

interface IDesignerBorder {
  border?: IBorder;
  mediaQueries?: any[];
}
const DESIGNER_PROPS = ['border'];

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
  private bgColor: ColorPicker;
  private designerHeader: DesignerToolHeader;
  private spacingBtn: Button|undefined = undefined;

  private _data: IDesignerBorder = {};
  private radiusObj = {
    topLeft: '',
    topRight: '',
    bottomLeft: '',
    bottomRight: ''
  }

  onChanged: onChangedCallback;
  onUpdate: onUpdateCallback;

  constructor(parent?: Container, options?: DesignerToolBordersElement) {
    super(parent, options);
    this.onSpacingChanged = this.onSpacingChanged.bind(this);
    this.onToggleMediaQuery = this.onToggleMediaQuery.bind(this);
  }

  private get isChecked() {
    return this.designerHeader.checked;
  }

  private hasMediaQuery() {
    const breakpointProps = this._data.mediaQueries?.[getBreakpoint()]?.properties|| {};
    return Object.hasOwnProperty.call(breakpointProps, 'border');
  }

  setData(value: IDesignerBorder) {
    this.spacingBtn = undefined;
    this._data = value;
    const olChecked = this.designerHeader.checked;
    this.designerHeader.checked = !!this.hasMediaQuery();
    this.renderUI(olChecked !== this.designerHeader.checked);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI(needUpdate = false) {
    let data = this._data;
    if (this.isChecked) {
      const breakpointProps = this._data.mediaQueries?.[getBreakpoint()]?.properties|| {};
      data = {...data, ...breakpointProps};
    }
    const { border = {} } = data;
    const parsedRadius = border?.radius && parseNumberValue(border.radius);
    this.inputRadius.value = parsedRadius ? parsedRadius.value : '';
    const parsedWidth = border?.width && parseNumberValue(border.width);
    this.inputWidth.value = parsedWidth ? parsedWidth.value : '';
    this.bgColor.value = border?.color ?? '';
    const radius = data?.border?.radius;
    if (radius !== undefined) {
      const radiusStr = typeof radius === 'number' ? `${radius}px` : radius;
      this.setRadiusByPosition(radiusStr);
    }
    this.updateButtons(data);
    this.styleSelector.activeItem = border?.style || '';
    if (this.onUpdate && needUpdate) this.onUpdate(this.isChecked, DESIGNER_PROPS);
  }

  private updateButtons(data: IDesignerBorder) {
    const buttons = this.pnlIndividual.querySelectorAll('i-button');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i] as Button;
      const id = button.id || '';
      const result = /(.*)(Radius|Width)$/.exec(id);
      if (!result) continue;
      const type = result[2];
      const position = result[1];
      const value = type === 'width' ? data.border?.[position]?.[type] : this.radiusObj[position];
      button.caption = (typeof value === 'number' ? `${value}px` : value) || 'auto';
    }
  }

  private onShowSpacingModal(target: Button, type: string, position: string) {
    this.spacingBtn = target;
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
    const isNotNumber = Number.isNaN(Number(value)) || value === '';
    const newVal = isNotNumber ? value : `${value}px`;
    this.handleValueChanged(prop, newVal);
    const label = target.parentElement?.previousSibling as Label;
    if (label) label.font = { size: '0.75rem', color: value ? Theme.colors.success.main : Theme.text.primary };
    this.updateButtons(this._data);
  }

  private onSpacingChanged(type: string, position: string, value: string) {
    if (type === 'width') {
      this.handleValueChanged('width', value, position);
    } else {
      this.radiusObj[position] = value;
      const radiusText = `${this.radiusObj.topLeft} ${this.radiusObj.topRight} ${this.radiusObj.bottomRight} ${this.radiusObj.bottomLeft}`;
      this.handleValueChanged('radius', radiusText);
    }
    if (this.spacingBtn) {
      const parseData = parseNumberValue(value);
      this.spacingBtn.caption = parseData?.value !== '' ? `${parseData?.value}${parseData?.unit}` : 'auto';
    }
    this.spacingBtn = undefined;
  }

  private handleValueChanged(type: string, value: any, position?: string) {
    const inQuery = this.designerHeader.checked;
    if (inQuery) {
      this.handleMediaQuery(type, value, position);
    } else {
      if (position) {
        if (!this._data.border[position]) this._data.border[position] = {};
        this._data.border[position][type] = value;
      } else {
        this._data.border[type] = value;
      }
      if (this.onChanged) this.onChanged('border', this._data.border);
    }
    this.renderUI();
  }

  private handleMediaQuery(prop: string, value: any, position?: string) {
    let border = this._data.mediaQueries[getBreakpoint()]['properties']['border'];
    if (!border) border = JSON.parse(JSON.stringify(this._data.border || {}));
    if (position) {
      if (!border[position]) border[position] = {};
      border[position][prop] = value;
    } else {
      border[prop] = value;
    }
    this._data.mediaQueries[getBreakpoint()]['properties']['border'] = border;
    if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQueries, 'border');
  }

  private onToggleMediaQuery(value: boolean) {
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
          name="Borders"
          hasMediaQuery={true}
          tooltipText="Define the border size and styles."
          onCollapse={this.onCollapse}
          onToggleMediaQuery={this.onToggleMediaQuery}
        />
        <i-vstack id="vStackContent" gap={16} padding={{ top: 16, bottom: 16, left: 12, right: 12 }} visible={false}>
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
                    onBlur={(target: Input) => this.onPropChanged(target, 'width')}
                    onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && this.onPropChanged(target, 'width')}
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
                    onBlur={(target: Input) => this.onPropChanged(target, 'radius')}
                    onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && this.onPropChanged(target, 'radius')}
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
                  onChanged={(target: ColorPicker) => this.handleValueChanged('color', target.value)}
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
              onChanged={this.handleValueChanged}
            />
          </i-vstack>
        </i-vstack>
        <designer-tool-modal-spacing id="mdSpacing" onChanged={this.onSpacingChanged} />
      </i-vstack>
    )
  }
}
