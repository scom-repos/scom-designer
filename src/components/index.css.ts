import { Styles } from "@ijstech/components";

Styles.cssRule(".i-resizer", {
  position: "absolute",
  width: "8px",
  height: "8px",
  background: "#EEE",
  border: "0.9px solid #333",
  zIndex: 1000,
  $nest: {
    "&.tl": {
      cursor: "nw-resize",
      top: "-4px",
      left: "-4px",
    },
    "&.tm": {
      cursor: "n-resize",
      top: "-4px",
      left: "50%",
      marginLeft: "-4px",
    },
    "&.tr": {
      cursor: "ne-resize",
      top: "-4px",
      right: "-4px",
    },
    "&.ml": {
      top: "50%",
      marginTop: "-4px",
      left: "-4px",
      cursor: "w-resize",
    },
    "&.mr": {
      top: "50%",
      marginTop: "-4px",
      right: "-4px",
      cursor: "e-resize",
    },

    "&.bl": {
      bottom: "-4px",
      left: "-4px",
      cursor: "sw-resize",
    },
    "&.bm": {
      bottom: "-4px",
      left: "50%",
      marginLeft: "-4px",
      cursor: "s-resize",
    },
    "&.br": {
      bottom: "-4px",
      right: "-4px",
      cursor: "se-resize",
    },
  },
});

Styles.cssRule("body > .item-list", {
  fontFamily: Styles.Theme.ThemeVars.typography.fontFamily,
  fontSize: Styles.Theme.ThemeVars.typography.fontSize,
  color: "#ccc",
  backgroundColor: "#2a2a2a",
  border: "1px solid rgba(255, 255, 255, 0.12)",

  $nest: {
    ul: {
      overflow: "hidden",

      $nest: {
        "& > li.matched, & > li:hover": {
          color: "#fff",
          backgroundColor: "rgba(90, 93, 94, 0.31)",
        },
      },
    },
  },
});

