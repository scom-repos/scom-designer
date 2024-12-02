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
  Label,
  IComboItem,
  ComboBox
} from '@ijstech/components'
import { buttonAutoStyled, textInputRight } from './index.css';
import DesignerToolModalSpacing from './modal-spacing';
import { IMediaQuery, onChangedCallback, onUpdateCallback } from '../interface';
import { getTranslationKey, isSameValue, parseNumberValue } from '../helpers/utils';
import DesignerSelector from './selector';
import DesignerToolHeader from './header';
import { getBreakpoint } from '../helpers/store';
import { getBreakpointInfo, getFont } from '../helpers/config';
import { propertiesJson } from '../languages/index';
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
  display?: string;
  mediaQuery?: IMediaQuery;
  default?: {[name: string]: any};
}

export const DESIGNER_POSITION_PROPS = ['position', 'top', 'right', 'bottom', 'left', 'overflow', 'zIndex', 'display'];

const displayOptions: IComboItem[] = [
  { value: 'block', label: 'Block' },
  { value: 'inline', label: 'Inline' },
  { value: 'inline-block', label: 'Inline Block' },
  { value: 'inline-flex', label: 'Inline Flex' },
  { value: 'flex', label: 'Flex' },
  { value: 'none', label: 'None' },
  { value: 'initial', label: 'Initial' },
  { value: 'inherit', label: 'Inherit' }
]

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
  private displaySelect: ComboBox;
  private lblDisplay: Label;

  private _data: IDesignerPosition = {};
  private _idvChanged: boolean = false;

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
      const breakpointProps = this._data.mediaQuery?.properties || {};
      data = {...data, ...breakpointProps};
    }
    return data;
  }

  private hasMediaQuery() {
    const breakpointProps = this._data.mediaQuery?.properties || {};
    const hasChanged = DESIGNER_POSITION_PROPS.find(prop => {
      const hasProp = Object.hasOwnProperty.call(breakpointProps, prop);
      if (hasProp) {
        const oldVal = prop === 'overflow' ? this._data[prop]?.y ?? this._data.default?.[prop]?.y : this._data[prop] ?? this._data.default?.[prop];
        const newVal = prop === 'overflow' ? breakpointProps?.[prop]?.y : breakpointProps?.[prop];
        return !isSameValue(oldVal, newVal);
      }
      return false;
    });
    return !!hasChanged;
  }

  setData(data: IDesignerPosition) {
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
    this._idvChanged = false;
    const { zIndex, position, overflow, display } = data;
    this.zIndexInput.value = zIndex !== undefined ? `${zIndex}` : '';
    this.posSelector.activeItem = position || '';
    this.overflowSelector.activeItem = overflow?.y || '';
    const displayItem = display ? displayOptions.find(d => d.value === display) : undefined;
    this.displaySelect.selectedItem = displayItem;
    this.updateButtons(data);
    this.updateHighlight();
    if (this.onUpdate && needUpdate) this.onUpdate(this.isChecked, DESIGNER_POSITION_PROPS);
  }

  private updateHighlight() {
    if (Object.keys(this._data.default || {}).length === 0) return;
    this.posSelector.isChanged = !this.checkValues('position', this.posSelector.activeItem);
    this.overflowSelector.isChanged = !this.checkValues('overflow', this.overflowSelector.activeItem);
    const zResult = this.checkValues('zIndex', this.zIndexInput.value);
    this.lblZIndex.font = getFont(zResult);
    const display = ((this.displaySelect.selectedItem) as IComboItem)?.value as string;
    const dResult = this.checkValues('display', display);
    this.lblDisplay.font = getFont(dResult);
    const hasChanged = this._idvChanged || !zResult || this.posSelector.isChanged || this.overflowSelector.isChanged || !dResult;
    if (!this.isChecked) this.designerHeader.isChanged = hasChanged;
  }

  private checkValues(prop: string, newVal: any) {
    let pResult = false;
    let oldValue = '';
    if (this.isChecked) {
      oldValue = prop === 'overflow' ? (this._data[prop]?.y ?? this._data.default?.[prop]?.y) : (this._data[prop] ?? this._data.default?.[prop]);
      pResult = isSameValue(oldValue, newVal ?? '');
    } else {
      oldValue = prop === 'overflow' ? this._data.default?.[prop]?.y : this._data.default?.[prop];
      pResult = isSameValue(oldValue, newVal ?? '');
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
        isSame = isSameValue(this._data[id] || 'auto', data[id] || 'auto');
      } else {
        isSame = (data[id] || 'auto') === this._data.default[id];
        if (!isSame && !this._idvChanged) this._idvChanged = true;
      }
      button.border.color = isSame ? Theme.action.selectedBackground : Theme.colors.success.main;
      button.caption = parseData?.value === '' ? 'auto' : `${parseData?.value}${parseData?.unit}`;
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
    const key = getTranslationKey(`${position}`);
    const config = {
      title: this.i18n.get(key),
      iconName: breakpoint?.icon,
      breakpointText: this.i18n.get('configure_a_value_for_screen_sizes_or_larger', {breakpoint: breakpoint.name ? this.i18n.get(breakpoint.name) : ''})
    }
    this.mdSpacing.onShowModal(target, spacing, config);
  }

  private onSelectChanged(type: string, value: string) {
    let updated: any = value;
    if (type === 'overflow') {
      updated = {x: 'hidden', y: value};
    }
    this.handleValueChanged(type, updated);
  }

  private onSpacingChanged(type: string, position: string, value: string) {
    this.handleValueChanged(position, value === '' ? 'auto' : value);
  }

  private onDisplayChanged(target: ComboBox) {
    const selectedItem = target.selectedItem as IComboItem;
    this.handleValueChanged('display', selectedItem?.value || '');
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
    this._data.mediaQuery['properties'][prop] = value;
    if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQuery, prop);
  }

  private onToggleMediaQuery(value: boolean) {
    this.renderUI(true);
  }

  private onResetData() {
    if (this.isChecked) {
      const breakpoint = this._data.mediaQuery.properties;
      this._data.mediaQuery.properties = (({ position, top, right, bottom, left, overflow, zIndex, ...o }) => o)(breakpoint);
      if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQuery);
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
    this.i18n.init({...propertiesJson});
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
          name="$position_and_display"
          tooltipText="$define_a_relative_or_absolute_position_from_the_parent_element"
          hasMediaQuery={true}
          onCollapse={this.onCollapse}
          onToggleMediaQuery={this.onToggleMediaQuery}
          onReset={this.onResetData}
        />
        <i-vstack id="vStackContent" padding={{ top: 16, bottom: 16, left: 12, right: 12 }} visible={false}>
          <i-vstack gap={8}>
            <designer-selector
              id="posSelector"
              title="$position"
              items={[
                { value: 'relative', caption: '$relative', type: 'position' },
                { value: 'absolute', caption: '$absolute', type: 'position' },
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
              <i-label id="lblZIndex" caption="$z_index" font={{ size: '0.75rem' }} />
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
              title="$overflow"
              items={[
                { value: 'auto', caption: '$visible', type: 'overflow' },
                { value: 'hidden', caption: '$hidden', type: 'overflow' },
              ]}
              onChanged={this.onSelectChanged}
            />
            <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label id="lblDisplay" caption="$display" font={{ size: '0.75rem' }} />
              <i-combo-box
                id="displaySelect"
                items={displayOptions}
                font={{ size: '0.75rem' }}
                placeholder="$select_display"
                width="100%"
                height={24}
                border={{
                  radius: 8,
                  width: 0
                }}
                onChanged={this.onDisplayChanged}
              />
            </i-grid-layout>
          </i-vstack>
        </i-vstack>
        <designer-tool-modal-spacing id="mdSpacing" onChanged={this.onSpacingChanged} />
      </i-vstack>
    )
  }
}
