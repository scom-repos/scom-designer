import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  ComboBox,
  IComboItem,
  ColorPicker
} from '@ijstech/components'
import { customColorStyled } from './index.css';
import { backgroundOptions } from '../utils';
import { onChangedCallback } from '../interface';

interface DesignerToolBackgroundElement extends ControlElement {
  color?: string;
  type?: string;
  onChanged?: onChangedCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-background']: DesignerToolBackgroundElement
    }
  }
}

interface IDesignerBackground {
  color?: string;
  type?: string;
}

@customElements('designer-tool-background')
export default class DesignerToolBackground extends Module {
  private vStackContent: VStack;
  private bgSelect: ComboBox;
  private bgColor: ColorPicker;

  private _data: IDesignerBackground = {};

  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: DesignerToolBackgroundElement) {
    super(parent, options);
    this.onTypeChanged = this.onTypeChanged.bind(this);
    this.onColorChanged = this.onColorChanged.bind(this);
  }

  static async create(options?: DesignerToolBackgroundElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get type() {
    return this._data.type ?? '';
  }
  set type(value: string) {
    this._data.type = value ?? '';
  }

  get color() {
    return this._data.color ?? '';
  }
  set color(value: string) {
    this._data.color = value ?? '';
  }

  setData(value: IDesignerBackground) {
    this._data = value;
    this.renderUI();
  }

  private renderUI() {
    const typeItem = this.type ? backgroundOptions.find(item => item.value === this.type) : null;
    this.bgSelect.selectedItem = typeItem || null;
    this.bgColor.value = this.color || undefined;
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private onTypeChanged(target: ComboBox) {
    const selectedValue = (target.selectedItem as IComboItem).value;
    this.type = selectedValue;
    if (this.onChanged) this.onChanged('background', this.color);
  }

  private onColorChanged(target: ColorPicker) {
    const color = target.value;
    this.color = color;
    if (this.onChanged) this.onChanged('background', this.color);
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    const color = this.getAttribute('color', true);
    const type = this.getAttribute('type', true);
    if (color || type) this.setData({ color, type });
  }

  render() {
    return (
      <i-vstack
        width="100%"
        height="100%"
        margin={{ left: "auto", right: "auto" }}
        position="relative"
      >
        <designer-tool-header name="Background" tooltipText="Set a background color or image for the element." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-grid-layout width="100%" templateColumns={['70px', 'auto']} verticalAlignment="center">
            <i-label caption="Color" font={{ size: '0.75rem' }} />
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
