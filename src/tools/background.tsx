import {
  Module,
  ControlElement,
  customElements,
  Container,
  VStack,
  ComboBox,
  ColorPicker,
  Label,
  Styles
} from '@ijstech/components'
import DesignerToolHeader from './header';
import { customColorStyled } from './index.css';
import { backgroundOptions, isSameValue } from '../helpers/utils';
import { IMediaQuery, onChangedCallback, onUpdateCallback } from '../interface';
import { propertiesJson } from '../languages/index';

const Theme = Styles.Theme.ThemeVars;

interface DesignerToolBackgroundElement extends ControlElement {
  onChanged?: onChangedCallback;
  onUpdate?: onUpdateCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-background']: DesignerToolBackgroundElement
    }
  }
}

interface IDesignerBackground {
  background?: {color?: string; image?: string};
  mediaQuery?: IMediaQuery;
  default?: {[name: string]: any};
}

export const DESIGNER_BACKGROUND_PROPS = ['background'];

@customElements('designer-tool-background')
export default class DesignerToolBackground extends Module {
  private vStackContent: VStack;
  // private bgSelect: ComboBox;
  private bgColor: ColorPicker;
  private designerHeader: DesignerToolHeader;
  private lblColor: Label;

  private _data: IDesignerBackground = {};

  onChanged: onChangedCallback;
  onUpdate: onUpdateCallback;

  constructor(parent?: Container, options?: DesignerToolBackgroundElement) {
    super(parent, options);
    this.onTypeChanged = this.onTypeChanged.bind(this);
    this.onColorChanged = this.onColorChanged.bind(this);
    this.onToggleMediaQuery = this.onToggleMediaQuery.bind(this);
    this.onResetData = this.onResetData.bind(this);
  }

  static async create(options?: DesignerToolBackgroundElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  private get isChecked() {
    return this.designerHeader.checked;
  }

  private hasMediaQuery() {
    const breakpointProps = this._data?.mediaQuery?.properties|| {};
    const hasProp = Object.hasOwnProperty.call(breakpointProps, 'background');
    return hasProp && !isSameValue(this._data.background?.color || '', breakpointProps.background?.color || '');
  }

  setData(value: IDesignerBackground) {
    this._data = value;
    const olChecked = this.designerHeader.checked;
    this.designerHeader.checked = !!this.hasMediaQuery();
    this.renderUI(olChecked !== this.designerHeader.checked);
  }

  private renderUI(needUpdate?: boolean) {
    let data = JSON.parse(JSON.stringify(this._data));
    const mediaBg = this._data.mediaQuery?.properties?.background;
    if (this.isChecked && mediaBg) data.background = mediaBg;
    this.designerHeader.isQueryChanged = !!this.hasMediaQuery();

    const { background = {} } = data;
    this.bgColor.value = background?.color || undefined;
    this.updateHighlight();
    if (this.onUpdate && needUpdate) this.onUpdate(this.isChecked, DESIGNER_BACKGROUND_PROPS);

    // const typeItem = this.type ? backgroundOptions.find(item => item.value === this.type) : null;
    // this.bgSelect.selectedItem = typeItem || null;
  }

  private updateHighlight() {
    let result = false;
    const value = this.bgColor.value || '';
    if (this.isChecked) {
      result = isSameValue(this._data.background?.color || '', value);
    } else {
      result = isSameValue(this._data.default?.background?.color || '', value);
      this.designerHeader.isChanged = !result;
    }
    this.lblColor.font = { size: '0.75rem', color: result ? Theme.text.primary : Theme.colors.success.main };
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private onTypeChanged(target: ComboBox) {
    // const selectedValue = (target.selectedItem as IComboItem).value;
    // this.type = selectedValue;
    // if (this.onChanged) this.onChanged('background', { color: this.color });
  }

  private onColorChanged(target: ColorPicker) {
    const value = target.value;
    this.handleValueChanged('background', { color: value });
  }

  private handleValueChanged(type: string, value: any) {
    if (this.isChecked) {
      this.handleMediaQuery(type, value);
    } else {
      this._data[type] = value;
      if (this.onChanged) this.onChanged(type, {color: value?.color || ''}, undefined);
    }
    this.renderUI();
  }

  private handleMediaQuery(prop: string, value: any) {
    this._data.mediaQuery['properties'][prop] = value;
    if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQuery, prop);
  }

  private onToggleMediaQuery(isChecked: boolean) {
    this.renderUI(true);
  }

  private onResetData() {
    if (this.isChecked) {
      const breakpoint = this._data.mediaQuery.properties;
      this._data.mediaQuery.properties = (({ background, ...o }) => o)(breakpoint);
      if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQuery);
    } else {
      const clonedData = JSON.parse(JSON.stringify(this._data));
      const cloneDefault = JSON.parse(JSON.stringify(clonedData.default));
      this._data = { ...clonedData, ...cloneDefault };
      for (let prop of DESIGNER_BACKGROUND_PROPS) {
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
          name="$background"
          hasMediaQuery={true}
          tooltipText="$set_a_background_color_or_image_for_the_element"
          onCollapse={this.onCollapse}
          onToggleMediaQuery={this.onToggleMediaQuery}
          onReset={this.onResetData}
        />
        <i-vstack id="vStackContent" padding={{ top: 16, bottom: 16, left: 12, right: 12 }} visible={false}>
          <i-grid-layout width="100%" templateColumns={['70px', 'auto']} verticalAlignment="center">
            <i-label id="lblColor" caption="$color" font={{ size: '0.75rem' }} />
            <i-hstack gap={4} width="100%" verticalAlignment="center">
              <i-color
                id="bgColor"
                onChanged={this.onColorChanged}
                class={customColorStyled}
              />
              <i-combo-box
                id="bgSelect"
                width="calc(100% - 28px)"
                items={backgroundOptions}
                placeholder="$type_or_select_a_color"
                onChanged={this.onTypeChanged}
              />
            </i-hstack>
          </i-grid-layout>
        </i-vstack>
      </i-vstack>
    )
  }
}
