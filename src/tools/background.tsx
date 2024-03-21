import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack
} from '@ijstech/components'
import { customColorStyled } from './index.css';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolBackgroundElement extends ControlElement {

}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-background']: DesignerToolBackgroundElement
    }
  }
}

@customElements('designer-tool-background')
export default class DesignerToolBackground extends Module {
  private vStackContent: VStack;

  constructor(parent?: Container, options?: DesignerToolBackgroundElement) {
    super(parent, options);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {

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
        <designer-tool-header name="Background" tooltipText="Set a background color or image for the element." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-grid-layout width="100%" templateColumns={['70px', 'auto']} verticalAlignment="center">
            <i-label caption="Color" font={{ size: '0.75rem' }} />
            <i-hstack gap={4} width="100%" verticalAlignment="center">
              <i-color class={customColorStyled} />
              <i-combo-box
                width="calc(100% - 28px)"
                items={[
                  {
                    value: 'primary',
                    label: 'Primary'
                  },
                  {
                    value: 'secondary',
                    label: 'Secondary'
                  },
                  {
                    value: 'background',
                    label: 'Background'
                  }
                ]}
                placeholder="Type or select a color..."
              />
            </i-hstack>
          </i-grid-layout>
        </i-vstack>
      </i-vstack>
    )
  }
}
