import {
  Module,
  ControlElement,
  customElements,
  Container,
  Styles,
  VStack,
  Button,
  IconName
} from '@ijstech/components'
import { bgInputTransparent, borderRadiusLeft, borderRadiusRight, buttonAutoStyled, customColorStyled, customIconLayoutActiveStyled, customIconLayoutStyled, textInputRight, unitStyled } from './index.css';
import DesignerToolModalSpacing from './modal-spacing';
import assets from '../assets';
const Theme = Styles.Theme.ThemeVars;

const borderStyles = [
  {
    caption: 'Solid',
    value: 'solid',
    img: assets.fullPath('img/designer/border/solid.svg'),
    isActive: true,
    classes: borderRadiusLeft
  },
  {
    caption: 'Dotted',
    value: 'dotted',
    img: assets.fullPath('img/designer/border/dotted.svg')
  },
  {
    caption: 'Dashed',
    value: 'dashed',
    img: assets.fullPath('img/designer/border/dashed.svg'),
    classes: borderRadiusRight
  },
]

interface DesignerToolBordersElement extends ControlElement {

}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-borders']: DesignerToolBordersElement
    }
  }
}

@customElements('designer-tool-borders')
export default class DesignerToolBorders extends Module {
  private vStackContent: VStack;
  private mdSpacing: DesignerToolModalSpacing;
  private currentButton: Button;

  constructor(parent?: Container, options?: DesignerToolBordersElement) {
    super(parent, options);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private renderUI() {

  }

  private onShowSpacingModal(target: Button, title: string) {
    this.currentButton = target;
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
        <designer-tool-header name="Borders" tooltipText="Define the border size and styles." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" gap={16} padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-vstack gap={8}>
            <i-label caption="OVERALL" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-hstack gap={16} verticalAlignment="center">
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label caption="Width" font={{ size: '0.75rem' }} />
                <i-hstack verticalAlignment="center" width={80} border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
                  <i-input
                    inputType="number"
                    placeholder="auto"
                    background={{ color: 'transparent' }}
                    width="100%"
                    height={24}
                    border={{ width: 0 }}
                    padding={{ left: 4, right: 4 }}
                    font={{ size: '0.675rem' }}
                    class={`${textInputRight} ${bgInputTransparent}`}
                  />
                </i-hstack>
              </i-grid-layout>
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label caption="Radius" font={{ size: '0.75rem' }} />
                <i-hstack verticalAlignment="center" width={80} border={{ radius: 8 }} background={{ color: Theme.input.background }} overflow="hidden">
                  <i-input
                    inputType="number"
                    placeholder="auto"
                    background={{ color: 'transparent' }}
                    width="100%"
                    height={24}
                    border={{ width: 0 }}
                    padding={{ left: 4, right: 4 }}
                    font={{ size: '0.675rem' }}
                    class={`${textInputRight} ${bgInputTransparent}`}
                  />
                </i-hstack>
              </i-grid-layout>
            </i-hstack>
          </i-vstack>
          <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
          <i-vstack gap={8}>
            <i-label caption="INDIVIDUAL EDGES" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={8} width="100%" horizontalAlignment="center">
              <i-hstack position="relative" width="100%" horizontalAlignment="center">
                <i-label caption="Width" font={{ size: '0.75rem' }} position="absolute" top={0} left={0} />
                <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Border Top Width')} />
              </i-hstack>
              <i-hstack width="100%" verticalAlignment="center" horizontalAlignment="space-between">
                <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Border Left Width')} />
                <i-vstack verticalAlignment="space-between" width={200} height={100} padding={{ top: 4, bottom: 4, left: 4, right: 4 }} border={{ width: 4, style: 'solid', color: Theme.action.selectedBackground }}>
                  <i-hstack width="100%" verticalAlignment="center" horizontalAlignment="space-between">
                    <i-button caption="0" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Border Top Left Radius')} />
                    <i-label caption="Radius" font={{ size: '0.75rem' }} />
                    <i-button caption="0" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Border Top Right Radius')} />
                  </i-hstack>
                  <i-hstack width="100%" horizontalAlignment="space-between">
                    <i-button caption="0" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Border Bottom Left Radius')} />
                    <i-button caption="0" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Border Bottom Left Radius')} />
                  </i-hstack>
                </i-vstack>
                <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Border Right Width')} />
              </i-hstack>
              <i-button caption="auto" class={buttonAutoStyled} onClick={(target: Button) => this.onShowSpacingModal(target, 'Border Bottom Width')} />
            </i-vstack>
          </i-vstack>
          <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
          <i-vstack gap={8}>
            <i-label caption="DECORATION" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
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
            <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
              <i-label caption="Style" font={{ size: '0.75rem' }} />
              <i-hstack gap={1} verticalAlignment="center" class={`${borderRadiusLeft} ${borderRadiusRight}`}>
                {borderStyles.map(v => <i-panel
                  display="flex"
                  tooltip={{ content: v.caption }}
                  class={`${customIconLayoutStyled} ${v.classes || ''} ${v.isActive ? customIconLayoutActiveStyled : ''}`}
                  padding={{ top: 4, bottom: 4, left: 34, right: 34 }}
                >
                  <i-image
                    display="flex"
                    url={v.img}
                    width={16}
                    height={16}
                  />
                </i-panel>
                )}
              </i-hstack>
            </i-grid-layout>
          </i-vstack>
        </i-vstack>
        <designer-tool-modal-spacing id="mdSpacing" />
      </i-vstack>
    )
  }
}
