import {
  Module,
  ControlElement,
  customElements,
  Label,
  Container,
  Styles,
  VStack,
  GridLayout,
  Input,
  Switch
} from '@ijstech/components'
import { textInputRight } from './index.css';
import assets from '../assets';
import { IMediaQuery, onChangedCallback, onUpdateCallback } from '../interface';
import { alignContentProps, getAlignProps, isSameValue, justifyProps } from '../helpers/utils';
import DesignerSelector from './selector';
import DesignerToolHeader from './header';
import { getFont } from '../helpers/config';
import { propertiesJson } from '../languages/index';
const Theme = Styles.Theme.ThemeVars;

interface IDesignerLayout {
  wrap?: string;
  direction?: string;
  alignItems?: string;
  justifyContent?: string;
  alignSelf?: string;
  alignContent?: string;
  name?: string;
  stack?: IStack;
  reverse?: boolean;
  mediaQuery?: IMediaQuery;
  default?: {[name: string]: any};
}

export const DESIGNER_LAYOUT_PROPS = ['stack', 'direction', 'wrap', 'alignItems', 'justifyContent', 'alignSelf', 'alignContent', 'reverse'];

interface IStack {
  basis?: string;
  grow?: string;
  shrink?: string;
};

interface DesignerToolLayoutElement extends ControlElement {
  onChanged?: onChangedCallback;
  onUpdate?: onUpdateCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-layout']: DesignerToolLayoutElement
    }
  }
}

const stackTypes = ['i-stack', 'i-hstack', 'i-vstack'];

@customElements('designer-tool-layout')
export default class DesignerToolLayout extends Module {
  private vStackContent: VStack;
  private lbTypeFlex: Label;
  private inputBasicFlex: Input;
  private wrapperAdvancedFlex: GridLayout;
  private pnlFlexContent: VStack;
  private pnlFlexItems: VStack;
  private pnlSelectedItem: VStack;
  private directionSelector: DesignerSelector;
  private wrapSelector: DesignerSelector;
  private justifySelector: DesignerSelector;
  private alignSelector: DesignerSelector;
  private alignSelfSelector: DesignerSelector;
  private alignContentSelector: DesignerSelector;
  private reverseSwitch: Switch;
  private shrinkInput: Input;
  private growInput: Input;
  private basisInput: Input;
  private designerHeader: DesignerToolHeader;
  private lblReverse: Label;
  private lblFlex: Label;

  private _data: IDesignerLayout = {};
  private isBasicFlex: boolean = true;
  onChanged: onChangedCallback;
  onUpdate: onUpdateCallback;

  constructor(parent?: Container, options?: DesignerToolLayoutElement) {
    super(parent, options);
    this.onSelectChanged = this.onSelectChanged.bind(this);
    this.onReverseSwitch = this.onReverseSwitch.bind(this);
    this.onAdvFlexChanged = this.onAdvFlexChanged.bind(this);
    this.onResetData = this.onResetData.bind(this);
    this.onToggleMediaQuery = this.onToggleMediaQuery.bind(this);
  }

  get name() {
    return this._data.name ?? '';
  }
  set name(value: string) {
    this._data.name = value ?? '';
  }

  get isStack() {
    return this.name && stackTypes.includes(this.name);
  }

  private get isChecked() {
    return this.designerHeader.checked;
  }

  private get currentData() {
    let data = JSON.parse(JSON.stringify(this._data));
    const clonedDefault = JSON.parse(JSON.stringify(data.default));
    data = { ...clonedDefault, ...data };
    if (this.isChecked) {
      const breakpointProps = this._data.mediaQuery?.properties || {};
      data = {...data, ...breakpointProps};
    }
    return data;
  }

  private hasMediaQuery() {
    const breakpointProps = this._data.mediaQuery?.properties || {};
    const hasChanged = DESIGNER_LAYOUT_PROPS.find(prop => {
      const hasProp = Object.hasOwnProperty.call(breakpointProps, prop);
      if (hasProp) {
        return !isSameValue(this._data[prop] ?? this._data.default?.[prop], breakpointProps?.[prop]);
      }
      return false;
    });
    return !!hasChanged;
  }

