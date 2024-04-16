import { IconName, Styles } from "@ijstech/components";
import assets from "../assets";
import { IMediaQuery } from "../interface";
import { getBreakpoint } from "./store";
const Theme = Styles.Theme.ThemeVars;

const enum BREAKPOINTS {
  MOBILE,
  TABLET,
  LAPTOP,
  DESKTOP,
  BIG_SCREEN
}
const iconProps = {width: '1.5rem', height: '1.5rem', padding: {top: 6, left: 6, right: 6, bottom: 6}}
const breakpoints = [
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

const getBreakpointInfo = (index: number) => {
  const breakpoint = breakpoints[index];
  if (!breakpoint) return {};
  return {
    icon: breakpoint.icon.name as IconName,
    name: breakpoint.tooltip,
  }
}

const breakpointsMap: {[key: number]: IMediaQuery} = {
  [BREAKPOINTS.MOBILE]: {
    minWidth: '320px',
    maxWidth: '767px',
    properties: {}
  },
  [BREAKPOINTS.TABLET]: {
    minWidth: '768px',
    maxWidth: '1023px',
    properties: {}
  },
  [BREAKPOINTS.LAPTOP]: {
    minWidth: '1024px',
    maxWidth: '1439px',
    properties: {}
  },
  [BREAKPOINTS.DESKTOP]: {
    minWidth: '1440px',
    maxWidth: '1919px',
    properties: {}
  },
  [BREAKPOINTS.BIG_SCREEN]: {
    minWidth: '1920px',
    properties: {}
  }
}

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

const getMediaQueries = () => {
  return Object.values(breakpointsMap);
}

const getDefaultMediaQuery = (breakpoint: number) => {
  const clonedBreakpointsMap = JSON.parse(JSON.stringify(breakpointsMap));
  return clonedBreakpointsMap[breakpoint] || {};
}

const getMediaQuery = (mediaQueries: any) => {
  const breakpoint = getBreakpoint();
  const mediaQuery = getDefaultMediaQuery(breakpoint);
  const findedItem = (mediaQueries || []).find((v) => v && v.minWidth === mediaQuery.minWidth);
  return findedItem || mediaQuery;
}

const getMediaQueryProps = (mediaQueries: any) => {
  return getMediaQuery(mediaQueries)?.properties || {};
}

const getFont = (value: boolean) => ({ size: '0.75rem', color: value ? Theme.text.primary : Theme.colors.success.main });

const GroupMetadata = {
  'Layout': {
    name: 'Layout',
    tooltipText: 'The layout of your screen'
  },
  'Basic': {
    name: 'Basic',
    tooltipText: 'The most simple & essential components to build a screen'
  },
  'Fields': {
    name: 'Fields',
    tooltipText: 'The content of your screen'
  }
}

export {
  BREAKPOINTS,
  breakpoints,
  previews,
  breakpointsMap,
  getMediaQueries,
  getDefaultMediaQuery,
  GroupMetadata,
  getBreakpointInfo,
  getMediaQueryProps,
  getMediaQuery,
  getFont
}
