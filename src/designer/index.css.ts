import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const hoverStyle = Styles.style({
    $nest: {
      "&:before": {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        backgroundColor: Theme.colors.info.light,
        border: `1px dashed ${Theme.colors.info.dark}`
      }
    }
})

export const selectedStyle = Styles.style({
  border: `1px dashed ${Theme.colors.info.dark}`
});