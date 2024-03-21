import assets from "./assets";
import { IBlock, IComponentPicker, IComponentItem, IScreen } from "./interface";

// TODO - This array should be dynamic data
export const recentComponents: IComponentPicker[] = [
  {
    name: 'Frequently Used',
    tooltipText: 'Components that you use most frequently',
    items: [
      {
        path: '',
        caption: 'Text',
        image: assets.fullPath('img/designer/Text.svg')
      },
      {
        path: '',
        caption: 'View',
        image: assets.fullPath('img/designer/View.svg')
      }
    ]
  },
  {
    name: 'Recently Used',
    tooltipText: 'Components that you used recently',
    items: [
      {
        path: '',
        caption: 'Button',
        image: assets.fullPath('img/designer/Button.svg')
      }
    ]
  }
];

export const pickerComponents: IComponentPicker[] = [
  {
    name: 'Basic',
    tooltipText: 'The most simple & essential components to build a screen',
    items: [
      {
        path: '',
        caption: 'Icon',
        image: assets.fullPath('img/designer/Icon.svg')
      },
      {
        path: '',
        caption: 'Text',
        image: assets.fullPath('img/designer/Text.svg')
      },
      {
        path: '',
        caption: 'View',
        image: assets.fullPath('img/designer/View.svg')
      }
    ]
  },
  {
    name: 'Buttons',
    tooltipText: 'Components that allow users to complete actions on click',
    items: [
      {
        path: '',
        caption: 'Button',
        image: assets.fullPath('img/designer/Button.svg')
      },
      {
        path: '',
        caption: 'Link',
        image: assets.fullPath('img/designer/Link.svg')
      }
    ]
  }
]

// TODO - This array should be dynamic data
export const blockComponents: IBlock[] = [
  {
    id: '1',
    path: '',
    caption: 'My Block 1',
    image: assets.fullPath('img/designer/Block.svg')
  },
  {
    id: '2',
    path: '',
    caption: 'My Block 2',
    image: assets.fullPath('img/designer/Block.svg')
  }
]

export const screen: IScreen = {
  id: '1',
  name: 'First Screen',
  elements: [
    {
      path: '',
      caption: 'View',
      image: assets.fullPath('img/designer/View.svg'),
      children: [
        {
          path: '',
          caption: 'Text',
          image: assets.fullPath('img/designer/Text.svg')
        },
        {
          path: '',
          caption: 'Button',
          image: assets.fullPath('img/designer/Button.svg')
        },
        {
          path: '',
          caption: 'View',
          image: assets.fullPath('img/designer/View.svg'),
          children: [
            {
              path: '',
              caption: 'Text',
              image: assets.fullPath('img/designer/Text.svg')
            },
            {
              path: '',
              caption: 'Text 2',
              image: assets.fullPath('img/designer/Text.svg')
            }
          ]
        }
      ]
    }
  ]
}