import { IconName } from "@ijstech/components";
import assets from "../assets";

const captionElements = ['i-label', 'i-button', 'i-menu-item'];

const enum BREAKPOINTS {
  MOBILE,
  TABLET,
  LAPTOP,
  DESKTOP,
  BIG_SCREEN
}
const iconProps = {width: '1.5rem', height: '1.5rem', padding: {top: 6, left: 6, right: 6, bottom: 6}}
const breakpoints= [
  {
    tooltip: 'Mobile',
    type: 'breakpoint',
    icon: {name: 'mobile-alt', ...iconProps},
    value: BREAKPOINTS.MOBILE
  },
  {
    tooltip: 'Tablet',
    type: 'breakpoint',
    icon: {name: 'tablet-alt', ...iconProps},
    value: BREAKPOINTS.TABLET
  },
  {
    tooltip: 'Laptop',
    type: 'breakpoint',
    icon: {name: 'laptop', ...iconProps},
    value: BREAKPOINTS.LAPTOP
  },
  {
    tooltip: 'Desktop',
    type: 'breakpoint',
    icon: {name: 'desktop', ...iconProps},
    value: BREAKPOINTS.DESKTOP
  },
  {
    tooltip: 'Big Screen',
    type: 'breakpoint',
    icon: {name: 'tv', ...iconProps},
    value: BREAKPOINTS.BIG_SCREEN
  }
]

const enum PREVIEWS {
  DRAFT,
  WEB,
  IOS,
  ANDROID
}

const previews = [
  {
    tooltip: 'Draft View',
    icon: {name: 'edit', ...iconProps},
    type: 'preview',
    value: PREVIEWS.DRAFT
  },
  {
    tooltip: 'Web Preview',
    icon: {name: 'globe', ...iconProps},
    type: 'preview',
    value: PREVIEWS.WEB
  },
  {
    tooltip: 'iOS Preview',
    icon: {
      image: {
        url: assets.fullPath('img/designer/IOS.svg'),
        ...iconProps
      }
    },
    type: 'preview',
    value: PREVIEWS.IOS
  },
  {
    tooltip: 'Android Preview',
    icon: {
      image: {
        url: assets.fullPath('img/designer/Android.svg'),
        ...iconProps
      }
    },
    type: 'preview',
    value: PREVIEWS.ANDROID,
  }
]

export {
  BREAKPOINTS,
  breakpoints,
  previews
}
