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
import { backgroundOptions } from '../helpers/utils';
import { onChangedCallback, onUpdateCallback } from '../interface';
import { getBreakpoint } from '../helpers/store';
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
  mediaQueries?: any[];
}

const DESIGNER_PROPS = ['background'];

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
    const breakpointProps = this._data.mediaQueries?.[getBreakpoint()]?.properties|| {};
    return Object.hasOwnProperty.call(breakpointProps, 'background');
  }

  setData(value: IDesignerBackground) {
    this._data = value;
    const olChecked = this.designerHeader.checked;
    this.designerHeader.checked = !!this.hasMediaQuery();
    this.renderUI(olChecked !== this.designerHeader.checked);
  }

  private renderUI(needUpdate?: boolean) {
    let data = JSON.parse(JSON.stringify(this._data));
    if (this.isChecked) {
      const mediaBg = this._data.mediaQueries?.[getBreakpoint()]?.properties?.background;
      if (mediaBg) data.background = mediaBg;
    }
    const { background = {} } = data;
    this.bgColor.value = background?.color || undefined;
    if (this.onUpdate && needUpdate) this.onUpdate(this.isChecked, DESIGNER_PROPS);

    // const typeItem = this.type ? backgroundOptions.find(item => item.value === this.type) : null;
    // this.bgSelect.selectedItem = typeItem || null;
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
    this.lblColor.font = { size: '0.75rem', color: value ? Theme.colors.success.main : Theme.text.primary };
  }

  private handleValueChanged(type: string, value: any) {
    const inQuery = this.designerHeader.checked;
    if (inQuery) {
      this.handleMediaQuery(type, value);
    } else {
      this._data[type] = value;
      if (this.onChanged) this.onChanged(type, value);
    }
  }

  private handleMediaQuery(prop: string, value: any) {
    this._data.mediaQueries[getBreakpoint()]['properties'][prop] = value;
    if (this.onChanged) this.onChanged('mediaQueries', this._data.mediaQueries, prop);
  }

  private onToggleMediaQuery(isChecked: boolean) {
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
        position="relative"
      >
        <designer-tool-header
          id="designerHeader"
          name="Background"
          hasMediaQuery={true}
          tooltipText="Set a background color or image for the element."
          onCollapse={this.onCollapse}
          onToggleMediaQuery={this.onToggleMediaQuery}
        />
        <i-vstack id="vStackContent" padding={{ top: 16, bottom: 16, left: 12, right: 12 }} visible={false}>
          <i-grid-layout width="100%" templateColumns={['70px', 'auto']} verticalAlignment="center">
            <i-label id="lblColor" caption="Color" font={{ size: '0.75rem' }} />
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
                placeholder="Type or select a color..."
                onChanged={this.onTypeChanged}
              />
            </i-hstack>
          </i-grid-layout>
        </i-vstack>
      </i-vstack>
    )
  }
}
