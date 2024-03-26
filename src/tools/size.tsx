import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Modal,
  Label,
  Input
} from '@ijstech/components'
import { bgInputTransparent, textInputRight, unitStyled } from './index.css';
import { onChangedCallback } from '../interface';
const Theme = Styles.Theme.ThemeVars;

const sizes = [
  [
    {
      id: 'inputWidth',
      caption: 'Width',
      prop: 'width'
    },
    {
      id: 'inputHeight',
      caption: 'Height',
      prop: 'height'
    }
  ],
  [
    {
      id: 'inputMinWidth',
      caption: 'Min W',
      prop: 'minWidth'
    },
    {
      id: 'inputMinHeight',
      caption: 'Min H',
      prop: 'minHeight'
    }
  ],
  [
    {
      id: 'inputMaxWidth',
      caption: 'Max W',
      prop: 'maxWidth'
    },
    {
      id: 'inputMaxHeight',
      caption: 'Max H',
      prop: 'maxHeight'
    }
  ]
]

interface DesignerToolSizeElement extends ControlElement {
  onChanged?: onChangedCallback;
}

interface IDesignerSize {
  width?: number|string;
  height?: number|string;
  minWidth?: number|string;
  minHeight?: number|string;
  maxWidth?: number|string;
  maxHeight?: number|string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-size']: DesignerToolSizeElement
    }
  }
}

@customElements('designer-tool-size')
export default class DesignerToolSize extends Module {
  private vStackContent: VStack;
  private mdUnits: Modal;
  private currentLabel: Label;
  private inputWidth: Input;
  private inputHeight: Input;
  private inputMinWidth: Input;
  private inputMinHeight: Input;
  private inputMaxWidth: Input;
  private inputMaxHeight: Input;

  private _data: IDesignerSize = {};
  private unit: string = 'px';

  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: DesignerToolSizeElement) {
    super(parent, options);
  }

  setData(value: IDesignerSize) {
    this._data = value;
    this.renderUI();
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {
    const { width, height, minWidth, minHeight, maxWidth, maxHeight } = this._data;
    if (width !== undefined) this.inputWidth.value = width;
    if (height !== undefined) this.inputHeight.value = height;
    if (minWidth !== undefined) this.inputMinWidth.value = minWidth;
    if (minHeight !== undefined) this.inputMinHeight.value = minHeight;
    if (maxWidth !== undefined) this.inputMaxWidth.value = maxWidth;
    if (maxHeight !== undefined) this.inputMaxHeight.value = maxHeight;
  }

  private onValueChanged(target: Input, prop: string) {
    const newValue = target.value;
    this._data[prop] = `${newValue}${this.unit}`;
    if (this.onChanged) this.onChanged(prop, this._data[prop]);
  }

  private onShowUnits(target: Label, event: MouseEvent) {
    this.currentLabel = target;
    const rect = target.getBoundingClientRect();
    const { x, y } = rect;
    const mdWrapper = this.mdUnits.querySelector('.modal-wrapper') as HTMLElement;
    mdWrapper.style.top = `${y + 24}px`;
    mdWrapper.style.left = `${x}px`;
    this.mdUnits.visible = true;
  }

  private async initModalUnits() {
    this.mdUnits = await Modal.create({
      visible: false,
      showBackdrop: false,
      minWidth: '1.5rem',
      height: 'auto',
      popupPlacement: 'bottom'
    });
    const mdWrapper = this.mdUnits.querySelector('.modal-wrapper') as HTMLElement;
    mdWrapper.style.width = '1.5rem';
    mdWrapper.style.paddingInline = '0px';
    const onUnitChanged = (value: 'px' | '%') => {
      this.currentLabel.caption = value;
      this.unit = value;
      this.mdUnits.visible = false;
    }
    const itemUnits = new VStack(undefined, { gap: 8, border: { radius: 8 } });
    itemUnits.appendChild(<i-button background={{ color: 'transparent' }} boxShadow="none" caption="px" font={{ size: '0.625rem' }} onClick={() => onUnitChanged('px')} />);
    itemUnits.appendChild(<i-button background={{ color: 'transparent' }} boxShadow="none" caption="%" font={{ size: '0.625rem' }} onClick={() => onUnitChanged('%')} />);
    this.mdUnits.item = itemUnits;
    document.body.appendChild(this.mdUnits);
  }

  init() {
    super.init();
    this.initModalUnits();
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
        <designer-tool-header name="Size" tooltipText="Specify minimum, maximum, or specifically set heights and widths for the element." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-vstack gap={8}>
            {sizes.map(size =>
              <i-hstack gap={16} verticalAlignment="center">
                {size.map(v =>
                  <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                    <i-label caption={v.caption} font={{ size: '0.75rem' }} />
                    <i-hstack verticalAlignment="center" width={80} border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
                      <i-input
                        id={v.id}
                        inputType="number"
                        placeholder="auto"
                        background={{ color: 'transparent' }}
                        width="calc(100% - 1.5rem)"
                        height={24}
                        border={{ width: 0 }}
                        padding={{ left: 4, right: 2 }}
                        font={{ size: '0.675rem' }}
                        class={`${textInputRight} ${bgInputTransparent}`}
                        onChanged={(target: Input) => this.onValueChanged(target, v.prop)}
                      />
                      <i-label
                        caption="px"
                        font={{ size: '0.675rem' }}
                        cursor="pointer"
                        width={24}
                        height={24}
                        lineHeight="1.5rem"
                        opacity={1}
                        border={{
                          left: {
                            width: 1,
                            style: 'solid',
                            color: Theme.action.focus
                          }
                        }}
                        class={`text-center ${unitStyled}`}
                        onClick={(target: Label, event: MouseEvent) => this.onShowUnits(target, event)}
                      />
                    </i-hstack>
                  </i-grid-layout>
                )}
              </i-hstack>
            )}
          </i-vstack>
        </i-vstack>
      </i-vstack>
    )
  }
}