  setData(data: IDesignerLayout) {
    this._data = data;
    const olChecked = this.designerHeader.checked;
    this.designerHeader.checked = !!this.hasMediaQuery();
    this.renderUI(olChecked !== this.designerHeader.checked);
  }

  private renderUI(needUpdate = false) {
    let data = this.currentData;
    this.designerHeader.isQueryChanged = !!this.hasMediaQuery();
    this.togglePanels();
    const {
      wrap,
      alignItems,
      justifyContent,
      alignSelf,
      alignContent,
      direction,
      stack,
      reverse
    } = data;
    if (this.isStack) {
      this.directionSelector.activeItem = direction;
      this.reverseSwitch.checked = reverse ?? (direction || '').includes('reverse') ?? false;
      if (wrap) this.wrapSelector.activeItem = wrap
      if (alignItems) this.alignSelector.activeItem = alignItems
      if (justifyContent) this.justifySelector.activeItem = justifyContent
      if (alignSelf) this.alignSelfSelector.activeItem = alignSelf
      if (alignContent) this.alignContentSelector.activeItem = alignContent
    }
    const { basis, grow, shrink } = stack || {};
    this.basisInput.value = basis ?? '';
    this.shrinkInput.value = shrink ?? '';
    this.growInput.value = grow ?? '';
    this.inputBasicFlex.value = grow ?? '';
    this.updateHighlight(data);
    if (this.onUpdate && needUpdate) this.onUpdate(this.isChecked, DESIGNER_LAYOUT_PROPS);
  }

  private updateHighlight(data: IDesignerLayout) {
    if (Object.keys(this._data.default || {}).length === 0) return;
    const isStack = this.isStack;
    this.directionSelector.isChanged = !this.checkValues('direction', this.directionSelector.activeItem);
    this.justifySelector.isChanged = !this.checkValues('justifyContent', this.justifySelector.activeItem);
    this.alignContentSelector.isChanged = !this.checkValues('alignContent', this.alignContentSelector.activeItem);
    this.alignSelfSelector.isChanged = !this.checkValues('alignSelf', this.alignSelfSelector.activeItem);
    this.alignSelector.isChanged = !this.checkValues('alignItems', this.alignSelector.activeItem);
    this.wrapSelector.isChanged = !this.checkValues('wrap', this.wrapSelector.activeItem);
    const reverseResult = this.checkValues('reverse', this.reverseSwitch.checked);
    this.lblReverse.font = getFont(reverseResult);

    const stackResult = this.checkValues('stack', data.stack);
    this.lblFlex.font = getFont(stackResult);

    const stackChanged = isStack && (this.directionSelector.isChanged || this.justifySelector.isChanged || this.alignContentSelector.isChanged || this.alignSelfSelector.isChanged || this.alignSelector.isChanged || this.wrapSelector.isChanged || !reverseResult);
    const hasChanged = stackChanged || !stackResult;
    if (!this.isChecked) this.designerHeader.isChanged = hasChanged;
  }

  private checkValues(prop: string, newVal: any) {
    let result = false;
    if (this.isChecked) {
      result = isSameValue(this._data[prop] ?? this._data.default?.[prop], newVal);
    } else {
      result = isSameValue(this._data.default?.[prop], newVal);
    }
    return result;
  }

