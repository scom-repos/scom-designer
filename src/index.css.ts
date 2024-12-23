import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const hoverFullOpacity = Styles.style({
  $nest: {
    '&:hover': {
      opacity: '1 !important',
      $nest: {
        'i-icon': {
          opacity: '1 !important'
        }
      }
    }
  }
})

export const rowItemHoverStyled = Styles.style({
  $nest: {
    '&:hover': {
      background: Theme.action.hoverBackground,
    }
  }
})

export const rowItemActiveStyled = Styles.style({
  background: Theme.action.selectedBackground,
  opacity: 1,
  $nest: {
    '&:hover': {
      background: Theme.action.selectedBackground,
      cursor: 'default',
      $nest: {
        'i-label': {
          opacity: 1
        }
      }
    }
  }
})

export const rowDragOverActiveStyled = Styles.style({
  background: Theme.action.activeBackground,
  opacity: 1
})

export const iconButtonStyled = Styles.style({
  fontSize: '0.75rem',
  justifyContent: 'start',
  padding: '4px 8px'
})

export const blockItemHoverStyled = Styles.style({
  $nest: {
    '&:hover': {
      background: Theme.action.hoverBackground
    }
  }
})

export const customLabelTabStyled = Styles.style({
  fontSize: '0.75rem',
  cursor: 'pointer',
  paddingBlock: '4px',
  textAlign: 'center',
  opacity: 0.8,
  $nest: {
    '&:hover': {
      background: Theme.background.main,
      opacity: 1
    }
  }
})

export const labelActiveStyled = Styles.style({
  background: Theme.action.selectedBackground,
  opacity: 1,
  cursor: 'default !important',
  $nest: {
    '&:hover': {
      background: Theme.action.selectedBackground
    }
  }
})

export const customIconTabStyled = Styles.style({
  cursor: 'pointer',
  background: Theme.action.hoverBackground,
  opacity: 0.8,
  $nest: {
    '&:hover': {
      background: Theme.action.selectedBackground,
      opacity: 1
    }
  }
})

export const customIconTabActiveStyled = Styles.style({
  background: Theme.action.selectedBackground,
  $nest: {
    '&:hover': {
      background: Theme.action.selectedBackground,
      cursor: 'default'
    }
  }
})

export const customTabStyled = Styles.style({
  flexDirection: 'column',
  $nest: {
    '.tabs-nav': {
      width: '100%'
    },
    '.tabs-nav .tab-item': {
      width: '100%'
    },
    '.tabs-nav .tab-item > i-icon': {
      margin: 'auto'
    },
    '.tabs-nav-wrap i-tab': {
      background: Theme.colors.secondary.main,
      border: `1px solid ${Theme.divider}`,
      width: '25%'
    },
    '.tabs-nav-wrap i-tab:not(.disabled).active': {
      background: Theme.colors.primary.main
    },
    '.tabs-nav-wrap i-tab.disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    '.tabs-content': {
      maxHeight: 'calc(100% - 40px)',
      overflow: 'auto'
    },
    "> .tabs-nav-wrap .tabs-nav": {
      borderBottom: `1px solid ${Theme.divider}`
    }
  }
})

export const blockStyle = Styles.style({
  display: 'block',
  width: '100%',
  height: '100%'
})

export const customTransition = Styles.style({
  transition: 'width 0.2s ease-in-out'
})

export const customScrollbar = Styles.style({
  $nest: {
    '&::-webkit-scrollbar': {
      width: '0.5rem',
      height: '0.5rem'
    }
  }
})

export const toggleClass = Styles.style({
  filter: 'contrast(0.5)',
})

export const customActivedStyled = Styles.style({
  background: `${Theme.colors.secondary.main}!important`
})

export const customModalStyled = Styles.style({
  $nest: {
    '.i-modal_body': {
      height: '100%'
    }
  }
})