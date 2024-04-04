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
import { onChangedCallback } from '../interface';
import { alignContentProps, getAlignProps, justifyProps } from '../helpers/utils';
import DesignerSelector from './selector';
const Theme = Styles.Theme.ThemeVars;

interface IDesignerLayout {
  wrap?: string;
  direction?: string;
  alignItems?: string;
  justifyContent?: string;
  alignSelf?: string;
  alignContent?: string;
  display?: string;
  name?: string;
  stack?: IStack;
  reverse?: boolean
}

interface IStack {
  basis?: string;
  grow?: string;
  shrink?: string;
};

interface DesignerToolLayoutElement extends ControlElement {
  onChanged?: onChangedCallback;
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

  private _data: IDesignerLayout = {};
  private isBasicFlex: boolean = true;
  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: DesignerToolLayoutElement) {
    super(parent, options);
    this.onSelectChanged = this.onSelectChanged.bind(this);
    this.onReverseSwitch = this.onReverseSwitch.bind(this);
    this.onAdvFlexChanged = this.onAdvFlexChanged.bind(this);
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

  setData(data: IDesignerLayout) {
    this._data = data;
    this.renderUI();
  }

  private renderUI() {
    this.togglePanels();
    const { wrap, alignItems, justifyContent, alignSelf, alignContent, direction, stack } = this._data;
    this.directionSelector.activeItem = direction;
    this.reverseSwitch.checked = this._data.reverse ?? (direction || '').includes('reverse') ?? false;
    if (this.isStack) {
      if (wrap) this.wrapSelector.activeItem = wrap
      if (alignItems) this.alignSelector.activeItem = alignItems
      if (justifyContent) this.justifySelector.activeItem = justifyContent
      if (alignSelf) this.alignSelfSelector.activeItem = alignSelf
      if (alignContent) this.alignContentSelector.activeItem = alignContent
    }
    const { basis, grow, shrink } = stack || {};
    this.basisInput.value = basis || '';
    this.shrinkInput.value = shrink || '';
    this.growInput.value = grow || '';
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
    this.pnlFlexContent.visible = true;
    this.pnlSelectedItem.visible = !isStack;
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private onFlexChanged() {
    this.isBasicFlex = !this.isBasicFlex;
    this.lbTypeFlex.caption = this.isBasicFlex ? 'Advanced' : 'Basic';
    this.inputBasicFlex.enabled = this.inputBasicFlex.visible = this.isBasicFlex;
    this.wrapperAdvancedFlex.visible = !this.isBasicFlex;
  }

  private onSelectChanged(type: string, value: string) {
    this._data[type] = value;
    if (this.onChanged) this.onChanged(type, value);
  }

  private onReverseSwitch(target: Switch) {
    this._data.reverse = target.checked;
    if (this.onChanged) this.onChanged('reverse', this._data.reverse);
  }

  private onBasicFlexChanged(target: Input) {
    const value = target.value;
    if (value) {
      this._data.stack = { basis: '0%', shrink: '1', grow: `${value}` };
      this.basisInput.value = '0%';
      this.shrinkInput.value = '1';
      this.growInput.value = value;
    } else {
      this._data.stack = undefined;
      this.basisInput.value = '';
      this.shrinkInput.value = '';
      this.growInput.value = '';
    }
    if (this.onChanged) this.onChanged('stack', this._data.stack);
  }

  private onAdvFlexChanged(target: Input, type: string) {
    const value = target.value;
    if (!this._data.stack) this._data.stack = {};
    this._data.stack[type] = value;
    if (this.onChanged) this.onChanged('stack', this._data.stack);
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
  }

  render() {
    return (
      <i-vstack
        width="100%"
        height="100%"
        margin={{ left: "auto", right: "auto" }}
        position="relative"
      >
        <designer-tool-header name="Layout" tooltipText="With Flexbox, you can specify the layout of an element and its children to provide a consistent layout on different screen sizes." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" gap={16} padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-vstack
            id="pnlFlexItems"
            gap={8}
          >
            <i-label caption="FLEX ITEMS" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={12}>
              <i-hstack verticalAlignment='center' gap="5px">
                <designer-selector
                  id="directionSelector"
                  title="Direction"
                  stack={{grow: '1', shrink: '1'}}
                  items={[
                    { value: 'vertical', tooltip: 'Column', type: 'direction', isActive: true, icon: { image: { url: assets.fullPath('img/designer/layout/column.svg') } } },
                    { value: 'horizontal', tooltip: 'Row', type: 'direction', rotate: 180, icon: { image: { url: assets.fullPath('img/designer/layout/column.svg') } } },
                  ]}
                  onChanged={this.onSelectChanged}
                />
                <i-hstack gap={4} verticalAlignment="center" stack={{grow: '1', shrink: '1'}}>
                  <i-switch id="reverseSwitch" onChanged={this.onReverseSwitch} />
                  <i-label caption="Reverse" font={{ size: '0.875rem' }} />
                </i-hstack>
              </i-hstack>
              <designer-selector
                id="alignSelector"
                title="Align"
                items={getAlignProps('alignItems')}
                onChanged={this.onSelectChanged}
              />
              <designer-selector
                id="justifySelector"
                title="Justify"
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
            <i-label caption="SELECTED ITEM" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={12}>
              <designer-selector
                id="alignSelfSelector"
                title="Align"
                items={getAlignProps('alignSelf')}
                onChanged={this.onSelectChanged}
              />
              <i-grid-layout templateColumns={['70px', 'auto']}>
                <i-vstack gap={8}>
                  <i-label caption="Flex" font={{ size: '0.75rem' }} lineHeight="24px" />
                  <i-hstack gap={2} width="fit-content" verticalAlignment="center" opacity={0.7} cursor="pointer" onClick={this.onFlexChanged}>
                    <i-label id="lbTypeFlex" caption="Advanced" font={{ size: '0.825rem' }} />
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
                    onChanged={this.onBasicFlexChanged}
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
                        onChanged={(target: Input) => this.onAdvFlexChanged(target, 'basis')}
                      />
                      <i-label caption="Basis" font={{ size: '0.75rem' }} opacity={0.7} />
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
                        onChanged={(target: Input) => this.onAdvFlexChanged(target, 'grow')}
                      />
                      <i-label caption="Grow" font={{ size: '0.75rem' }} opacity={0.7} />
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
                        onChanged={(target: Input) => this.onAdvFlexChanged(target, 'shrink')}
                      />
                      <i-label caption="Shrink" font={{ size: '0.75rem' }} opacity={0.7} />
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
            <i-label caption="CONTENT" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
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
                title="Align"
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
