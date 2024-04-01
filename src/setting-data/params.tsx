import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Input
} from '@ijstech/components'
import { DesignerToolHeader, textInputRight } from '../tools';
const Theme = Styles.Theme.ThemeVars;

interface DesignerDataParamsElement extends ControlElement {

}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-data-params']: DesignerDataParamsElement
    }
  }
}

@customElements('designer-data-params')
export default class DesignerDataParams extends Module {
  private vStackContent: VStack;

  constructor(parent?: Container, options?: DesignerDataParamsElement) {
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
          <i-label
            caption="This screen does not have any Navigation Parameters. If you'd like to pass data to this screen, create a new parameter below."
            font={{ size: '0.75rem' }}
            opacity={0.8}
          />
          <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
          <i-vstack gap={8}>
            <i-label caption="CREATE NAVIGATION PARAM" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-grid-layout gap={{ column: 8 }} templateColumns={['auto', '16px']} verticalAlignment="center">
              <i-input
                placeholder="Parameter Name"
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
              <i-checkbox width={16} height={16} border={{ radius: 8 }} />
            </i-grid-layout>
          </i-vstack>
        </i-vstack>
      </i-vstack>
    )
  }
}
