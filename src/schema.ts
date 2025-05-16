import { IDataSchema, IUISchema } from "@ijstech/components";

function getWidgetSchemas(): any {
  const propertiesSchema: IDataSchema = {
    type: 'object',
    properties: {
      pt: {
        title: 'Top',
        type: 'number',
      },
      pb: {
        title: 'Bottom',
        type: 'number',
      },
      pl: {
        title: 'Left',
        type: 'number',
      },
      pr: {
        title: 'Right',
        type: 'number',
      },
      align: {
        type: 'string',
        title: 'Alignment',
        enum: ['left', 'center', 'right'],
      },
      maxWidth: {
        type: 'number',
      },
      link: {
        title: 'URL',
        type: 'string',
      },
    },
  };
  const themesSchema: IUISchema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Group',
            label: 'Padding (px)',
            elements: [
              {
                type: 'VerticalLayout',
                elements: [
                  {
                    type: 'HorizontalLayout',
                    elements: [
                      {
                        type: 'Control',
                        scope: '#/properties/pt',
                      },
                      {
                        type: 'Control',
                        scope: '#/properties/pb',
                      },
                      {
                        type: 'Control',
                        scope: '#/properties/pl',
                      },
                      {
                        type: 'Control',
                        scope: '#/properties/pr',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  return {
    userInputDataSchema: propertiesSchema,
    userInputUISchema: themesSchema,
  };
}

export {
  getWidgetSchemas
}
