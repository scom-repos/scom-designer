import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Input,
  ColorPicker,
  IFont,
  Label
} from '@ijstech/components'
import { bgInputTransparent, customColorStyled, unitStyled } from './index.css';
import { IMediaQuery, onChangedCallback, onUpdateCallback } from '../interface';
import DesignerToolHeader from './header';
import { isNumber, isSameValue, parseNumberValue } from '../helpers/utils';
import { getFont } from '../helpers/config';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolContentElement extends ControlElement {
  onChanged?: onChangedCallback;
  onUpdate?: onUpdateCallback;
}

interface IDesignerContent {
  font?: IFont;
  mediaQuery?: IMediaQuery;
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
  private lblColor: Label;
  private lblWeight: Label;
  private lblSize: Label;

  private _data: IDesignerContent = {};

  onChanged: onChangedCallback;
  onUpdate: onUpdateCallback;

  constructor(parent?: Container, options?: DesignerToolContentElement) {
    super(parent, options);
    this.onFontChanged = this.onFontChanged.bind(this);
    this.onResetData = this.onResetData.bind(this);
    this.onToggleMediaQuery = this.onToggleMediaQuery.bind(this);
    this.onColorChanged = this.onColorChanged.bind(this);
  }

  private get isChecked() {
    return this.designerHeader.checked;
  }

  private hasMediaQuery() {
    const breakpointProps = this._data?.mediaQuery?.properties|| {};
    return Object.hasOwnProperty.call(breakpointProps, 'font');
  }

  setData(value: IDesignerContent) {
    this._data = value;
    const olChecked = this.designerHeader.checked;
    this.designerHeader.checked = !!this.hasMediaQuery();
    this.renderUI(olChecked !== this.designerHeader.checked);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI(needUpdate = false) {
    let data = JSON.parse(JSON.stringify(this._data));
    const fontData = this._data.mediaQuery?.properties?.font;
    if (this.isChecked) data.font = {...data.font, ...(fontData || {})};
    this.designerHeader.isQueryChanged = !!fontData;

    const { font = {} } = data;
    this.inputFontColor.value = font.color;
    this.inputFontSize.value = parseNumberValue(font.size)?.value || '';
    this.inputFontWeight.value = font.weight;
    this.updateHighlight();
    if (this.onUpdate && needUpdate) this.onUpdate(this.isChecked, DESIGNER_CONTENT_PROPS);
  }

  private updateHighlight() {
    const wResust = this.checkValues('weight', this.inputFontWeight.value);
    const cResult = this.checkValues('color', this.inputFontColor.value);
    const sResult = this.checkValues('size', this.inputFontSize.value ? `${this.inputFontSize.value}px` : '');
    this.lblWeight.font = getFont(wResust);
    this.lblSize.font = getFont(sResult);
    this.lblColor.font = getFont(cResult);
    if (!this.isChecked) this.designerHeader.isChanged = !wResust || !cResult || !sResult;
  }

  private checkValues(prop: string, newVal: any) {
    let result = false;
    if (this.isChecked) {
      result = isSameValue(this._data.font?.[prop] || '', newVal || '');
    } else {
      result = isSameValue(this._data.default?.font?.[prop] || '', newVal || '');
    }
    return result;
  }

  private onFontChanged(target: any, prop: string) {
    let value = target.value;
    if (prop === 'size') value = isNumber(value) ? `${value}px` : value;
    this.handleValueChanged(prop, value);
  }

  private onColorChanged(target: ColorPicker) {
    const value = target.value;
    this.handleValueChanged('color', value);
  }

  private handleValueChanged(type: string, value: any) {
    if (this.isChecked) {
      this.handleMediaQuery(type, value);
    } else {
      if (!this._data.font) this._data.font = {};
      this._data['font'][type] = value;
      if (this.onChanged) this.onChanged('font', this._data.font);
    }
    this.renderUI();
  }

  private handleMediaQuery(prop: string, value: any) {
    if (!this._data.mediaQuery['properties']['font']) this._data.mediaQuery['properties']['font'] = {};
    this._data.mediaQuery['properties']['font'][prop] = value;
    if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQuery, 'font');
  }

  private onToggleMediaQuery(isChecked: boolean) {
    this.renderUI(true);
  }

  private onResetData() {
    if (this.isChecked) {
      const breakpoint = this._data.mediaQuery.properties;
      this._data.mediaQuery.properties = (({ font, ...o }) => o)(breakpoint);
      if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQuery);
    } else {
      const clonedData = JSON.parse(JSON.stringify(this._data));
      const cloneDefault = JSON.parse(JSON.stringify(clonedData.default));
      this._data = { ...clonedData, ...cloneDefault };
      for (let prop of DESIGNER_CONTENT_PROPS) {
        if (this.onChanged) this.onChanged(prop, this._data[prop]);
      }
    }
    this.renderUI(true);
  }

  init() {
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
      >
        <designer-tool-header
          id="designerHeader"
          name="Typography"
          tooltipText="Set font for the element."
          hasMediaQuery={true}
          onCollapse={this.onCollapse}
          onReset={this.onResetData}
          onToggleMediaQuery={this.onToggleMediaQuery}
        />
        <i-vstack id="vStackContent" padding={{ top: '1rem', bottom: '1rem', left: '0.75rem', right: '0.75rem' }} visible={false}>
          <i-vstack gap={'0.5rem'}>
            <i-grid-layout width="100%" templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label id="lblColor" caption="Color" font={{ size: '0.75rem' }} />
              <i-hstack gap={4} width="100%" verticalAlignment="center">
                <i-color
                  id="inputFontColor"
                  onChanged={this.onColorChanged}
                  class={customColorStyled}
                />
              </i-hstack>
            </i-grid-layout>
            <i-grid-layout width="100%" templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label id="lblSize" caption={'Size'} font={{ size: '0.75rem' }} />
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
              <i-label id="lblWeight" caption={'Weight'} font={{ size: '0.75rem' }} />
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
