import {
  Module,
  Styles,
  ControlElement,
  customElements,
  IconName,
  HStack
} from '@ijstech/components'
import assets from '../assets';
import { customIconTabActiveStyled, customIconTabStyled, customTabStyled } from '../index.css';
import { IComponentItem } from '../interface';
import { borderRadiusLeft, borderRadiusRight } from '../tools/index';
import '../settings/index';
import '../triggers/index';
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

interface DesignerPropertiesElement extends ControlElement {

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

  private _component: IComponentItem;

  get component() {
    return this._component;
  }

  set component(value: IComponentItem) {
    this._component = value;
    this.updateInfo();
  }

  private updateInfo() {
    if (!this.component || !this.hStackInfo) return;
    const { caption, image, iconName, category } = this.component;
    this.hStackInfo.clearInnerHTML();
    this.hStackInfo.appendChild(
      <i-hstack gap={8} verticalAlignment="center" width="100%">
        {iconName ? <i-icon name={iconName} width={24} height={24} /> : <i-image url={image} width={24} height={24} />}
        <i-label caption={caption} font={{ size: '1rem', bold: true }} />
        <i-label caption={category || ''} opacity={0.6} font={{ size: '0.625rem' }} margin={{ left: 'auto' }} display="flex" />
      </i-hstack>
    )
  }


  init() {
    super.init();
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
              /> : <i-image
                url={v.url}
                width={'1.5rem'}
                height={'1.5rem'}
                display="flex"
                tooltip={{ content: v.caption }}
                class={`${customIconTabStyled} ${v.classes || ''} ${v.isActive ? customIconTabActiveStyled : ''}`}
                padding={{ top: 6, bottom: 6, left: 6, right: 6 }}
              />
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
              <designer-tool-stylesheet display="block" />
              <designer-tool-layout display="block" />
              <designer-tool-background display="block" />
              <designer-tool-size display="block" />
              <designer-tool-margins-padding display="block" />
              <designer-tool-position display="block" />
              <designer-tool-borders display="block" />
              <designer-tool-effects display="block" />
            </i-vstack>
          </i-tab>
          <i-tab icon={{ name: 'sliders-h', width: '1.5rem', height: '1.5rem' }}>
            <i-vstack gap={1} width="100%">
              <designer-settings-basic display="block" />
              <designer-settings-advanced display="block" />
            </i-vstack>
          </i-tab>
          <i-tab icon={{ name: 'database', width: '1.5rem', height: '1.5rem' }}>
            <i-label caption="Database" />
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
