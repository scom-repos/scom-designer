import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Modal,
  Label,
  Button
} from '@ijstech/components'
import { bgInputTransparent, buttonAutoStyled, textInputRight, unitStyled } from './index.css';
import DesignerToolModalSpacing from './modal-spacing';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolMarginsAndPaddingElement extends ControlElement {

}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-margins-padding']: DesignerToolMarginsAndPaddingElement
    }
  }
}

@customElements('designer-tool-margins-padding')
export default class DesignerToolMarginsAndPadding extends Module {
  private vStackContent: VStack;
  private mdUnits: Modal;
  private mdSpacing: DesignerToolModalSpacing;
  private currentLabel: Label;
  private currentButton: Button;

  constructor(parent?: Container, options?: DesignerToolMarginsAndPaddingElement) {
    super(parent, options);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {

  }

  private onShowUnitsModal(target: Label) {
    this.currentLabel = target as Label;
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

  private onShowSpacingModal(target: Button, title: string) {
    this.currentButton = target;
    this.mdSpacing.onShowModal(target, title, 'mobile-alt', 'Configure a value for Mobile screen sizes or larger');
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
        <designer-tool-header name="Margins And Padding" tooltipText="Margins create extra space around an element, while padding creates extra space within an element." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" gap={16} padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-vstack gap={8}>
            <i-label caption="OVERALL" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-hstack gap={16} verticalAlignment="center">
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label caption="Margin" font={{ size: '0.75rem' }} />
                <i-hstack verticalAlignment="center" width={80} border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
                  <i-input
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
                    onClick={(target: Label) => this.onShowUnitsModal(target)}
                  />
                </i-hstack>
              </i-grid-layout>
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label caption="Padding" font={{ size: '0.75rem' }} />
                <i-hstack verticalAlignment="center" width={80} border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
                  <i-input
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
                    onClick={(target: Label) => this.onShowUnitsModal(target)}
                  />
                </i-hstack>
              </i-grid-layout>
            </i-hstack>
          </i-vstack>
          <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
          <i-vstack gap={8}>
            <i-label caption="INDIVIDUAL" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={8} width="100%" horizontalAlignment="center">
              <i-hstack position="relative" width="100%" horizontalAlignment="center">
                <i-label caption="Margin" font={{ size: '0.75rem' }} position="absolute" top={0} left={0} />
                <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Margin Top')} />
              </i-hstack>
              <i-hstack width="100%" verticalAlignment="center" horizontalAlignment="space-between">
                <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Margin Left')} />
                <i-panel position="relative" width={200} padding={{ top: 10, bottom: 10, left: 10, right: 10 }} border={{ width: 4, style: 'solid', color: Theme.action.selectedBackground }}>
                  <i-label caption="Padding" font={{ size: '0.75rem' }} position="absolute" top={10} left={10} />
                  <i-vstack horizontalAlignment="center">
                    <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Padding Top')} />
                    <i-hstack width="100%" horizontalAlignment="space-between">
                      <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Padding Left')} />
                      <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Padding Right')} />
                    </i-hstack>
                    <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Padding Bottom')} />
                  </i-vstack>
                </i-panel>
                <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Margin Right')} />
              </i-hstack>
              <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Margin Bottom')} />
            </i-vstack>
          </i-vstack>
        </i-vstack>
        <designer-tool-modal-spacing id="mdSpacing" />
      </i-vstack>
    )
  }
}
