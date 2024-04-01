import {
  Module,
  Styles,
  ControlElement,
  customElements,
  IconName,
  HStack,
  Container,
  StackLayout,
} from '@ijstech/components'
import assets from '../assets';
import { customIconTabActiveStyled, customIconTabStyled, customTabStyled } from '../index.css';
import { IControl } from '../interface';
import {
  DesignerToolStylesheet,
  borderRadiusLeft,
  borderRadiusRight,
  DesignerToolLayout,
  DesignerToolBackground,
  DesignerToolSize,
  DesignerToolMarginsAndPadding,
  DesignerToolPosition,
  DesignerToolBorders,
  DesignerToolEffects,
  DesignerToolContent
} from '../tools/index';
import '../settings/index';
import '../triggers/index';
import '../setting-data/index';
const Theme = Styles.Theme.ThemeVars;

const enum BREAKPOINTS {
  MOBILE,
  TABLET,
  LAPTOP,
  DESKTOP,
  BIG_SCREEN
}

const enum PREVIEWS {
  DRAFT,
  WEB,
  IOS,
  ANDROID
}

type IPreview = {
  caption: string,
  icon?: IconName,
  url?: string,
  value: PREVIEWS,
  classes?: string,
  isActive?: boolean
}

const previews: IPreview[] = [
  {
    caption: 'Draft View',
    icon: 'edit',
    value: PREVIEWS.DRAFT,
    classes: borderRadiusLeft,
    isActive: true
  },
  {
    caption: 'Web Preview',
    icon: 'globe',
    value: PREVIEWS.WEB
  },
  {
    caption: 'iOS Preview',
    url: assets.fullPath('img/designer/iOS.svg'),
    value: PREVIEWS.IOS
  },
  {
    caption: 'Android Preview',
    url: assets.fullPath('img/designer/Android.svg'),
    value: PREVIEWS.ANDROID,
    classes: borderRadiusRight
  }
]

const breakpoints: { caption: string, icon: IconName, value: BREAKPOINTS, classes?: string, isActive?: boolean }[] = [
  {
    caption: 'Mobile',
    icon: 'mobile-alt',
    value: BREAKPOINTS.MOBILE,
    classes: borderRadiusLeft,
    isActive: true
  },
  {
    caption: 'Tablet',
    icon: 'tablet-alt',
    value: BREAKPOINTS.TABLET
  },
  {
    caption: 'Laptop',
    icon: 'laptop',
    value: BREAKPOINTS.LAPTOP
  },
  {
    caption: 'Desktop',
    icon: 'desktop',
    value: BREAKPOINTS.DESKTOP
  },
  {
    caption: 'Big Screen',
    icon: 'tv',
    value: BREAKPOINTS.BIG_SCREEN,
    classes: borderRadiusRight
  }
]

type onChangedCallback = (prop: string, value: any) => void

interface DesignerPropertiesElement extends ControlElement {
  component?: IControl;
  onChanged?: onChangedCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['designer-properties']: DesignerPropertiesElement
    }
  }
}

@customElements('designer-properties')
export default class DesignerProperties extends Module {
  private hStackInfo: HStack;
  private designerStylesheet: DesignerToolStylesheet;
  private designerLayout: DesignerToolLayout;
  private designerBackground: DesignerToolBackground;
  private designerSize: DesignerToolSize;
  private designerSpacing: DesignerToolMarginsAndPadding;
  private designerPosition: DesignerToolPosition;
  private designerBorders: DesignerToolBorders;
  private designerEffects: DesignerToolEffects;
  private designerContent: DesignerToolContent;

  private _component: IControl;

