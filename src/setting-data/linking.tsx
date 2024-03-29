import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Input
} from '@ijstech/components'
import { DesignerToolHeader } from '../tools';
const Theme = Styles.Theme.ThemeVars;

interface DesignerDataLinkingElement extends ControlElement {

}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-data-linking']: DesignerDataLinkingElement
    }
  }
}

@customElements('designer-data-linking')
export default class DesignerDataLinking extends Module {
  private vStackContent: VStack;

  constructor(parent?: Container, options?: DesignerDataLinkingElement) {
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
        <designer-tool-header name="Navigation Params" tooltipText="Pass data between screens by creating Navigation parameters that your screen accepts when navigated to. Test values will be used when no value is passed in, or when viewing the screen in the Web view." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" gap={16} padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-vstack gap={8}>
            <i-label
              caption="Deep Linking allows you to open a specific screen from a website or other app."
              font={{ size: '0.75rem' }}
              opacity={0.8}
            />
            <i-hstack gap={8} verticalAlignment="center" horizontalAlignment="space-between">
              <i-label caption="Create Deep Link For This Screen" font={{ size: '0.75rem' }} />
              <i-switch />
            </i-hstack>
          </i-vstack>
          <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
          <i-vstack gap={8}>
            <i-label caption="DEEP LINKING PREVIEW" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-label
              caption="In order to access this screen from a different app, type the following URL into a web browser. This will only work if you're using the Draftbit app or if you export your project"
              font={{ size: '0.75rem' }}
              opacity={0.8}
            />
            <i-label
              caption="Enable Deep Linking above to see your URL preview"
              font={{ size: '0.75rem', color: Theme.colors.primary.main }}
            />
          </i-vstack>
        </i-vstack>
      </i-vstack>
    )
  }
}
