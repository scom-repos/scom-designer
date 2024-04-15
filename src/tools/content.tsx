import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Input,
  ColorPicker,
  IFont
} from '@ijstech/components'
import { bgInputTransparent, customColorStyled, unitStyled } from './index.css';
import { onChangedCallback } from '../interface';
import DesignerToolHeader from './header';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolContentElement extends ControlElement {
  onChanged?: onChangedCallback;
}

interface IDesignerContent {
  font?: IFont;
  default?: {[name: string]: any};
}

export const DESIGNER_CONTENT_PROPS = ['font'];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-content']: DesignerToolContentElement
    }
  }
}

@customElements('designer-tool-content')
export default class DesignerToolContent extends Module {
  private vStackContent: VStack;
  private inputFontSize: Input;
  private inputFontWeight: Input;
  private inputFontColor: ColorPicker;
  private designerHeader: DesignerToolHeader;

  private _data: IDesignerContent = {};

  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: DesignerToolContentElement) {
    super(parent, options);
    this.onFontChanged = this.onFontChanged.bind(this);
    this.onResetData = this.onResetData.bind(this);
  }

  setData(value: IDesignerContent) {
    this._data = value;
    this.renderUI();
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {
    const { font = {} } = this._data;
    this.inputFontColor.value = font.color;
    this.inputFontSize.value = font.size;
    this.inputFontWeight.value = font.weight;
    this.designerHeader.isChanged = !!(font.color || font.size || font.weight);
  }

  private onFontChanged(target: any, prop: string) {
    if (!this._data.font) this._data.font = {};
    this._data.font[prop] = target.value;
    if (prop === 'size') this._data.font[prop] = `${this._data.font[prop]}px`;
    this.designerHeader.isChanged = !!(this._data.font.color || this._data.font.size || this._data.font.weight);
    if (this.onChanged) this.onChanged('font', this._data.font);
  }

  private onResetData() {
    const clonedData = JSON.parse(JSON.stringify(this._data));
    const cloneDefault = JSON.parse(JSON.stringify(clonedData.default));
    this._data = { ...clonedData, ...cloneDefault };
    if (this.onChanged) this.onChanged('font', this._data['font']);
    this.renderUI();
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
      >
        <designer-tool-header
          id="designerHeader"
          name="Typography"
          tooltipText="Set font for the element."
          onCollapse={this.onCollapse}
          onReset={this.onResetData}
        />
        <i-vstack id="vStackContent" padding={{ top: '1rem', bottom: '1rem', left: '0.75rem', right: '0.75rem' }} visible={false}>
          <i-vstack gap={'0.5rem'}>
            <i-grid-layout width="100%" templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label caption="Color" font={{ size: '0.75rem' }} />
              <i-hstack gap={4} width="100%" verticalAlignment="center">
                <i-color
                  id="inputFontColor"
                  onChanged={(target: ColorPicker) => this.onFontChanged(target, 'color')}
                  class={customColorStyled}
                />
              </i-hstack>
            </i-grid-layout>
            <i-grid-layout width="100%" templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label caption={'Size'} font={{ size: '0.75rem' }} />
              <i-hstack verticalAlignment="center" border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
                <i-input
                  id="inputFontSize"
                  inputType='number'
                  placeholder="Enter font size..."
                  background={{ color: 'transparent' }}
                  width="calc(100% - 1.5rem)"
                  height={'1.5rem'}
                  border={{ width: 0 }}
                  padding={{ left: 4, right: 2 }}
                  font={{ size: '0.675rem' }}
                  class={`${bgInputTransparent}`}
                  onBlur={(target: Input) => this.onFontChanged(target, 'size')}
                  onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && this.onFontChanged(target, 'size')}
                />
                <i-label
                  caption="px"
                  font={{ size: '0.675rem' }}
                  cursor="pointer"
                  width={24}
                  height={24}
                  lineHeight="24px"
                  opacity={1}
                  border={{
                    left: {
                      width: 1,
                      style: 'solid',
                      color: Theme.action.focus
                    }
                  }}
                  class={`text-center ${unitStyled}`}
                />
              </i-hstack>
            </i-grid-layout>
            <i-grid-layout width="100%" templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label caption={'Weight'} font={{ size: '0.75rem' }} />
              <i-hstack verticalAlignment="center" border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
                <i-input
                  id="inputFontWeight"
                  inputType='number'
                  placeholder="Enter font weight..."
                  background={{ color: 'transparent' }}
                  width="calc(100% - 1.5rem)"
                  height={'1.5rem'}
                  border={{ width: 0 }}
                  padding={{ left: 4, right: 2 }}
                  font={{ size: '0.675rem' }}
                  class={`${bgInputTransparent}`}
                  onBlur={(target: Input) => this.onFontChanged(target, 'weight')}
                  onKeyUp={(target: Input, event: KeyboardEvent) => event.key === 'Enter' && this.onFontChanged(target, 'weight')}
                />
              </i-hstack>
            </i-grid-layout>
            {/* TODO: Style, case */}
          </i-vstack>
        </i-vstack>
      </i-vstack>
    )
  }
}
