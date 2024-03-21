import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack
} from '@ijstech/components'
import { customIconBorderStyled } from './index.css';
import DesignerToolHeader from './header';
const Theme = Styles.Theme.ThemeVars;

interface DesignerToolStylesheetElement extends ControlElement {

}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-stylesheet']: DesignerToolStylesheetElement
    }
  }
}

@customElements('designer-tool-stylesheet')
export default class DesignerToolStylesheet extends Module {
  private vStackContent: VStack;

  constructor(parent?: Container, options?: DesignerToolStylesheetElement) {
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
        <designer-tool-header name="Stylesheet" onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" gap={8} padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-hstack gap={4} verticalAlignment="center">
            <i-combo-box
              items={[
                {
                  value: 'My Style',
                  label: 'My Style'
                }
              ]}
              placeholder="Select or Create New..."
            />
            <i-icon name="pen" width={24} height={24} class={customIconBorderStyled} />
            <i-icon name="copy" width={24} height={24} class={customIconBorderStyled} />
            <i-icon name="arrow-up" width={24} height={24} class={customIconBorderStyled} />
            <i-icon name="arrow-left" width={24} height={24} class={customIconBorderStyled} />
          </i-hstack>
          <i-label caption="Styles: 0 direct, 0 disabled, 4 inherited" font={{ size: '0.675rem' }} opacity={0.6} />
        </i-vstack>
      </i-vstack>
    )
  }
}
