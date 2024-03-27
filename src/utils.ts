import assets from "./assets";

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
      value: 'flex-start',
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
      value: 'flex-end',
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
    value: 'flex-start',
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
    value: 'flex-end',
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
    value: 'flex-start',
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
    value: 'flex-end',
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

export const parsePropValue = (value: string) => {
  if (value.startsWith('{') && value.endsWith('}')) {
    value = value.substring(1, value.length - 1);
    if (value.startsWith('{') && value.endsWith('}')) {
      const parsedObject = JSON.parse(
        value
          .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
          .replace(/'/g, '"')
      );
      return parsedObject;
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
