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
  Label
} from '@ijstech/components'
import { bgInputTransparent, buttonAutoStyled, customColorStyled, textInputRight } from './index.css';
import DesignerToolModalSpacing from './modal-spacing';
import { IMediaQuery, onChangedCallback, onUpdateCallback } from '../interface';
import { backgroundOptions, borderStyles, isNumber, isSameValue, parseNumberValue } from '../helpers/utils';
import DesignerSelector from './selector';
import DesignerToolHeader from './header';
import { getBreakpoint } from '../helpers/store';
import { getBreakpointInfo, getFont } from '../helpers/config';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolBordersElement extends ControlElement {
  onChanged?: onChangedCallback;
  onUpdate?: onUpdateCallback;
}

interface IDesignerBorder {
  border?: IBorder;
  mediaQuery?: IMediaQuery;
  default?: {[name: string]: any};
}

export const DESIGNER_BORDER_PROPS = ['border'];

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
  private lblColor: Label;
  private designerHeader: DesignerToolHeader;
  private lblWidth: Label;
  private lblRadius: Label;

  private _data: IDesignerBorder = {};
  private radiusObj = {
    topLeft: '',
    topRight: '',
    bottomLeft: '',
    bottomRight: ''
  }
  private widthObj = {
    top: '',
    right: '',
    bottom: '',
    left: ''
  }
  private _idvChanged: boolean = false;

  onChanged: onChangedCallback;
  onUpdate: onUpdateCallback;

  constructor(parent?: Container, options?: DesignerToolBordersElement) {
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
      const border = this._data.mediaQuery?.properties?.border || {};
      data.border = {...data.border, ...border};
    }
    return data;
  }

  private hasMediaQuery() {
    const breakpointProps = this._data.mediaQuery?.properties || {};
    const hasProp = Object.hasOwnProperty.call(breakpointProps, 'border');
    return hasProp && !isSameValue(this._data.border ?? this._data.default?.border, breakpointProps.border || {});
  }

  setData(value: IDesignerBorder) {
    this._data = value;
    const olChecked = this.designerHeader.checked;
    this.designerHeader.checked = !!this.hasMediaQuery();
    this.renderUI(olChecked !== this.designerHeader.checked);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI(needUpdate = false) {
    let data = this.currentData;
    this._idvChanged = false;
    this.designerHeader.isQueryChanged = !!this.hasMediaQuery();
    const { border = {} } = data;
    this.updateOverall(border);
    this.styleSelector.activeItem = border?.style || 'solid';
    this.bgColor.value = border?.color ?? '';

    this.updateButtons(data);
    this.updateHighlight();
    if (this.onUpdate && needUpdate) this.onUpdate(this.isChecked, DESIGNER_BORDER_PROPS);
  }

  private updateOverall(border: IBorder) {
    const { radius, width } = border;
    const radiusStr = isNumber(radius) ? `${radius}px` : radius;
    this.radiusObj = this.radiusByPosition(radiusStr as string);
    const values = Object.values(this.radiusObj);
    const sameValue = values.every(v => v === values[0]);
    if (sameValue) {
      const parsedRadius = parseNumberValue(values[0])?.value ?? '';
      this.inputRadius.value = parsedRadius;
    }
    this.widthObj = this.widthByPosition(border);
    const widthStr = parseNumberValue(width)?.value ?? '';
    this.inputWidth.value = widthStr;
  }

  private updateHighlight() {
    if (Object.keys(this._data.default || {}).length === 0) return;
    const wValue = this.inputWidth.value === '' ? '' : `${this.inputWidth.value}px`;
    const rValue = this.inputRadius.value === '' ? '' : `${this.inputRadius.value}px`;
    const wResult = this.checkValues('width', wValue);
    const rResult = this.checkValues('radius', rValue);
    const cResult = this.checkValues('color', this.bgColor.value);
    this.lblWidth.font = getFont(wResult);
    this.lblRadius.font = getFont(rResult);
    this.lblColor.font = getFont(cResult);
    this.styleSelector.isChanged = !this.checkValues('style', this.styleSelector.activeItem as string);
    const hasChanged = this._idvChanged || !wResult || !rResult || !cResult || this.styleSelector.isChanged;
    if (!this.isChecked) this.designerHeader.isChanged = hasChanged;
  }

  private checkValues(prop: string, newVal: string) {
    let result = false;
    if (this.isChecked) {
      result = isSameValue(this._data.border?.[prop] ?? '', newVal);
    } else {
      result = isSameValue(this._data.default.border?.[prop] ?? '', newVal);
    }
    return result;
  }

  private updateButtons(data: IDesignerBorder) {
    const buttons = this.pnlIndividual.querySelectorAll('i-button');
    const oldRadiusVal = this._data.border?.radius;
    const radiusStr = isNumber(oldRadiusVal) ? `${oldRadiusVal}px` : oldRadiusVal;
    const oldRadius = this.radiusByPosition(radiusStr as string);
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i] as Button;
      const id = button.id || '';
      const result = /(.*)(Radius|Width)$/.exec(id);
      if (!result) continue;
      const type = result[2].toLowerCase();
      const position = result[1];
      const value = type === 'width' ? this.widthObj[position] : this.radiusObj[position];
      const oldVal = type === 'width' ? (this._data.border?.[position]?.width ?? this._data.border?.width) : oldRadius[position];
      let isSame = true;
      if (this.isChecked) {
        isSame = isSameValue(value ?? '', oldVal ?? '');
      } else {
        isSame = !value;
        if (!isSame && !this._idvChanged) this._idvChanged = true;
      }
      button.caption = isNumber(value) ? `${value}px` : (value || 'auto');
      button.border.color = isSame ? Theme.action.selectedBackground : Theme.colors.success.main;
    }
  }

  private onShowSpacingModal(target: Button, type: string, position: string) {
    let value = '';
    if (type === 'width') {
      value = this.widthObj[position];
    } else {
      value = this.radiusObj[position];
    }
    const spacing = {
      value,
      type,
      position
    }
    const breakpoint = getBreakpointInfo(getBreakpoint())
    const config = {
      title: `Border ${position} ${type}`,
      iconName: breakpoint?.icon,
      breakpointText: `Configure a value for ${breakpoint?.name || ''} screen sizes or larger`
    }
    this.mdSpacing.onShowModal(target, spacing, config);
  }

  private radiusByPosition(radius: string) {
    if (!radius) return {topLeft: '', topRight: '', bottomRight: '', bottomLeft: ''};
    const arr = radius.split(' ');
    if (arr?.length) {
      let [topLeft, topRight, bottomRight, bottomLeft] = arr;
      if (topRight === undefined) topRight = topLeft;
      if (bottomLeft === undefined) bottomLeft = topRight;
      if (bottomRight === undefined) bottomRight = bottomLeft;
      return {topLeft, topRight, bottomRight, bottomLeft};
    }
    return {topLeft: '', topRight: '', bottomRight: '', bottomLeft: ''};
  }

  private widthByPosition(border: IBorder) {
    const { width } = border;
    const widthStr = (isNumber(width) ? `${width}px` : width) as string;
    const result = {
      top: widthStr,
      right: widthStr,
      bottom: widthStr,
      left: widthStr
    }
    for (let prop of ['top', 'right', 'bottom', 'left']) {
      if (this._data.border && Object.hasOwnProperty.call(this._data.border, prop)) {
        const width = this._data.border[prop].width;
        if (width !== undefined && width !== '') {
          result[prop] = (isNumber(width) ? `${width}px` : width) as string;
        }
      }
    }
    return result;
  }

  private onPropChanged(target: Input, prop: string) {
    const value = target.value;
    const newVal = isNumber(value) ? `${value}px` : value;
    if (prop === 'width' && this._data.border) {
      for (let prop of ['top', 'right', 'bottom', 'left']) {
        if (Object.hasOwnProperty.call(this._data.border, prop)) {
          this.onSpacingChanged('width', prop, newVal, false);
        }
      }
    }
    this.handleValueChanged(prop, newVal);
  }

  private onSpacingChanged(type: string, position: string, value: string, needUpdate = true) {
    if (type === 'width') {
      this.widthObj[position] = value;
      this.handleValueChanged('width', value, needUpdate, position);
    } else {
      this.radiusObj[position] = value;
      const radiusText = `${this.radiusObj.topLeft} ${this.radiusObj.topRight} ${this.radiusObj.bottomRight} ${this.radiusObj.bottomLeft}`;
      this.handleValueChanged('radius', radiusText, needUpdate);
    }
  }

  private handleValueChanged(type: string, value: any, needUpdate = true, position?: string) {
    if (this.isChecked) {
      this.handleMediaQuery(type, value, position);
    } else {
      if (position) {
        if (!this._data.border[position]) this._data.border[position] = {};
        this._data.border[position][type] = value;
      } else {
        this._data.border[type] = value;
      }
      if (this.onChanged && needUpdate) this.onChanged('border', this._data.border);
    }
    if (needUpdate) this.renderUI();
  }

  private handleMediaQuery(prop: string, value: any, position?: string) {
    let border = this._data.mediaQuery['properties']['border'];
    if (!border) border = JSON.parse(JSON.stringify(this._data.border || {}));
    if (position) {
      if (!border[position]) border[position] = {};
      border[position][prop] = value;
    } else {
      border[prop] = value;
    }
    this._data.mediaQuery['properties']['border'] = border;
    if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQuery, 'border');
  }

  private onToggleMediaQuery(value: boolean) {
    this.renderUI(true);
  }

  private onResetData() {
    if (this.isChecked) {
      const breakpoint = this._data.mediaQuery.properties;
      this._data.mediaQuery.properties = (({ border, ...o }) => o)(breakpoint);
      if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQuery);
    } else {
      const clonedData = JSON.parse(JSON.stringify(this._data));
      const cloneDefault = JSON.parse(JSON.stringify(clonedData.default));
      this._data = { ...clonedData, ...cloneDefault };
      for (let prop of DESIGNER_BORDER_PROPS) {
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
          name="Borders"
          hasMediaQuery={true}
          tooltipText="Define the border size and styles."
          onCollapse={this.onCollapse}
          onToggleMediaQuery={this.onToggleMediaQuery}
          onReset={this.onResetData}
        />
        <i-vstack id="vStackContent" gap={16} padding={{ top: 16, bottom: 16, left: 12, right: 12 }} visible={false}>
          <i-vstack gap={8}>
            <i-label caption="OVERALL" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-hstack gap={16} verticalAlignment="center">
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label id="lblWidth" caption="Width" font={{ size: '0.75rem' }} />
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
                <i-label id="lblRadius" caption="Radius" font={{ size: '0.75rem' }} />
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
              <i-label id="lblColor" caption="Color" font={{ size: '0.75rem' }} />
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
