import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Button
} from '@ijstech/components'
import { borderRadiusLeft, borderRadiusRight, buttonAutoStyled, customIconLayoutActiveStyled, customIconLayoutStyled, textInputRight } from './index.css';
import DesignerToolModalSpacing from './modal-spacing';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolPositionElement extends ControlElement {

}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-position']: DesignerToolPositionElement
    }
  }
}

@customElements('designer-tool-position')
export default class DesignerToolPosition extends Module {
  private vStackContent: VStack;
  private mdSpacing: DesignerToolModalSpacing;

  constructor(parent?: Container, options?: DesignerToolPositionElement) {
    super(parent, options);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {

  }

  private onShowModal(target: Button, title: string) {
    this.mdSpacing.onShowModal(target, title, 'mobile-alt', 'Configure a value for Mobile screen sizes or larger');
  }

  init() {
    super.init();
    this.renderUI();
  }

  render() {
    return (
      <i-vstack
        width="100%"
        height="100%"
        margin={{ left: "auto", right: "auto" }}
        position="relative"
      >
        <designer-tool-header name="Position" tooltipText="Define a relative or absolute position from the parent element." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-vstack gap={8}>
            <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label caption="Position" font={{ size: '0.75rem' }} />
              <i-grid-layout gap={{ column: 1 }} templateColumns={['1fr', '1fr']} verticalAlignment="center">
                <i-label
                  caption="Relative"
                  class={`text-center ${customIconLayoutStyled} ${borderRadiusLeft} ${customIconLayoutActiveStyled}`}
                  padding={{ top: 4, bottom: 4 }}
                />
                <i-label
                  caption="Absolute"
                  class={`text-center ${customIconLayoutStyled} ${borderRadiusRight}`}
                  padding={{ top: 4, bottom: 4 }}
                />
              </i-grid-layout>
            </i-grid-layout>
            <i-panel width={320} padding={{ top: 10, bottom: 10, left: 20, right: 20 }} border={{ radius: 8, width: 1, style: 'solid', color: Theme.action.selectedBackground }}>
              <i-vstack gap={4} horizontalAlignment="center">
                <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowModal(target, 'Top')} />
                <i-hstack width="100%" horizontalAlignment="space-between">
                  <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowModal(target, 'Left')} />
                  <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowModal(target, 'Right')} />
                </i-hstack>
                <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowModal(target, 'Bottom')} />
              </i-vstack>
            </i-panel>
            <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label caption="Z-Index" font={{ size: '0.75rem' }} />
              <i-input
                id="inputZIndex"
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
            </i-grid-layout>
            <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label caption="Overflow" font={{ size: '0.75rem' }} />
              <i-grid-layout gap={{ column: 1 }} templateColumns={['1fr', '1fr']} verticalAlignment="center">
                <i-label
                  caption="Visible"
                  class={`text-center ${customIconLayoutStyled} ${borderRadiusLeft} ${customIconLayoutActiveStyled}`}
                  padding={{ top: 4, bottom: 4 }}
                />
                <i-label
                  caption="Hidden"
                  class={`text-center ${customIconLayoutStyled} ${borderRadiusRight}`}
                  padding={{ top: 4, bottom: 4 }}
                />
              </i-grid-layout>
            </i-grid-layout>
          </i-vstack>
        </i-vstack>
        <designer-tool-modal-spacing id="mdSpacing" />
      </i-vstack>
    )
  }
}