  private togglePanels() {
    const isStack = this.isStack;
    this.directionSelector.visible = this.name === 'i-stack';
    this.wrapSelector.visible = isStack;
    this.justifySelector.visible = isStack;
    this.alignSelector.visible = isStack;
    this.alignSelfSelector.visible = isStack;
    this.alignContentSelector.visible = isStack;
    this.pnlFlexItems.visible = isStack;
    this.pnlFlexContent.visible = isStack;
    this.pnlSelectedItem.visible = true;
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private onFlexChanged() {
    this.isBasicFlex = !this.isBasicFlex;
    this.lbTypeFlex.caption = this.isBasicFlex ? '$advanced' : '$basic';
    this.inputBasicFlex.enabled = this.inputBasicFlex.visible = this.isBasicFlex;
    this.wrapperAdvancedFlex.visible = !this.isBasicFlex;
  }

  private onSelectChanged(type: string, value: string) {
    this.handleValueChanged(type, value);
  }

  private onReverseSwitch(target: Switch) {
    this.handleValueChanged('reverse', this.reverseSwitch.checked);
  }

  private onBasicFlexChanged(target: Input) {
    const value = target.value;
    let stack = undefined;
    if (value) {
      stack = { basis: '0%', shrink: '1', grow: `${value}` };
      this.basisInput.value = '0%';
      this.shrinkInput.value = '1';
      this.growInput.value = value;
    } else {
      stack = { basis: '', shrink: '', grow: '' };
      this.basisInput.value = '';
      this.shrinkInput.value = '';
      this.growInput.value = '';
    }
    this.handleValueChanged('stack', stack);
  }

  private onAdvFlexChanged(target: Input, type: string) {
    const value = target.value;
    const stack = { ...(this._data.stack || {}), [type]: value };
    this.handleValueChanged('stack', stack);
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
      this._data.mediaQuery.properties = (({ stack, direction, wrap, alignItems, justifyContent, alignSelf, alignContent, reverse, ...o }) => o)(breakpoint);
      if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQuery);
    } else {
      const clonedData = JSON.parse(JSON.stringify(this._data));
      const cloneDefault = JSON.parse(JSON.stringify(clonedData.default));
      this._data = { ...clonedData, ...cloneDefault };
      for (let prop of DESIGNER_LAYOUT_PROPS) {
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
          name="$layout"
          tooltipText="$with_flexbox_you_can_specify_the_layout_of_an_element_and_its_children_to_provide_a_consistent_layout_on_different_screen_sizes"
          onCollapse={this.onCollapse}
          hasMediaQuery={true}
          onReset={this.onResetData}
          onToggleMediaQuery={this.onToggleMediaQuery}
        />
        <i-vstack id="vStackContent" gap={16} padding={{ top: 16, bottom: 16, left: 12, right: 12 }} visible={false}>
          <i-vstack
            id="pnlFlexItems"
            gap={8}
          >
            <i-label caption="$flex_items" font={{ size: '0.875rem', transform: 'uppercase' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={12}>
              <i-hstack verticalAlignment='center' gap="5px">
                <designer-selector
                  id="directionSelector"
                  title="$direction"
                  stack={{grow: '1', shrink: '1'}}
                  items={[
                    { value: 'vertical', tooltip: '$column', type: 'direction', icon: { image: { url: assets.fullPath('img/designer/layout/column.svg') } } },
                    { value: 'horizontal', tooltip: '$row', type: 'direction', rotate: 180, icon: { image: { url: assets.fullPath('img/designer/layout/column.svg') } } },
                  ]}
                  onChanged={this.onSelectChanged}
                />
                <i-hstack gap={4} verticalAlignment="center" stack={{grow: '1', shrink: '1'}}>
                  <i-switch id="reverseSwitch" onChanged={this.onReverseSwitch} />
                  <i-label id="lblReverse" caption="$reverse" font={{ size: '0.75rem' }} />
                </i-hstack>
              </i-hstack>
              <designer-selector
                id="alignSelector"
                title="$align"
                items={getAlignProps('alignItems')}
                onChanged={this.onSelectChanged}
              />
              <designer-selector
                id="justifySelector"
                title="$justify"
                items={justifyProps}
                onChanged={this.onSelectChanged}
              />
            </i-vstack>
          </i-vstack>
          <i-vstack
            id="pnlSelectedItem"
            gap={8}
            border={{top: {width: '1px', style: 'solid', color: Theme.divider}}}
            padding={{top: '1rem'}}
          >
            <i-label caption="$selected_item" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={12}>
              <designer-selector
                id="alignSelfSelector"
                title="$align"
                items={getAlignProps('alignSelf')}
                onChanged={this.onSelectChanged}
              />
              <i-grid-layout templateColumns={['70px', 'auto']}>
                <i-vstack gap={8}>
                  <i-label id="lblFlex" caption="$flex" font={{ size: '0.75rem' }} lineHeight="24px" />
                  <i-hstack gap={2} width="fit-content" verticalAlignment="center" opacity={0.7} cursor="pointer" onClick={this.onFlexChanged}>
                    <i-label id="lbTypeFlex" caption="$advanced" font={{ size: '0.825rem' }} />
                    <i-icon name="arrow-right" fill="#fff" width={12} height={12} />
                  </i-hstack>
                </i-vstack>
                <i-vstack>
                  <i-input
                    id="inputBasicFlex"
                    inputType="number"
                    placeholder="0"
                    width="100%"
                    height={24}
                    border={{
                      radius: 8,
                      width: 0
                    }}
                    padding={{ left: 4, right: 4 }}
                    font={{ size: '0.75rem' }}
                    class={textInputRight}
                    onBlur={this.onBasicFlexChanged}
                    onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && this.onBasicFlexChanged(target)}
                  />
                  <i-grid-layout id="wrapperAdvancedFlex" visible={false} gap={{ column: 4 }} templateColumns={['1fr', '1fr', '1fr']} maxWidth={254} verticalAlignment="center">
                    <i-vstack gap={8} horizontalAlignment="center">
                      <i-input
                        id="basisInput"
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
                        class={textInputRight}
                        onBlur={(target: Input) => this.onAdvFlexChanged(target, 'basis')}
                        onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && this.onAdvFlexChanged(target, 'basis')}
                      />
                      <i-label caption="$basis" font={{ size: '0.75rem' }} opacity={0.7} />
                    </i-vstack>
                    <i-vstack gap={8} horizontalAlignment="center">
                      <i-input
                        id="growInput"
                        inputType="number"
                        placeholder="0"
                        width="100%"
                        height={24}
                        border={{
                          radius: 8,
                          width: 0
                        }}
                        padding={{ left: 4, right: 4 }}
                        font={{ size: '0.75rem' }}
                        class={textInputRight}
                        onBlur={(target: Input) => this.onAdvFlexChanged(target, 'grow')}
                        onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && this.onAdvFlexChanged(target, 'grow')}
                      />
                      <i-label caption="$grow" font={{ size: '0.75rem' }} opacity={0.7} />
                    </i-vstack>
                    <i-vstack gap={8} horizontalAlignment="center">
                      <i-input
                        id="shrinkInput"
                        inputType="number"
                        placeholder="1"
                        width="100%"
                        height={24}
                        border={{
                          radius: 8,
                          width: 0
                        }}
                        padding={{ left: 4, right: 4 }}
                        font={{ size: '0.75rem' }}
                        class={textInputRight}
                        onBlur={(target: Input) => this.onAdvFlexChanged(target, 'shrink')}
                        onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && this.onAdvFlexChanged(target, 'shrink')}
                      />
                      <i-label caption="$shrink" font={{ size: '0.75rem' }} opacity={0.7} />
                    </i-vstack>
                  </i-grid-layout>
                </i-vstack>
              </i-grid-layout>
            </i-vstack>
          </i-vstack>
          <i-vstack
            id="pnlFlexContent"
            gap={8}
            border={{top: {width: '1px', style: 'solid', color: Theme.divider}}}
            padding={{top: '1rem'}}
          >
            <i-label caption="$content" font={{ size: '0.875rem', transform: 'uppercase' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={12}>
              <designer-selector
                id="wrapSelector"
                title="Wrap"
                items={[
                  { value: 'nowrap', caption: 'None', type: 'wrap', isActive: true },
                  { value: 'wrap', caption: 'Wrap', type: 'wrap' },
                  { value: 'wrap-reverse', caption: 'Reverse', type: 'wrap' }
                ]}
                onChanged={this.onSelectChanged}
              />
              <designer-selector
                id="alignContentSelector"
                title="$align"
                items={alignContentProps}
                onChanged={this.onSelectChanged}
              />
            </i-vstack>
          </i-vstack>
        </i-vstack>
      </i-vstack>
    )
  }
}
