import assets from "../assets";
import { getBreakpoint } from "./store";
import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const backgroundOptions = [
  {
    value: 'primary',
    label: 'Primary'
  },
  {
    value: 'secondary',
    label: 'Secondary'
  },
  {
    value: 'background',
    label: 'Background'
  }
]

export function getAlignProps(type: string) {
  const alignProps: any = [
    {
      tooltip: 'Flex Start',
      value: 'start',
      type,
      icon: {
        image: {
          url: assets.fullPath('img/designer/layout/align-start.svg')
        }
      }
    },
    {
      tooltip: 'Center',
      value: 'center',
      type,
      icon: {
        image: {
          url: assets.fullPath('img/designer/layout/align-center.svg')
        }
      }
    },
    {
      tooltip: 'Flex End',
      value: 'end',
      type,
      icon: {
        image: {
          url: assets.fullPath('img/designer/layout/align-start.svg')
        }
      },
      rotate: 180
    },
    {
      tooltip: 'Stretch',
      value: 'stretch',
      type,
      icon: {
        image: {
          url: assets.fullPath('img/designer/layout/align-stretch.svg')
        }
      }
    },
    {
      tooltip: 'Baseline',
      value: 'baseline',
      type,
      icon: {
        image: {
          url: assets.fullPath('img/designer/layout/align-base-line.svg')
        }
      }
    }
  ]
  if (type === 'alignSelf') {
    alignProps.unshift({
      tooltip: 'Auto',
      value: 'auto',
      type: 'alignSelf',
      icon: { name: 'times' }
    })
  }
  return alignProps;
}

export const justifyProps = [
  {
    tooltip: 'Flex Start',
    value: 'start',
    type: 'justifyContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/justify-start.svg')
      }
    }
  },
  {
    tooltip: 'Center',
    value: 'center',
    type: 'justifyContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/justify-center.svg')
      }
    },
  },
  {
    tooltip: 'Flex End',
    value: 'end',
    type: 'justifyContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/justify-start.svg')
      }
    },
    rotate: 180
  },
  {
    tooltip: 'Space Between',
    value: 'space-between',
    type: 'justifyContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/justify-between.svg')
      }
    },
  },
  {
    tooltip: 'Space Around',
    value: 'space-around',
    type: 'justifyContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/justify-around.svg')
      }
    },
  },
  {
    tooltip: 'Space Evenly',
    placement: 'left',
    value: 'space-evenly',
    type: 'justifyContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/justify-evenly.svg')
      }
    }
  }
]

export const alignContentProps = [
  {
    tooltip: 'Flex Start',
    value: 'start',
    type: 'alignContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/align-start.svg')
      }
    }
  },
  {
    tooltip: 'Center',
    value: 'center',
    type: 'alignContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/align-center.svg')
      }
    },
  },
  {
    tooltip: 'Flex End',
    value: 'end',
    type: 'alignContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/align-start.svg')
      }
    },
    rotate: 180
  },
  {
    tooltip: 'Space Between',
    value: 'space-between',
    type: 'alignContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/justify-between.svg')
      }
    },
    rotate: 90
  },
  {
    tooltip: 'Space Around',
    value: 'space-around',
    type: 'alignContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/justify-around.svg')
      }
    },
    rotate: 90
  },
  {
    tooltip: 'Stretch',
    value: 'stretch',
    type: 'alignContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/align-stretch.svg')
      }
    }
  }
]

export const borderStyles = [
  {
    tooltip: 'Solid',
    value: 'solid',
    type: 'style',
    icon: {
      image: {
        url: assets.fullPath('img/designer/border/solid.svg')
      }
    }
  },
  {
    tooltip: 'Dotted',
    value: 'dotted',
    type: 'style',
    icon: {
      image: {
        url: assets.fullPath('img/designer/border/dotted.svg')
      }
    }
  },
  {
    tooltip: 'Dashed',
    value: 'dashed',
    type: 'style',
    icon: {
      image: {
        url: assets.fullPath('img/designer/border/dashed.svg')
      }
    }
  },
]

export const fontStyles = [
  {
    tooltip: 'Normal',
    value: 'normal',
    type: 'style',
    icon: {
      name: 'remove-format'
    }
  },
  {
    tooltip: 'Italic',
    value: 'italic',
    type: 'style',
    icon: {
      name: 'italic'
    }
  }
]

export const fontTransforms = [
  {
    tooltip: 'None',
    value: 'none',
    type: 'style',
    icon: {
      name: 'remove-format'
    }
  },
  {
    tooltip: 'Capitalize',
    value: 'capitalize',
    type: 'transform',
    icon: {
      image: {
        url: assets.fullPath('img/designer/font/capitalize.svg')
      }
    }
  },
  {
    tooltip: 'Lowercase',
    value: 'lowercase',
    type: 'transform',
    icon: {
      image: {
        url: assets.fullPath('img/designer/font/lowercase.svg')
      }
    }
  },
  {
    tooltip: 'Uppercase',
    value: 'uppercase',
    type: 'transform',
    icon: {
      image: {
        url: assets.fullPath('img/designer/font/uppercase.svg')
      }
    }
  }
]

