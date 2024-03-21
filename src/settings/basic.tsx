import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Input
} from '@ijstech/components'
import { borderRadiusLeft, borderRadiusRight, customIconLayoutActiveStyled, customIconLayoutStyled, textInputRight } from '../tools/index';
const Theme = Styles.Theme.ThemeVars;

interface DesignerSettingsBasicElement extends ControlElement {

}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-settings-basic']: DesignerSettingsBasicElement
    }
  }
}

@customElements('designer-settings-basic')
export default class DesignerSettingsBasic extends Module {
  private vStackContent: VStack;
  private inputName: Input;

  constructor(parent?: Container, options?: DesignerSettingsBasicElement) {
    super(parent, options);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {
    this.inputName.value = 'First Screen';
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
        <designer-tool-header name="Basic" onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" gap={16} padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-grid-layout templateColumns={['128px', 'auto']} verticalAlignment="center">
            <i-label caption="Name" font={{ size: '0.75rem' }} />
            <i-input
              id="inputName"
              width="100%"
              height={24}
              border={{ radius: 8, width: 0 }}
              padding={{ left: 4, right: 4 }}
              font={{ size: '0.75rem' }}
              class={textInputRight}
            />
          </i-grid-layout>
          <i-grid-layout templateColumns={['128px', 'auto']} verticalAlignment="center">
            <i-label caption="Description" font={{ size: '0.75rem' }} />
            <i-input
              width="100%"
              height={24}
              border={{ radius: 8, width: 0 }}
              padding={{ left: 4, right: 4 }}
              font={{ size: '0.75rem' }}
              class={textInputRight}
            />
          </i-grid-layout>
          <i-grid-layout templateColumns={['128px', 'auto']} verticalAlignment="center">
            <i-label caption="Status Bar Color" font={{ size: '0.75rem' }} />
            <i-grid-layout gap={{ column: 1 }} templateColumns={['1fr', '1fr', '1fr']} verticalAlignment="center">
              <i-label
                caption="Default"
                class={`text-center ${customIconLayoutStyled} ${borderRadiusLeft} ${customIconLayoutActiveStyled}`}
                padding={{ top: 4, bottom: 4 }}
              />
              <i-label
                caption="Dark"
                class={`text-center ${customIconLayoutStyled}`}
                padding={{ top: 4, bottom: 4 }}
              />
              <i-label
                caption="Light"
                class={`text-center ${customIconLayoutStyled} ${borderRadiusRight}`}
                padding={{ top: 4, bottom: 4 }}
              />
            </i-grid-layout>
          </i-grid-layout>
          <i-grid-layout templateColumns={['128px', 'auto']} verticalAlignment="center">
            <i-label caption="Scrollable?" font={{ size: '0.75rem' }} />
            <i-switch margin={{ left: 'auto' }} />
          </i-grid-layout>
        </i-vstack>
      </i-vstack>
    )
  }
}
