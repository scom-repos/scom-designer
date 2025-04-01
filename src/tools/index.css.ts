import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const customIconBorderStyled = Styles.style({
  cursor: 'pointer',
  background: Theme.action.hoverBackground,
  border: `1px solid ${Theme.divider}`,
  borderRadius: 4,
  padding: 6,
  opacity: 0.8,
  $nest: {
    '&:hover': {
      background: Theme.action.selectedBackground,
      opacity: 1
    }
  }
})

export const customIconLayoutStyled = Styles.style({
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

export const customIconLayoutActiveStyled = Styles.style({
  cursor: 'default',
  background: Theme.action.selectedBackground
})

export const borderRadiusLeft = Styles.style({
  borderTopLeftRadius: 8,
  borderBottomLeftRadius: 8
})

export const borderRadiusRight = Styles.style({
  borderTopRightRadius: 8,
  borderBottomRightRadius: 8
})

export const textInputRight = Styles.style({
  $nest: {
    'input': {
      textAlign: 'right'
    }
  }
})

export const bgInputTransparent = Styles.style({
  background: 'transparent',
  $nest: {
    'input': {
      background: 'transparent'
    }
  }
})

export const customColorStyled = Styles.style({
  $nest: {
    '.input-span': {
      minWidth: 24,
      height: 24,
      borderRadius: 4
    }
  }
})

export const unitStyled = Styles.style({
  $nest: {
    '&:hover': {
      background: Theme.action.hoverBackground
    }
  }
})

export const buttonAutoStyled = Styles.style({
  minWidth: 40,
  padding: '0 0.25rem',
  height: 28,
  opacity: 0.8,
  background: 'transparent',
  border: `1px solid ${Theme.action.selectedBackground}`
})

export const customFormStyle = Styles.style({
  $nest: {
    '&#form': {
      $nest: {
        'i-input': {
          height: '24px !important',
          borderRadius: '0.5rem !important'
        },
        'i-combo-box': {
          height: '24px !important',
          borderRadius: '0.5rem !important'
        },
        'i-combo-box .selection': {
          padding: '0 1rem'
        },
        '.tabs-nav-wrap i-tab': {
          padding: '0 1rem !important',
          margin: '0px !important'
        }
      }
    }
  }
})

export const customSwitchStyle = Styles.style({
  $nest: {
    '> .wrapper': {
      width: '2.25rem',
      height: '1.25rem',
      $nest: {
        '.thumb': {
          width: '0.875rem',
          height: '0.875rem'
        },
        '.switch-base.checked': {
          transform: 'translateX(85%)'
        }
      }
    }
  }
})

export const customModalStyle = Styles.style({
  $nest: {
    '.i-modal_body': {
      width: '100%',
      height: '100%'
    }
  }
})