  onChanged: onChangedCallback;

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    this.onPropChanged = this.onPropChanged.bind(this);
  }

  static async create(options?: DesignerPropertiesElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get component() {
    return this._component;
  }

  set component(value: IControl) {
    this._component = value;
    this.renderUI();
  }

  private renderUI() {
    this.updateInfo();
    this.updateProps();
    const arr = ['i-label', 'i-button']
    this.designerContent.visible = this.component?.name && arr.includes(this.component.name);
  }

  private updateInfo() {
    if (!this.hStackInfo) return;
    const { name, image, icon, category } = this.component;
    this.hStackInfo.clearInnerHTML();
    this.hStackInfo.appendChild(
      <i-hstack gap={8} verticalAlignment="center" width="100%">
        {icon ? <i-icon name={icon} width={'1.5rem'} height={'1.5rem'} /> : image ? <i-image url={image} width={'1.5rem'} height={'1.5rem'} /> : []}
        <i-label caption={name} font={{ size: '1rem', bold: true }} />
        <i-label caption={category || ''} opacity={0.6} font={{ size: '0.625rem' }} margin={{ left: 'auto' }} display="flex" />
      </i-hstack>
    )
  }

  private updateProps() {
    const control = this.component.control;
    const {
      margin,
      padding,
      background,
      width,
      height,
      opacity,
      position,
      zIndex,
      border,
      top,
      right,
      bottom,
      left,
      overflow,
      display,
      stack,
      font
    } = control;
    const computedStyle =  window.getComputedStyle(control);
    this.designerBackground.setData({ color: background?.color || '' })
    this.designerSize.setData({
      width: computedStyle?.width || width || 0,
      height: computedStyle?.height || height || 0
    })
    this.designerEffects.setData({ opacity })
    let marginObj = {}
    let paddingObj = {}
    if (margin) {
      marginObj = {
        top: computedStyle?.marginTop || margin.top || 0,
        bottom: computedStyle?.marginBottom || margin.bottom || 0,
        left: computedStyle?.marginLeft || margin.left || 0,
        right: computedStyle?.marginRight ||margin.right || 0
      }
    }
    if (padding) {
      paddingObj = {
        top: computedStyle?.paddingTop || padding.top || 0,
        bottom: computedStyle?.paddingBottom || padding.bottom || 0,
        left: computedStyle?.paddingLeft || padding.left || 0,
        right: computedStyle?.paddingRight || padding.right || 0
      }
    }
    this.designerSpacing.setData({
      margin: marginObj,
      padding: paddingObj
    });
    this.designerPosition.setData({
      position,
      zIndex,
      top: computedStyle?.top || top || 0,
      left: computedStyle?.left || left || 0,
      right: computedStyle?.right || right || 0, 
      bottom: computedStyle?.bottom || bottom || 0,
      overflow: (overflow?.x === 'hidden' && overflow?.y === 'hidden') ? 'hidden' : 'auto'
    })
    let borderObj = {}
    if (border) {
      const topObj: any = border.top || {}
      topObj.width = computedStyle?.borderTopWidth || topObj.width || undefined
      const bottomObj: any = border.bottom || {}
      bottomObj.width = computedStyle?.borderBottomWidth || bottomObj.width || undefined
      const leftObj: any = border.left || {}
      leftObj.width = computedStyle?.borderLeftWidth || leftObj.width || undefined
      const rightObj: any = border.right || {}
      rightObj.width = computedStyle?.borderRightWidth || rightObj.width || undefined
      borderObj = {
        top: topObj,
        right: rightObj,
        bottom: bottomObj,
        left: leftObj,
        radius: computedStyle?.borderRadius || border.radius,
        width: computedStyle?.borderWidth || border.width,
        style: border.style,
        color: border.color
      }
    }
    this.designerBorders.setData({
      border: borderObj
    })
    this.designerLayout.setData({
      name: this.component?.name,
      display: display || control?.style.display,
      stack,
      direction: (control as StackLayout).direction
    })
    this.designerContent.setData({
      caption: (control as any).caption,
      font
    })
  }

  private onPropChanged(prop: string, value: any) {
    if (!this.component) return;
    if (this.onChanged) this.onChanged(prop, value);
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    const component = this.getAttribute('component', true);
    if (component) this.component = component;
  }

  render() {
    return (
      <i-vstack
        width={360}
        height="100%"
        minWidth={350}
        maxWidth="100%"
        margin={{ left: "auto", right: "auto" }}
        position="relative"
        background={{ color: Theme.background.main }}
        border={{ top: { width: 1, style: 'solid', color: Theme.divider } }}
        gap={1}
      >
        <i-hstack
          gap={4} width="100%"
          verticalAlignment="center" horizontalAlignment="space-between"
          padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
          background={{ color: '#26324b' }}
          stack={{shrink: '0'}}
        >
          <i-vstack gap={'0.5rem'}>
            <i-label caption="BREAKPOINT" letterSpacing="0.1rem" font={{ size: '0.675rem' }} />
            <i-hstack gap={1} verticalAlignment="center" class={`${borderRadiusLeft} ${borderRadiusRight}`}>
              {breakpoints.map(v => <i-icon
                name={v.icon}
                width={'1.5rem'}
                height={'1.5rem'}
                tooltip={{ content: v.caption }}
                class={`${customIconTabStyled} ${v.classes || ''} ${v.isActive ? customIconTabActiveStyled : ''}`}
                padding={{ top: 6, bottom: 6, left: 6, right: 6 }}
              />)}
            </i-hstack>
          </i-vstack>
          <i-vstack gap={'0.5rem'}>
            <i-label caption="PREVIEW" letterSpacing="0.1rem" font={{ size: '0.675rem' }} />
            <i-hstack gap={1} verticalAlignment="center" background={{ color: Theme.action.hoverBackground }} class={`${borderRadiusLeft} ${borderRadiusRight}`}>
              {previews.map(v => v.icon ? <i-icon
                name={v.icon}
                width={'1.5rem'}
                height={'1.5rem'}
                tooltip={{ content: v.caption }}
                class={`${customIconTabStyled} ${v.classes || ''} ${v.isActive ? customIconTabActiveStyled : ''}`}
                padding={{ top: 6, bottom: 6, left: 6, right: 6 }}
              /> : (v.url ? <i-image
                url={v.url}
                width={'1.5rem'}
                height={'1.5rem'}
                display="flex"
                tooltip={{ content: v.caption }}
                class={`${customIconTabStyled} ${v.classes || ''} ${v.isActive ? customIconTabActiveStyled : ''}`}
                padding={{ top: 6, bottom: 6, left: 6, right: 6 }}
              /> : [])
              )}
            </i-hstack>
          </i-vstack>
          <i-vstack gap={'0.5rem'}>
            <i-hstack gap={4} verticalAlignment="center">
              <i-label caption="ENV" letterSpacing="0.1rem" font={{ size: '0.675rem' }} />
              <i-icon name="exclamation-circle" width={12} height={12} tooltip={{ content: 'You can configure some values in your app to change based on which environment the app is running in. If unspecified, Development (Dev) values will be used.' }} />
            </i-hstack>
            <i-label
              caption="Dev"
              font={{ size: '0.675rem' }}
              width="5rem"
              background={{ color: Theme.action.hoverBackground }}
              class={`${borderRadiusLeft} ${borderRadiusRight}`}
              padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }}
            />
          </i-vstack>
        </i-hstack>
        <i-hstack
          id="hStackInfo"
          width="100%"
          verticalAlignment="center"
          padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
          background={{ color: '#26324b' }}
          stack={{shrink: '0'}}
        />
        <i-tabs
          mode="horizontal"
          activeTabIndex={0}
          class={customTabStyled}
          stack={{grow: '1'}} overflow={'hidden'}
        >
          <i-tab icon={{ name: 'paint-brush', width: '1.5rem', height: '1.5rem' }}>
            <i-vstack gap={1} width="100%">
              <designer-tool-stylesheet id="designerStylesheet" display="block" onChanged={this.onPropChanged} />
              <designer-tool-layout id='designerLayout' display="block" onChanged={this.onPropChanged} />
              <designer-tool-background id="designerBackground" display="block" onChanged={this.onPropChanged} />
              <designer-tool-size id="designerSize" display="block" onChanged={this.onPropChanged} />
              <designer-tool-margins-padding id="designerSpacing" display="block" onChanged={this.onPropChanged} />
              <designer-tool-position id="designerPosition" display="block" onChanged={this.onPropChanged} />
              <designer-tool-borders id="designerBorders" display="block" onChanged={this.onPropChanged} />
              <designer-tool-effects id="designerEffects" display="block" onChanged={this.onPropChanged} />
              <designer-tool-content id="designerContent" visible={false} display="block" onChanged={this.onPropChanged} />
            </i-vstack>
          </i-tab>
          <i-tab icon={{ name: 'sliders-h', width: '1.5rem', height: '1.5rem' }}>
            <i-vstack gap={1} width="100%">
              <designer-settings-basic display="block" />
              <designer-settings-advanced display="block" />
            </i-vstack>
          </i-tab>
          <i-tab icon={{ name: 'database', width: '1.5rem', height: '1.5rem' }}>
            <i-vstack gap={1} width="100%">
              <designer-data-params display="block" />
              <designer-data-linking display="block" />
            </i-vstack>
          </i-tab>
          <i-tab icon={{ name: 'magic', width: '1.5rem', height: '1.5rem' }}>
            <i-vstack gap={1} width="100%">
              <designer-trigger display="block" />
            </i-vstack>
          </i-tab>
        </i-tabs>
      </i-vstack>
    )
  }
}