export const fontDecorations = [
  {
    tooltip: 'None',
    value: 'none',
    type: 'textDecoration',
    icon: {
      name: 'remove-format'
    }
  },
  {
    tooltip: 'Underline',
    value: 'underline',
    type: 'textDecoration',
    icon: {
      name: 'underline'
    }
  },
  {
    tooltip: 'Line Through',
    value: 'line-through',
    type: 'textDecoration',
    icon: {
      name: 'strikethrough'
    }
  },
  {
    tooltip: 'Overline',
    value: 'overline',
    type: 'textDecoration',
    icon: {
      name: 'underline'
    }
  }
]

export const getFileContent = async (url: string) => {
  let result = '';
  if (url) {
    const response = await fetch(url);
    try {
      if (response.ok) {
        result = await response.text();
      }
    } catch (err) { }
  }
  return result;
}

export const extractFileName = (path: string): string => {
  let items = path.split("/");
  return items[items.length - 1];
}

export const parseProps = (props: any) => {
  if (!props) return null;
  const breakpoint = getBreakpoint();
  let newProps = {...(props || {})};
  if (breakpoint !== undefined) {
    newProps.mediaQueries = newProps.mediaQueries || [];
    const mediaQueries = newProps.mediaQueries;
    if (typeof mediaQueries === 'string') {
      let value = mediaQueries;
      if (mediaQueries.startsWith('{') && mediaQueries.endsWith('}')) {
        value = mediaQueries.substring(1, mediaQueries.length - 1);
      }
      try {
        newProps.mediaQueries = JSON.parse(value);
      } catch {}
    };
  }
  const newObj = {};
  for (let key in newProps) {
    const value = newProps[key];
    newObj[key] = typeof value === "string" ? parsePropValue(newProps[key]) : value;
  }
  return newObj;
}

export const parsePropValue = (value: any) => {
  if (typeof value !== "string") return value;
  if (value.startsWith('{') && value.endsWith('}')) {
    value = value.substring(1, value.length - 1);
    if (value.startsWith('{') && value.endsWith('}')) {
      try {
        return JSON.parse(value);
      } catch {
        return handleParse(value);
      }
    } else if (value.startsWith('[') && value.endsWith(']')) {
      try {
        return JSON.parse(value);
      } catch {
        return handleParse(value);
      }
    } else {
      if (value === 'true' || value === 'false') {
        value = value === 'true' ? true : false;
      } else if (!Number.isNaN(+value)) {
        value = +value;
      } else if (value === 'null') {
        value = null;
      } else if (value === 'undefined') {
        value = undefined;
      } else if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
    }
  }
  else if (value.startsWith('"') && value.endsWith('"')) {
    value = value.substring(1, value.length - 1);
  }
  else if (value.startsWith("'") && value.endsWith("'")) {
    value = value.substring(1, value.length - 1);
  }
  return value;
};

export const handleParse = (value: string) => {
  try {
    const newValue =
      value
        .replace(/(['"])?(?!HH:|mm:)\b([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
        .replace(/'/g, '"')
        .replace(/(Theme\.[a-z0-9A-Z\.\[\]_]+)/, '"$1"');

    const parsedData = JSON.parse(newValue, (key, value) => {
      if (typeof value === 'string' && value.startsWith('Theme')) {
        const parsedValue = value.split('.');
        let themeValue = Theme;
        for(let i = 1; i < parsedValue.length; i++) {
          themeValue = themeValue[parsedValue[i]]
        }
        return themeValue;
      }
    return value;
  });

  return parsedData;
  } catch {
    return value;
  }
}

export const parseNumberValue = (value: string | number) => {
  let result = {
    value: undefined,
    unit: 'px'
  }
  if (typeof value === 'number') {
    result.value = Number.isInteger(value) ? value : value.toFixed(2)
  } else if (value === 'auto' || !value) {
    result.value = ''
  } else {
    const unit = value.replace(/^-?\d+(\.\d+)?/g, '');
    const numVal = +(value.replace(unit, ''));
    result.value = Number.isInteger(numVal) ? numVal : numVal.toFixed(2)
    result.unit = unit || 'px';
  }
  return result;
};

export const isSameValue = (defaultVal: any, value: any): boolean => {
  const deepEqual = (a: any, b: any): boolean => {
    if (Object.is(a, b)) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
      return false;
    }
    for (const key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  };

  if (Object.is(defaultVal, value)) return true;
  if (typeof defaultVal === 'object' && typeof value === 'object') {
    return deepEqual(defaultVal, value);
  }

  return false;
};

export const isNumber = (value: string|number) => {
  return typeof value === 'number' || (value !== '' && !Number.isNaN(Number(value)));
}
