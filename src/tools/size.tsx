import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Modal,
  Label
} from '@ijstech/components'
import { bgInputTransparent, textInputRight, unitStyled } from './index.css';
const Theme = Styles.Theme.ThemeVars;

const sizes = [
  [
    {
      id: 'inputWidth',
      caption: 'Width'
    },
    {
      id: 'inputHeight',
      caption: 'Height'
    }
  ],
  [
    {
      id: 'inputMinWidth',
      caption: 'Min W'
    },
    {
      id: 'inputMinHeight',
      caption: 'Min H'
    }
  ],
  [
    {
      id: 'inputMaxWidth',
      caption: 'Max W'
    },
    {
      id: 'inputMaxHeight',
      caption: 'Max H'
    }
  ]
]

interface DesignerToolSizeElement extends ControlElement {

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

  constructor(parent?: Container, options?: DesignerToolSizeElement) {
    super(parent, options);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {

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
      minWidth: '24px',
      height: 'auto',
      popupPlacement: 'bottom'
    });
    const mdWrapper = this.mdUnits.querySelector('.modal-wrapper') as HTMLElement;
    mdWrapper.style.width = '24px';
    mdWrapper.style.paddingInline = '0px';
    const onUnitChanged = (value: 'pt' | '%') => {
      this.currentLabel.caption = value;
      this.mdUnits.visible = false;
    }
    const itemUnits = new VStack(undefined, { gap: 8, border: { radius: 8 } });
    itemUnits.appendChild(<i-button background={{ color: 'transparent' }} boxShadow="none" caption="pt" font={{ size: '0.625rem' }} onClick={() => onUnitChanged('pt')} />);
    itemUnits.appendChild(<i-button background={{ color: 'transparent' }} boxShadow="none" caption="%" font={{ size: '0.625rem' }} onClick={() => onUnitChanged('%')} />);
    this.mdUnits.item = itemUnits;
    document.body.appendChild(this.mdUnits);
  }

  init() {
    super.init();
    this.renderUI();
    this.initModalUnits();
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
                        width="calc(100% - 24px)"
                        height={24}
                        border={{ width: 0 }}
                        padding={{ left: 4, right: 2 }}
                        font={{ size: '0.675rem' }}
                        class={`${textInputRight} ${bgInputTransparent}`}
                      />
                      <i-label
                        caption="pt"
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