export const componentStyle = Styles.style({
  cursor: "pointer",
  $nest: {
    "&.selected": {
      borderWidth: "2px",
      borderColor: Styles.Theme.ThemeVars.text.primary,
    },
    "i-label": {
      textOverflow: "ellipsis",
      textAlign: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
  },
});

Styles.cssRule(".btn-collapse", {
  marginRight: 5,
  cursor: "pointer",
});

export const iconTabsStyle = Styles.style({
  $nest: {
    "> .tabs-nav-wrap": {
      backgroundColor: "rgb(24, 24, 24)",
      borderRight: "1px solid rgba(255, 255, 255, 0.08)",

      $nest: {
        ".tabs-nav": {
          border: 0,
        },
        "i-tab": {
          height: 48,
          width: 48,
          border: 0,
          borderLeft: "2px solid transparent",
          background: "transparent",
          justifyContent: "center",
        },
        "i-tab:not(.disabled).active": {
          background: "transparent",
          borderLeftColor: "#0078d4",
        },
        "i-tab .tab-item": {
          gap: 0,
          padding: 0,
          paddingRight: 2,
        },
        "i-tab i-icon svg": {
          fill: "rgba(255, 255, 255, 0.5)",
        },
        "i-tab.active i-icon svg": {
          fill: "rgb(215, 215, 215)",
        },
        "i-tab:hover i-icon svg": {
          fill: "rgb(215, 215, 215)",
        },
      },
    },
    "> .tabs-content": {
      background: "#181818",
    },
  },
});

export const codeTabsStyle = Styles.style({
  $nest: {
    "> .tabs-nav-wrap": {
      background: "#181818",
    },
  },
});

export const navbarStyle = Styles.style({
  background: "#252525",
  $nest: {
    "i-button": {
      background: "transparent",
      boxShadow: "none",
    },
    "i-button:hover": {
      background: Styles.Theme.ThemeVars.action.hover,
    },
    "> i-input input": {
      background: "#363636",
      color: "#fff",
      paddingInline: 4,
    },
  },
});

export const titlebarStyle = Styles.style({
  backgroundColor: "#181818",
  color: "rgb(139, 148, 158)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",

  $nest: {
    "i-combo-box": {
      $nest: {
        ".selection": {
          padding: "0 2px",
        },
      },
    },

    "i-button": {
      display: "flex",
      alignItems: "center",
      padding: "0 8px",
      borderRadius: "5px",
      fontSize: "13px",
      lineHeight: "22px",
      color: "#8b949e",
      background: "transparent",
      marginLeft: "4px",

      $nest: {
        "&:hover": {
          color: "#ccc",
          background: "rgba(90, 93, 94, 0.31)",
        },
      },
    },
  },
});

export const modalStyle = Styles.style({
  $nest: {
    "& > div": {
      position: "fixed",
      left: "50%!important",
      paddingTop: "30px",
      transform: "translateX(-50%)",
    },

    ".modal": {
      backgroundColor: "#1f1f1f",
      color: "#ccc",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "6px",
      padding: "12px 10px 14px",
      boxShadow: "0 0 8px 2px rgba(0, 0, 0, 0.36)",

      $nest: {
        ".i-modal_header": {
          fontSize: "14px",
          paddingBottom: "6px",

          $nest: {
            span: { color: "#ccc" },
          },
        },

        ".connect-git-form": {
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: "4px",
          marginTop: "6px",
        },

        ".pull-form": {
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: "4px",
          marginTop: "12px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          paddingTop: "12px",
        },

        "i-input": {
          flex: 1,
          height: "unset!important",
          width: "unset!important",

          $nest: {
            "& > span": {
              display: "block",

              $nest: {
                "& > label": {
                  display: "block",
                  width: "unset!important",
                  textAlign: "left",
                  color: "rgb(204, 204, 204)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                },
              },
            },
            input: {
              minHeight: "28px",
              width: "100%!important",
              padding: "2px 6px",
              borderRadius: "2px",
              backgroundColor: "#2a2a2a",
              color: "#ccc",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            },
          },
        },

        "i-combo-box": {
          $nest: {
            ".selection": {
              background: "transparent",
              border: 0,
              padding: 0,

              $nest: {
                input: {
                  minHeight: "28px",
                  width: "100%!important",
                  padding: "2px 6px",
                  borderTopLeftRadius: "2px",
                  borderBottomLeftRadius: "2px",
                  backgroundColor: "#2a2a2a",
                  color: "#ccc",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                },
              },
            },

            ".icon-btn": {
              borderTopRightRadius: "2px",
              borderBottomRightRadius: "2px",
            },
          },
        },

        "i-button": {
          flex: 1,
          minHeight: "28px",
          color: "#fff",
          background: "rgb(0, 120, 212)",
          borderRadius: "2px",
        },

        ".form-error": {
          minHeight: "12px",
          paddingTop: "6px",
          fontSize: "12px",
          fontStyle: "italic",

          $nest: {
            "&.success span": {
              color: "rgb(0, 120, 212)",
            },

            span: {
              color: "#f14c4c",
            },
          },
        },
      },
    },
  },
});

export const sourceControlStyle = Styles.style({
  $nest: {
    ".source-control-heading": {
      fontSize: "11px",
      fontWeight: 400,
      color: "rgb(204, 204, 204)",
      lineHeight: "35px",
      paddingLeft: "12px",
    },
    ".source-control-rows": {
      lineHeight: "22px",
      paddingLeft: "12px",
      paddingRight: "12px",
      gap: "6px",

      $nest: {
        "i-input": {
          flex: 1,
          height: "unset!important",
          width: "unset!important",

          $nest: {
            input: {
              minHeight: "28px",
              width: "100%!important",
              padding: "2px 6px",
              borderRadius: "2px",
              backgroundColor: "#2a2a2a",
              color: "#ccc",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            },
          },
        },
      },
    },
    "i-button": {
      borderRadius: "2px",
      lineHeight: "18px",
      color: "#fff",
      backgroundColor: "#0078d4",
      padding: "4px",
      margin: "12px",
    },
  },
});

export const githubTabStyle = Styles.style({
  $nest: {
    ".heading": {
      fontSize: "11px",
      fontWeight: 400,
      color: "rgb(204, 204, 204)",
      lineHeight: "35px",
      paddingLeft: "12px",
    },

    '.content': {
      paddingLeft: "12px",
      paddingRight: "12px",

      $nest: {
        'i-label': {
          fontSize: '13px',
          color: 'rgb(204, 204, 204)'
        },

        "i-button": {
          fontSize: '13px',
          borderRadius: "2px",
          lineHeight: "18px",
          color: "#fff",
          backgroundColor: "#0078d4",
          padding: "4px",
          margin: "12px 0",
        },
      }
    }
  }
});
