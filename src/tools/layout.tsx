import {
  Module,
  ControlElement,
  customElements,
  Label,
  Container,
  Styles,
  VStack,
  GridLayout,
  Input
} from '@ijstech/components'
import { borderRadiusLeft, borderRadiusRight, customIconLayoutActiveStyled, customIconLayoutStyled, textInputRight } from './index.css';
import assets from '../assets';
const Theme = Styles.Theme.ThemeVars;

const alignProps = [
  {
    caption: 'Flex Start',
    value: 'flex-start',
    img: assets.fullPath('img/designer/layout/align-start.svg'),
    classes: borderRadiusLeft
  },
  {
    caption: 'Center',
    value: 'center',
    img: assets.fullPath('img/designer/layout/align-center.svg')
  },
  {
    caption: 'Flex End',
    value: 'flex-end',
    img: assets.fullPath('img/designer/layout/align-start.svg'),
    rotate: 180
  },
  {
    caption: 'Stretch',
    value: 'stretch',
    img: assets.fullPath('img/designer/layout/align-stretch.svg'),
    isActive: true
  },
  {
    caption: 'Baseline',
    value: 'baseline',
    img: assets.fullPath('img/designer/layout/align-base-line.svg'),
    classes: borderRadiusRight
  }
]

const justifyProps = [
  {
    caption: 'Flex Start',
    value: 'flex-start',
    img: assets.fullPath('img/designer/layout/justify-start.svg'),
    isActive: true,
    classes: borderRadiusLeft
  },
  {
    caption: 'Center',
    value: 'center',
    img: assets.fullPath('img/designer/layout/justify-center.svg')
  },
  {
    caption: 'Flex End',
    value: 'flex-end',
    img: assets.fullPath('img/designer/layout/justify-start.svg'),
    rotate: 180
  },
  {
    caption: 'Space Between',
    value: 'space-between',
    img: assets.fullPath('img/designer/layout/justify-between.svg')
  },
  {
    caption: 'Space Around',
    value: 'space-around',
    img: assets.fullPath('img/designer/layout/justify-around.svg')
  },
  {
    caption: 'Space Evenly',
    placement: 'left',
    value: 'space-evenly',
    img: assets.fullPath('img/designer/layout/justify-evenly.svg'),
    classes: borderRadiusRight
  }
]

const alignContentProps = [
  {
    caption: 'Flex Start',
    value: 'flex-start',
    img: assets.fullPath('img/designer/layout/align-start.svg'),
    isActive: true,
    classes: borderRadiusLeft
  },
  {
    caption: 'Center',
    value: 'center',
    img: assets.fullPath('img/designer/layout/align-center.svg')
  },
  {
    caption: 'Flex End',
    value: 'flex-end',
    img: assets.fullPath('img/designer/layout/align-start.svg'),
    rotate: 180
  },
  {
    caption: 'Space Between',
    value: 'space-between',
    img: assets.fullPath('img/designer/layout/justify-between.svg'),
    rotate: 90
  },
  {
    caption: 'Space Around',
    value: 'space-around',
    img: assets.fullPath('img/designer/layout/justify-around.svg'),
    rotate: 90
  },
  {
    caption: 'Stretch',
    value: 'stretch',
    img: assets.fullPath('img/designer/layout/align-stretch.svg'),
    classes: borderRadiusRight
  }
]

interface DesignerToolLayoutElement extends ControlElement {

}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-tool-layout']: DesignerToolLayoutElement
    }
  }
}

@customElements('designer-tool-layout')
export default class DesignerToolLayout extends Module {
  private vStackContent: VStack;
  private isBasicFlex = true;
  private lbTypeFlex: Label;
  private inputBasicFlex: Input;
  private wrapperAdvancedFlex: GridLayout;

  constructor(parent?: Container, options?: DesignerToolLayoutElement) {
    super(parent, options);
  }

  private onCollapse(isShown: boolean) {
    this.vStackContent.visible = isShown;
  }

