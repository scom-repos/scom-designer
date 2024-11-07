import { Styles } from "@ijstech/components";

const Theme = Styles.Theme.ThemeVars;

Styles.cssRule(".i-resizer", {
  position: "absolute",
  width: "6px",
  height: "6px",
  background: "#EEE",
  border: "0.9px solid #333",
  zIndex: 1000,
  $nest: {
    "&.tl": {
      cursor: "nw-resize",
      top: "0px",
      left: "0px",
    },
    "&.tm": {
      cursor: "n-resize",
      top: "0px",
      left: "50%",
      marginLeft: "-4px",
    },
    "&.tr": {
      cursor: "ne-resize",
      top: "0px",
      right: "0px",
    },
    "&.ml": {
      top: "50%",
      marginTop: "-4px",
      left: "0px",
      cursor: "w-resize",
    },
    "&.mr": {
      top: "50%",
      marginTop: "-4px",
      right: "0px",
      cursor: "e-resize",
    },

    "&.bl": {
      bottom: "0px",
      left: "0px",
      cursor: "sw-resize",
    },
    "&.bm": {
      bottom: "0px",
      left: "50%",
      marginLeft: "-4px",
      cursor: "s-resize",
    },
    "&.br": {
      bottom: "0px",
      right: "0px",
      cursor: "se-resize",
    },
  },
});

Styles.cssRule("body > .item-list", {
  fontFamily: Styles.Theme.ThemeVars.typography.fontFamily,
  fontSize: Styles.Theme.ThemeVars.typography.fontSize,
  color: Theme.text.primary,
  backgroundColor: Theme.background.modal,
  border: `1px solid ${Theme.divider}`,

  $nest: {
    ul: {
      $nest: {
        "& > li.matched, & > li:hover": {
          color: Theme.action.hover,
          backgroundColor: Theme.action.hoverBackground,
        },
      },
    },
  },
});


