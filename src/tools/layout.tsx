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
import { borderRadiusLeft, borderRadiusRight, customIconLayoutActiveStyled, customIconLayoutStyled, textInputRight } from './index.css';
import assets from '../assets';
import { onChangedCallback } from '../interface';
import { alignContentProps, getAlignProps, justifyProps } from '../utils';
const Theme = Styles.Theme.ThemeVars;

interface IDesignerLayout {
  wrap?: string;
  direction?: string;
  alignItems?: string;
  justifyContent?: string;
  alignSelf?: string;
  alignContent?: string;
  flexFlow?: string;
}

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

@customElements('designer-tool-layout')
export default class DesignerToolLayout extends Module {
  private vStackContent: VStack;
  private isBasicFlex = true;
  private lbTypeFlex: Label;
  private inputBasicFlex: Input;
  private wrapperAdvancedFlex: GridLayout;

  private _data: IDesignerLayout = {};
  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: DesignerToolLayoutElement) {
    super(parent, options);
    this.onSelectChanged = this.onSelectChanged.bind(this);
    this.onReverseSwitch = this.onReverseSwitch.bind(this);
  }

  setData(data: IDesignerLayout) {
    this._data = data;
    this.renderUI();
  }

  private renderUI() {
    // TODO: fill data
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
    // console.log('type', type, ' value', value)
    if (this.onChanged) this.onChanged(type, value);
  }

  private onReverseSwitch(target: Switch) {
    const checked = target.checked;
    const type = this._data.direction === 'horizontal' ? 'row' : 'column';
    this._data.flexFlow = checked ? `${type}-reverse` : type;
    if (this.onChanged) this.onChanged('flexFlow', this._data.flexFlow);
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
          <i-vstack gap={8}>
            <i-label caption="FLEX ITEMS" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={12}>
              <i-hstack verticalAlignment='center' gap="5px">
                <designer-selector
                  title="Direction"
                  stack={{grow: '1', shrink: '1'}}
                  items={[
                    { value: 'column', tooltip: 'Column', type: 'direction', isActive: true, icon: { image: { url: assets.fullPath('img/designer/layout/column.svg') } } },
                    { value: 'row', tooltip: 'Row', type: 'direction', rotate: 180, icon: { image: { url: assets.fullPath('img/designer/layout/column.svg') } } },
                  ]}
                  onChanged={this.onSelectChanged}
                />
                <i-hstack gap={4} verticalAlignment="center" stack={{grow: '1', shrink: '1'}}>
                  <i-switch id="reverseSwitch" onChanged={this.onReverseSwitch} />
                  <i-label caption="Reverse" font={{ size: '0.875rem' }} />
                </i-hstack>
              </i-hstack>
              <designer-selector
                title="Align"
                items={getAlignProps('alignItems')}
                onChanged={this.onSelectChanged}
              />
              <designer-selector
                title="Justify"
                items={justifyProps}
                onChanged={this.onSelectChanged}
              />
            </i-vstack>
          </i-vstack>
          <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
          <i-vstack gap={8}>
            <i-label caption="SELECTED ITEM" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={12}>
              <designer-selector
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
                  />
                  <i-grid-layout id="wrapperAdvancedFlex" visible={false} gap={{ column: 4 }} templateColumns={['1fr', '1fr', '1fr']} maxWidth={254} verticalAlignment="center">
                    <i-vstack gap={8} horizontalAlignment="center">
                      <i-input
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
                      />
                      <i-label caption="Basis" font={{ size: '0.75rem' }} opacity={0.7} />
                    </i-vstack>
                    <i-vstack gap={8} horizontalAlignment="center">
                      <i-input
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
                      />
                      <i-label caption="Grow" font={{ size: '0.75rem' }} opacity={0.7} />
                    </i-vstack>
                    <i-vstack gap={8} horizontalAlignment="center">
                      <i-input
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
                      />
                      <i-label caption="Shrink" font={{ size: '0.75rem' }} opacity={0.7} />
                    </i-vstack>
                  </i-grid-layout>
                </i-vstack>
              </i-grid-layout>
            </i-vstack>
          </i-vstack>
          <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
          <i-vstack gap={8}>
            <i-label caption="CONTENT" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={12}>
              <designer-selector
                title="Wrap"
                items={[
                  { value: 'nowrap', caption: 'None', type: 'wrap', isActive: true },
                  { value: 'wrap', caption: 'Wrap', type: 'wrap' },
                  { value: 'wrap-reverse', caption: 'Reverse', type: 'wrap' }
                ]}
                onChanged={this.onSelectChanged}
              />
              <designer-selector
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
