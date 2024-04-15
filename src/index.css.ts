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
  background: Theme.colors.info.dark,
  opacity: 1,
  $nest: {
    '&:hover': {
      background: Theme.colors.info.dark,
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
  background: Theme.colors.info.light,
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
      background: Theme.colors.info.dark
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
      background: '#26324b',
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
  background: Theme.colors.info.dark,
  $nest: {
    '&:hover': {
      background: Theme.colors.info.dark,
      cursor: 'default'
    }
  }
})

export const customTabStyled = Styles.style({
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
      background: Theme.background.main,
      width: '25%'
    },
    '.tabs-nav-wrap i-tab:not(.disabled).active': {
      background: '#26324b'
    },
    '.tabs-nav-wrap i-tab.disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    '.tabs-content': {
      maxHeight: 'calc(100% - 40px)',
      overflow: 'auto'
    },
  }
})


export const codeTabsStyle = Styles.style({
  $nest: {
      "> .tabs-nav-wrap": {
          background: "#181818",
      },
  },
});

export const blockStyle = Styles.style({
  display: 'block',
  width: '100%',
  height: '100%'
})

export const customTransition = Styles.style({
  transition: 'width 0.2s ease-in-out'
})
