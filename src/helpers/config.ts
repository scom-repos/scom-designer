import { IconName, Styles } from "@ijstech/components";
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
    tooltip: '$mobile',
    type: 'breakpoint',
    icon: {name: 'mobile-alt', ...iconProps},
    value: BREAKPOINTS.MOBILE
  },
  {
    tooltip: '$tablet',
    type: 'breakpoint',
    icon: {name: 'tablet-alt', ...iconProps},
    value: BREAKPOINTS.TABLET
  },
  // {
  //   tooltip: 'Laptop',
  //   type: 'breakpoint',
  //   icon: {name: 'laptop', ...iconProps},
  //   value: BREAKPOINTS.LAPTOP
  // },
  {
    tooltip: '$desktop',
    type: 'breakpoint',
    icon: {name: 'desktop', ...iconProps},
    value: BREAKPOINTS.DESKTOP
  },
  // {
  //   tooltip: 'Big Screen',
  //   type: 'breakpoint',
  //   icon: {name: 'tv', ...iconProps},
  //   value: BREAKPOINTS.BIG_SCREEN
  // }
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
    maxWidth: '1024px',
    properties: {}
  },
  // [BREAKPOINTS.LAPTOP]: {
  //   minWidth: '1024px',
  //   maxWidth: '1439px',
  //   properties: {}
  // },
  [BREAKPOINTS.DESKTOP]: {
    minWidth: '1025px',
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
    tooltip: '$draft_view',
    icon: {name: 'edit', ...iconProps},
    type: 'preview',
    value: PREVIEWS.DRAFT
  },
  {
    tooltip: '$web_preview',
    icon: {name: 'globe', ...iconProps},
    type: 'preview',
    value: PREVIEWS.WEB
  },
  // {
  //   tooltip: 'iOS Preview',
  //   icon: {
  //     image: {
  //       url: assets.fullPath('img/designer/IOS.svg'),
  //       ...iconProps
  //     }
  //   },
  //   type: 'preview',
  //   value: PREVIEWS.IOS
  // },
  // {
  //   tooltip: 'Android Preview',
  //   icon: {
  //     image: {
  //       url: assets.fullPath('img/designer/Android.svg'),
  //       ...iconProps
  //     }
  //   },
  //   type: 'preview',
  //   value: PREVIEWS.ANDROID,
  // }
]

const getMediaQueries = () => {
  return Object.values(breakpointsMap);
}

const getDefaultMediaQuery = (breakpoint: number) => {
  const clonedBreakpointsMap = JSON.parse(JSON.stringify(breakpointsMap));
  return clonedBreakpointsMap[breakpoint] || {};
}

const findMediaQueryCallback = (v: any, mediaQuery: any) => {
  return v && v.minWidth === mediaQuery.minWidth || (v.maxWidth && v.maxWidth === mediaQuery.maxWidth);
}

const getMediaQuery = (mediaQueries: any) => {
  const breakpoint = getBreakpoint();
  const mediaQuery = getDefaultMediaQuery(breakpoint);
  if (Array.isArray(mediaQueries)) {
    const findedItem = (mediaQueries || []).find((v) => findMediaQueryCallback(v, mediaQuery));
    return findedItem || mediaQuery;
  } else {
    return mediaQuery;
  }
}

const getMediaQueryProps = (mediaQueries: any) => {
  return getMediaQuery(mediaQueries)?.properties || {};
}

const getFont = (value: boolean) => ({ size: '0.75rem', color: value ? Theme.text.primary : Theme.colors.success.main });

const GroupMetadata = {
  'Layout': {
    name: '$layout',
    tooltipText: '$the_layout_of_your_screen'
  },
  'Basic': {
    name: '$basic',
    tooltipText: '$the_most_simple__and_essential_components_to_build_a_screen'
  },
  'Fields': {
    name: '$fields',
    tooltipText: 'The content of your screen'
  }
}

const ITEMS = ['i-accordion-item', 'i-tab', 'i-menu-item', 'i-radio'];

const ITEM_PARENTS = [
  'i-accordion',
  'i-tabs',
  'i-menu',
  'i-menu-item',
  'i-radio-group'
];

const CONTAINERS = [
  ...ITEM_PARENTS,
  'i-tree-node',
  'i-tree-view',
  'i-stack',
  'i-panel',
  'i-grid-layout',
  'i-card-layout',
  'i-tab',
  'i-carousel-slider',
  'i-repeater',
  'i-accordion-item',
  'i-hstack',
  'i-vstack',
  'i-modal',
  'i-radio'
];

const ControlItemMapper: {[key: string]: string} = {
  'i-accordion': 'i-accordion-item',
  'i-tabs': 'i-tab',
  'i-menu': 'i-menu-item',
  'i-menu-item': 'i-menu-item',
  'i-tree-view': 'i-tree-node',
  'i-tree-node': 'i-tree-node',
  'i-radio-group': 'i-radio'
}

const themesConfig = {
  dark: {
    backgroundColor: '#26324b',
    fontColor: '#fff',
    wrapperBgColor: '#202020',
    actionBgColor: '#252525',
    actionFontColor: '#fff',
    secondaryColor: '#1d1d1d',
    inputBgColor: '#222222',
    inputFontColor: '#fff',
    paperBgColor: '#000',
    divider: '#374151',
    "selected": "rgb(101 161 180)",
    "selectedBackground": "rgb(63 137 161/.5)"
  },
  light: {
    backgroundColor: '#f5f5f5',
    fontColor: '#000000de',
    wrapperBgColor: '#fff',
    actionBgColor: 'rgba(255, 255, 255, 1.00)',
    actionFontColor: 'rgba(136, 153, 168, 1.00)',
    secondaryColor: 'rgba(245,247,249,1.00)',
    divider: "#d3dce4",
    "selected": "rgb(101 161 180)",
    "selectedBackground": "rgb(63 137 161/.12)"
  }
}

const pageWidgets = [
  '@scom/scom-yaml',
  '@scom/scom-image',
  '@scom/scom-image-gallery',
  '@scom/page-button',
  '@scom/page-text',
  '@scom/page-text-list',
  '@scom/page-block',
  '@scom/page-form',
  '@scom/page-breadcrumb',
  '@scom/page-blog',
  '@scom/page-blog-list',
  '@scom/scom-carousel'
];

const pageWidgetNames = ['i-scom-carousel', 'i-page-form', 'i-scom-image-gallery'];

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
  getFont,
  CONTAINERS,
  ITEM_PARENTS,
  ITEMS,
  ControlItemMapper,
  themesConfig,
  findMediaQueryCallback,
  pageWidgets,
  pageWidgetNames
}
