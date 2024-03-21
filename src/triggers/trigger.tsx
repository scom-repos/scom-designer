import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack
} from '@ijstech/components'
import { DesignerToolHeader } from '../tools/index';
const Theme = Styles.Theme.ThemeVars;

interface DesignerTriggerElement extends ControlElement {

}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-trigger']: DesignerTriggerElement
    }
  }
}

@customElements('designer-trigger')
export default class DesignerTrigger extends Module {
  private vStackContent: VStack;

  constructor(parent?: Container, options?: DesignerTriggerElement) {
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
        <designer-tool-header name="Trigger" tooltipText="Add a trigger for an action." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" gap={16} padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-grid-layout
            templateColumns={['auto', '60px']}
            verticalAlignment="center"
            padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
            border={{ radius: 4 }}
            background={{ color: '#26324b' }}
            cursor="pointer"
          >
            <i-vstack gap={4}>
              <i-hstack gap={4} verticalAlignment="center">
                <i-icon name="hand-point-up" width={14} height={14} />
                <i-label caption="On Screen Focus" font={{ size: '0.725rem', bold: true }} />
              </i-hstack>
              <i-label caption="Runs when the screen comes into focus" font={{ size: '0.725rem' }} opacity={0.8} />
            </i-vstack>
            <i-label
              caption="0"
              font={{ size: '0.625rem' }}
              padding={{ top: 2, bottom: 2, left: 4, right: 4 }}
              border={{ radius: 4, width: 1, style: 'solid', color: Theme.divider }}
            />
          </i-grid-layout>
        </i-vstack>
      </i-vstack>
    )
  }
}
