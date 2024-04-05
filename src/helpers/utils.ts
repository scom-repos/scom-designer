import assets from "../assets";
import { getBreakpoint } from "./store";

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
      },
      isActive: true
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
    },
    isActive: true
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
    },
    isActive: true,
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
    },
    isActive: true
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
  if (value.startsWith('{') && value.endsWith('}')) {
    value = value.substring(1, value.length - 1);
    if (value.startsWith('{') && value.endsWith('}')) {
      const parsedObject = JSON.parse(
        value
          .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
          .replace(/'/g, '"')
      );
      return parsedObject;
    } else if (value.startsWith('[') && value.endsWith(']')) {
      return JSON.parse(value);
    } else {
      if (value === 'true' || value === 'false') {
        value = value === 'true' ? true : false;
      } else if (!Number.isNaN(+value)) {
        value = +value;
      } else if (value === 'null') {
        value = null;
      } else if (value === 'undefined') {
        value = undefined;
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
