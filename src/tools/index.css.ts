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
  width: 40,
  height: 28,
  opacity: 0.8,
  background: 'transparent',
  border: `1px solid ${Theme.action.selectedBackground}`
})