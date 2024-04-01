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
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolContentElement extends ControlElement {
  onChanged?: onChangedCallback;
}

interface IDesignerContent {
  caption?: string;
  font?: IFont;
}

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
  private inputCaption: Input;
  private inputFontSize: Input;
  private inputFontColor: ColorPicker;

  private _data: IDesignerContent = {};

  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: DesignerToolContentElement) {
    super(parent, options);
    this.onFontChanged = this.onFontChanged.bind(this);
    this.onCaptionChanged = this.onCaptionChanged.bind(this);
  }

  setData(value: IDesignerContent) {
    this._data = value;
    this.renderUI();
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {
    const { caption = '', font = {} } = this._data;
    this.inputCaption.value = caption;
    this.inputFontColor.value = font.color;
    this.inputFontSize.value = font.size;
  }

  private onFontChanged(target: any, prop: string) {
    if (!this._data.font) this._data.font = {};
    this._data.font[prop] = target.value;
    if (prop === 'size') this._data.font[prop] = `${this._data.font[prop]}px`;
    if (this.onChanged) this.onChanged('font', this._data.font);
  }

  private onCaptionChanged(target: Input) {
    this._data.caption = target.value;
    if (this.onChanged) this.onChanged('caption', this._data.caption);
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
        <designer-tool-header name="Caption" tooltipText="Set caption for the element." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" padding={{ top: '1rem', bottom: '1rem', left: '0.75rem', right: '0.75rem' }}>
          <i-vstack gap={'0.5rem'}>
            <i-grid-layout width="100%" templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label caption={'Caption'} font={{ size: '0.75rem' }} />
              <i-hstack verticalAlignment="center" border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
                <i-input
                  id="inputCaption"
                  placeholder="Enter caption..."
                  background={{ color: 'transparent' }}
                  width="calc(100% - 1.5rem)"
                  height={'1.5rem'}
                  border={{ width: 0 }}
                  padding={{ left: 4, right: 2 }}
                  font={{ size: '0.675rem' }}
                  class={`${bgInputTransparent}`}
                  onChanged={this.onCaptionChanged}
                />
              </i-hstack>
            </i-grid-layout>
            <i-grid-layout width="100%" templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label caption="Font color" font={{ size: '0.75rem' }} />
              <i-hstack gap={4} width="100%" verticalAlignment="center">
                <i-color
                  id="inputFontColor"
                  onChanged={(target: ColorPicker) => this.onFontChanged(target, 'color')}
                  class={customColorStyled}
                />
              </i-hstack>
            </i-grid-layout>
            <i-grid-layout width="100%" templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label caption={'Font size'} font={{ size: '0.75rem' }} />
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
                  onChanged={(target: ColorPicker) => this.onFontChanged(target, 'size')}
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
          </i-vstack>
        </i-vstack>
      </i-vstack>
    )
  }
}