  private onFlexChanged() {
    this.isBasicFlex = !this.isBasicFlex;
    this.lbTypeFlex.caption = this.isBasicFlex ? 'Advanced' : 'Basic';
    this.inputBasicFlex.enabled = this.inputBasicFlex.visible = this.isBasicFlex;
    this.wrapperAdvancedFlex.visible = !this.isBasicFlex;
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
        <designer-tool-header name="Layout" tooltipText="With Flexbox, you can specify the layout of an element and its children to provide a consistent layout on different screen sizes." onCollapse={this.onCollapse} />
        <i-vstack id="vStackContent" gap={16} padding={{ top: 16, bottom: 16, left: 12, right: 12 }}>
          <i-vstack gap={8}>
            <i-label caption="FLEX ITEMS" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={12}>
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label caption="Direction" font={{ size: '0.75rem' }} />
                <i-hstack gap={12} verticalAlignment="center">
                  <i-hstack gap={1} verticalAlignment="center" class={`${borderRadiusLeft} ${borderRadiusRight}`}>
                    <i-panel
                      display="flex"
                      tooltip={{ content: 'Column' }}
                      class={`${borderRadiusLeft} ${customIconLayoutStyled} ${customIconLayoutActiveStyled}`}
                      padding={{ top: 4, bottom: 4, left: 8, right: 8 }}
                    >
                      <i-image
                        display="flex"
                        url={assets.fullPath('img/designer/layout/column.svg')}
                        width={16}
                        height={16}
                      />
                    </i-panel>
                    <i-panel
                      display="flex"
                      tooltip={{ content: 'Row' }}
                      class={`${borderRadiusRight} ${customIconLayoutStyled}`}
                      padding={{ top: 4, bottom: 4, left: 8, right: 8 }}
                    >
                      <i-image
                        display="flex"
                        url={assets.fullPath('img/designer/layout/column.svg')}
                        width={16}
                        height={16}
                        rotate={180}
                      />
                    </i-panel>
                  </i-hstack>
                  <i-hstack gap={4} verticalAlignment="center">
                    <i-switch />
                    <i-label caption="Reverse" font={{ size: '0.875rem' }} />
                  </i-hstack>
                </i-hstack>
              </i-grid-layout>
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label caption="Align" font={{ size: '0.75rem' }} />
                <i-hstack gap={1} verticalAlignment="center" class={`${borderRadiusLeft} ${borderRadiusRight}`}>
                  {alignProps.map(v => <i-panel
                    display="flex"
                    tooltip={{ content: v.caption }}
                    class={`${customIconLayoutStyled} ${v.classes || ''} ${v.isActive ? customIconLayoutActiveStyled : ''}`}
                    padding={{ top: 4, bottom: 4, left: 17, right: 17 }}
                  >
                    <i-image
                      display="flex"
                      url={v.img}
                      width={16}
                      height={16}
                      rotate={v.rotate || 0}
                    />
                  </i-panel>
                  )}
                </i-hstack>
              </i-grid-layout>
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label caption="Justify" font={{ size: '0.75rem' }} />
                <i-hstack gap={1} verticalAlignment="center" class={`${borderRadiusLeft} ${borderRadiusRight}`}>
                  {justifyProps.map(v => <i-panel
                    display="flex"
                    tooltip={{ content: v.caption, placement: v.placement as 'left' }}
                    class={`${customIconLayoutStyled} ${v.classes || ''} ${v.isActive ? customIconLayoutActiveStyled : ''}`}
                    padding={{ top: 4, bottom: 4, left: 12.75, right: 12.75 }}
                  >
                    <i-image
                      display="flex"
                      url={v.img}
                      width={16}
                      height={16}
                      rotate={v.rotate || 0}
                    />
                  </i-panel>
                  )}
                </i-hstack>
              </i-grid-layout>
            </i-vstack>
          </i-vstack>
          <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
          <i-vstack gap={8}>
            <i-label caption="SELECTED ITEM" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={12}>
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label caption="Align" font={{ size: '0.75rem' }} />
                <i-hstack gap={1} verticalAlignment="center" class={`${borderRadiusLeft} ${borderRadiusRight}`}>
                  <i-panel
                    display="flex"
                    tooltip={{ content: 'Auto' }}
                    class={`${customIconLayoutStyled} ${borderRadiusLeft} ${customIconLayoutActiveStyled}`}
                    padding={{ top: 4, bottom: 4, left: 12.75, right: 12.75 }}
                  >
                    <i-icon
                      display="flex"
                      name={'times'}
                      width={16}
                      height={16}
                    />
                  </i-panel>
                  {alignProps.map((v, idx) => <i-panel
                    display="flex"
                    tooltip={{ content: v.caption }}
                    class={`${customIconLayoutStyled} ${idx === alignProps.length - 1 ? v.classes : ''}`}
                    padding={{ top: 4, bottom: 4, left: 12.75, right: 12.75 }}
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
              <i-grid-layout templateColumns={['70px', 'auto']}>
                <i-vstack gap={8}>
                  <i-label caption="Flex" font={{ size: '0.75rem' }} lineHeight="24px" />
                  <i-hstack gap={2} width="fit-content" verticalAlignment="center" opacity={0.7} cursor="pointer" onClick={this.onFlexChanged}>
                    <i-label id="lbTypeFlex" caption="Advanced" font={{ size: '0.825rem' }} />
                    <i-icon name="arrow-right" fill="#fff" width={12} height={12} />
                  </i-hstack>
                </i-vstack>
                <i-vstack>
                  <i-input
                    id="inputBasicFlex"
                    inputType="number"
                    placeholder="0"
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
                  <i-grid-layout id="wrapperAdvancedFlex" visible={false} gap={{ column: 4 }} templateColumns={['1fr', '1fr', '1fr']} maxWidth={254} verticalAlignment="center">
                    <i-vstack gap={8} horizontalAlignment="center">
                      <i-input
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
                      <i-label caption="Basis" font={{ size: '0.75rem' }} opacity={0.7} />
                    </i-vstack>
                    <i-vstack gap={8} horizontalAlignment="center">
                      <i-input
                        inputType="number"
                        placeholder="0"
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
                      <i-label caption="Grow" font={{ size: '0.75rem' }} opacity={0.7} />
                    </i-vstack>
                    <i-vstack gap={8} horizontalAlignment="center">
                      <i-input
                        inputType="number"
                        placeholder="1"
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
                      <i-label caption="Shrink" font={{ size: '0.75rem' }} opacity={0.7} />
                    </i-vstack>
                  </i-grid-layout>
                </i-vstack>
              </i-grid-layout>
            </i-vstack>
          </i-vstack>
          <i-panel width="100%" height={1} background={{ color: Theme.divider }} />
          <i-vstack gap={8}>
            <i-label caption="CONTENT" font={{ size: '0.875rem' }} letterSpacing="0.2em" opacity={0.8} />
            <i-vstack gap={12}>
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label caption="Wrap" font={{ size: '0.75rem' }} />
                <i-grid-layout gap={{ column: 1 }} templateColumns={['1fr', '1fr', '1fr']} verticalAlignment="center">
                  <i-label
                    caption="None"
                    class={`text-center ${customIconLayoutStyled} ${borderRadiusLeft} ${customIconLayoutActiveStyled}`}
                    padding={{ top: 4, bottom: 4 }}
                  />
                  <i-label
                    caption="Wrap"
                    class={`text-center ${customIconLayoutStyled}`}
                    padding={{ top: 4, bottom: 4 }}
                  />
                  <i-label
                    caption="Reverse"
                    class={`text-center ${customIconLayoutStyled} ${borderRadiusRight}`}
                    padding={{ top: 4, bottom: 4 }}
                  />
                </i-grid-layout>
              </i-grid-layout>
              <i-grid-layout templateColumns={['70px', 'auto']} verticalAlignment="center">
                <i-label caption="Align" font={{ size: '0.75rem' }} />
                <i-hstack gap={1} verticalAlignment="center" class={`${borderRadiusLeft} ${borderRadiusRight}`}>
                  {alignContentProps.map(v => <i-panel
                    display="flex"
                    tooltip={{ content: v.caption }}
                    class={`${customIconLayoutStyled} ${v.classes || ''} ${v.isActive ? customIconLayoutActiveStyled : ''}`}
                    padding={{ top: 4, bottom: 4, left: 12.75, right: 12.75 }}
                  >
                    <i-image
                      display="flex"
                      url={v.img}
                      width={16}
                      height={16}
                      rotate={v.rotate || 0}
                    />
                  </i-panel>
                  )}
                </i-hstack>
              </i-grid-layout>
            </i-vstack>
          </i-vstack>
        </i-vstack>
      </i-vstack>
    )
  }
}
