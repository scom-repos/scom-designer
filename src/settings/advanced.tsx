import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
} from '@ijstech/components'
import { DesignerToolHeader } from '../tools/index';
const Theme = Styles.Theme.ThemeVars;

interface DesignerSettingsAdvancedElement extends ControlElement {

}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-settings-advanced']: DesignerSettingsAdvancedElement
    }
  }
}

@customElements('designer-settings-advanced')
export default class DesignerSettingsAdvanced extends Module {
  private vStackContent: VStack;

  constructor(parent?: Container, options?: DesignerSettingsAdvancedElement) {
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
        <designer-tool-header name="Advanced" onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" gap={16} padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-label
            caption="Safe Area View should only be enabled if you've explicitly removed or hidden the header from Stack Navigator within the Navigation config"
            font={{ size: '0.75rem' }}
            opacity={0.8}
          />
          <i-grid-layout templateColumns={['130px', 'auto']} verticalAlignment="center">
            <i-label caption="Safe Area View?" font={{ size: '0.75rem' }} />
            <i-switch margin={{ left: 'auto' }} />
          </i-grid-layout>
          <i-grid-layout templateColumns={['130px', 'auto']} verticalAlignment="center">
            <i-label caption="Top Safe Area View?" font={{ size: '0.75rem' }} />
            <i-switch margin={{ left: 'auto' }} />
          </i-grid-layout>
          <i-grid-layout templateColumns={['130px', 'auto']} verticalAlignment="center">
            <i-label caption="Bottom Safe Area View?" font={{ size: '0.75rem' }} />
            <i-switch margin={{ left: 'auto' }} />
          </i-grid-layout>
        </i-vstack>
      </i-vstack>
    )
  }
}
