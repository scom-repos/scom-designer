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
      tooltip: '$flex_start',
      value: 'start',
      type,
      icon: {
        image: {
          url: assets.fullPath('img/designer/layout/align-start.svg')
        }
      }
    },
    {
      tooltip: '$center',
      value: 'center',
      type,
      icon: {
        image: {
          url: assets.fullPath('img/designer/layout/align-center.svg')
        }
      }
    },
    {
      tooltip: '$flex_end',
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
      tooltip: '$stretch',
      value: 'stretch',
      type,
      icon: {
        image: {
          url: assets.fullPath('img/designer/layout/align-stretch.svg')
        }
      }
    },
    {
      tooltip: '$baseline',
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
      tooltip: '$auto',
      value: 'auto',
      type: 'alignSelf',
      icon: { name: 'times' }
    })
  }
  return alignProps;
}

export const justifyProps = [
  {
    tooltip: '$flex_start',
    value: 'start',
    type: 'justifyContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/justify-start.svg')
      }
    }
  },
  {
    tooltip: '$center',
    value: 'center',
    type: 'justifyContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/justify-center.svg')
      }
    },
  },
  {
    tooltip: '$flex_end',
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
    tooltip: '$space_between',
    value: 'space-between',
    type: 'justifyContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/justify-between.svg')
      }
    },
  },
  {
    tooltip: '$space_around',
    value: 'space-around',
    type: 'justifyContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/justify-around.svg')
      }
    },
  },
  {
    tooltip: '$space_evenly',
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
    tooltip: '$flex_start',
    value: 'start',
    type: 'alignContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/align-start.svg')
      }
    }
  },
  {
    tooltip: '$center',
    value: 'center',
    type: 'alignContent',
    icon: {
      image: {
        url: assets.fullPath('img/designer/layout/align-center.svg')
      }
    },
  },
  {
    tooltip: '$flex_end',
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
    tooltip: '$space_between',
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
    tooltip: '$space_around',
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
    tooltip: '$stretch',
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
    tooltip: '$solid',
    value: 'solid',
    type: 'style',
    icon: {
      image: {
        url: assets.fullPath('img/designer/border/solid.svg')
      }
    }
  },
  {
    tooltip: '$dotted',
    value: 'dotted',
    type: 'style',
    icon: {
      image: {
        url: assets.fullPath('img/designer/border/dotted.svg')
      }
    }
  },
  {
    tooltip: '$dashed',
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
    tooltip: '$normal',
    value: 'normal',
    type: 'style',
    icon: {
      name: 'remove-format'
    }
  },
  {
    tooltip: '$italic',
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
    value: 'unset',
    type: 'transform',
    icon: {
      name: 'remove-format'
    }
  },
  {
    tooltip: '$capitalize',
    value: 'capitalize',
    type: 'transform',
    icon: {
      image: {
        url: assets.fullPath('img/designer/font/capitalize.svg')
      }
    }
  },
  {
    tooltip: '$lowercase',
    value: 'lowercase',
    type: 'transform',
    icon: {
      image: {
        url: assets.fullPath('img/designer/font/lowercase.svg')
      }
    }
  },
  {
    tooltip: '$uppercase',
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
    tooltip: '$underline',
    value: 'underline',
    type: 'textDecoration',
    icon: {
      name: 'underline'
    }
  },
  {
    tooltip: '$line_through',
    value: 'line-through',
    type: 'textDecoration',
    icon: {
      name: 'strikethrough'
    }
  },
  {
    tooltip: '$overline',
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

export const parseProps = (props: any, baseUrl = '') => {
  if (!props) return null;
  const breakpoint = getBreakpoint();
  let newProps = { ...(props || {}) };
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
      } catch { }
    };
  }
  const newObj = {};
  for (let key in newProps) {
    const value = newProps[key];
    newObj[key] = typeof value === "string" ? parsePropValue(newProps[key], baseUrl) : value;
  }
  return newObj;
}

export const parsePropValue = (value: any, baseUrl?: string) => {
  if (typeof value !== "string") return value;
  value = value.replace(/\s+([{[])|([}\]])\s+/g, '');
  if (value.startsWith('{') && value.endsWith('}')) {
    value = value.substring(1, value.length - 1);
    if (value.startsWith('{') && value.endsWith('}')) {
      try {
        return JSON.parse(value);
      } catch {
        return handleParse(value, baseUrl);
      }
    } else if (value.startsWith('[') && value.endsWith(']')) {
      try {
        return JSON.parse(value);
      } catch {
        return handleParse(value, baseUrl);
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

export const handleParse = (value: string, baseUrl?: string) => {
  try {
    const newValue =
      value
        .replace(/(['"`])?(?!HH:|mm:|https?:)\b([a-z0-9A-Z_]+)(['"`])?:/g, '"$2": ')
        .replace(/'/g, '"')
        .replace(/\<([^\>]*)\>/g, (match, p1) => {
          const innerText: string = p1.replace(/"/g, '\'');
          return `<${innerText}>`;
        })
        .replace(/:\s*(true|false|null|\d+)\s*(,|\})/g, ': $1$2')
        .replace(/(Theme\.[a-z0-9A-Z\.\[\]_]+)/, '"$1"')
        .replace(/([a-z0-9A-Z]*)\.fullPath\(("|'_)([^"|']*)("|'_)\)/g, '"$1.fullPath(\'$3\')"')
        .replace(/,\s+\}$/g, '}');

    const parsedData = JSON.parse(newValue, (key, value) => {
      if (typeof value === 'string' && value.startsWith('Theme')) {
        const parsedValue = value.split('.');
        let themeValue = Theme;
        for (let i = 1; i < parsedValue.length; i++) {
          themeValue = themeValue[parsedValue[i]]
        }
        return themeValue;
      } else if (typeof value === 'string' && value.includes('fullPath')) {
        return getRealImageUrl(baseUrl, value);
      }
      return value;
    });
    return parsedData;
  } catch {
    return value;
  }
}

const getRealImageUrl = (baseUrl: string, value: string) => {
  if (typeof value === 'string') {
    const regex = /^([a-z0-9A-Z]*)\.fullPath\(('|")([^)]+)('|")\)/gi;
    const matches = regex.exec(value);
    if (matches) {
      value = matches[3];
      const imgURL = `${baseUrl}/assets/${value}`;
      return imgURL;
    }
  }
  return value;
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

export const isNumber = (value: string | number) => {
  return typeof value === 'number' || (value !== '' && !Number.isNaN(Number(value)));
}

export function getTranslationKey(text: string) {
  return text.replace(/\s/g, '_').toLowerCase();
}
