import {
  ComponentProperties,
  ComponentSchema,
  ComponentSchemas,
  DataFields,
  InterpolationType,
  StoreItemType
} from './data.models';

const componentsSchema: ComponentSchemas = [
  {
    name: 'smartTable',
    uiDataSourceElement: true,
    dataFields: [
      {
        propName: 'source',
        type: InterpolationType.CODE
      }
    ],
    properties: [
      { name: 'selectedRow', type: StoreItemType.OBJECT, initialValue: null },
      { name: 'deletedRow', type: StoreItemType.OBJECT, initialValue: null },
      { name: 'newRow', type: StoreItemType.OBJECT, initialValue: null },
      { name: 'editedRow', type: StoreItemType.OBJECT, initialValue: null }
    ]
  },
  {
    name: 'input',
    uiDataSourceElement: true,
    dataFields: [],
    properties: [{ name: 'value', type: StoreItemType.STRING, initialValue: '' }]
  },
  {
    name: 'checkbox',
    uiDataSourceElement: true,
    dataFields: [],
    properties: [{ name: 'value', type: StoreItemType.BOOLEAN, initialValue: false }]
  },
  {
    name: 'select',
    uiDataSourceElement: true,
    dataFields: [],
    properties: [{ name: 'value', type: StoreItemType.STRING, initialValue: '' }]
  },
  {
    name: 'radio',
    uiDataSourceElement: true,
    dataFields: [],
    properties: [{ name: 'value', type: StoreItemType.STRING, initialValue: '' }]
  },
  {
    name: 'datepicker',
    uiDataSourceElement: true,
    dataFields: [],
    properties: [{ name: 'value', type: StoreItemType.DATE, initialValue: null }]
  },
  {
    name: 'calendar',
    uiDataSourceElement: true,
    dataFields: [],
    properties: [{ name: 'value', type: StoreItemType.DATE, initialValue: null }]
  },
  {
    name: 'tabs',
    uiDataSourceElement: true,
    dataFields: [],
    properties: [
      { name: 'selectedIndex', type: StoreItemType.NUMBER, initialValue: 0 },
      { name: 'length', type: StoreItemType.NUMBER, initialValue: 0 }
    ]
  },
  {
    name: 'stepper',
    uiDataSourceElement: true,
    dataFields: [],
    properties: [
      { name: 'selectedIndex', type: StoreItemType.NUMBER, initialValue: 0 },
      { name: 'length', type: StoreItemType.NUMBER, initialValue: 0 }
    ]
  },
  {
    name: 'text',
    uiDataSourceElement: false,
    dataFields: [
      {
        propName: 'text',
        type: InterpolationType.STRING,
        keepInterpolation: true
      }
    ],
    properties: []
  },
  {
    name: 'heading',
    uiDataSourceElement: false,
    dataFields: [
      {
        propName: 'text',
        type: InterpolationType.STRING,
        keepInterpolation: true
      }
    ],
    properties: []
  },
  {
    name: 'link',
    uiDataSourceElement: false,
    dataFields: [
      {
        propName: 'text',
        type: InterpolationType.STRING,
        keepInterpolation: true
      },
      {
        propName: 'url.path',
        type: InterpolationType.STRING,
        keepInterpolation: true
      }
    ],
    properties: []
  },
  {
    name: 'checkbox',
    uiDataSourceElement: false,
    dataFields: [
      {
        propName: 'label',
        type: InterpolationType.STRING,
        keepInterpolation: true
      }
    ],
    properties: []
  },
  {
    name: 'image',
    uiDataSourceElement: false,
    dataFields: [
      {
        styleName: 'src.url',
        type: InterpolationType.STRING
      }
    ],
    properties: []
  },
  {
    name: 'barChart',
    uiDataSourceElement: false,
    dataFields: [
      {
        propName: 'data',
        type: InterpolationType.CODE
      }
    ],
    properties: []
  },
  {
    name: 'bubbleMap',
    uiDataSourceElement: false,
    dataFields: [
      {
        propName: 'data',
        type: InterpolationType.CODE
      }
    ],
    properties: []
  },
  {
    name: 'doughnutChart',
    uiDataSourceElement: false,
    dataFields: [
      {
        propName: 'data',
        type: InterpolationType.CODE
      }
    ],
    properties: []
  },
  {
    name: 'lineChart',
    uiDataSourceElement: false,
    dataFields: [
      {
        propName: 'data',
        type: InterpolationType.CODE
      }
    ],
    properties: []
  },
  {
    name: 'multipleAxisChart',
    uiDataSourceElement: false,
    dataFields: [
      {
        propName: 'data',
        type: InterpolationType.CODE
      }
    ],
    properties: []
  },
  {
    name: 'multipleBarChart',
    uiDataSourceElement: false,
    dataFields: [
      {
        propName: 'data',
        type: InterpolationType.CODE
      }
    ],
    properties: []
  },
  {
    name: 'pieChart',
    uiDataSourceElement: false,
    dataFields: [
      {
        propName: 'data',
        type: InterpolationType.CODE
      }
    ],
    properties: []
  },
  {
    name: 'card',
    uiDataSourceElement: false,
    dataFields: [
      {
        styleName: 'background.imageSrc.url',
        type: InterpolationType.STRING
      }
    ],
    properties: []
  },
  {
    name: 'space',
    uiDataSourceElement: false,
    dataFields: [
      {
        styleName: 'background.imageSrc.url',
        type: InterpolationType.STRING
      }
    ],
    properties: []
  },
  {
    name: 'iframe',
    uiDataSourceElement: false,
    dataFields: [
      {
        propName: 'url',
        type: InterpolationType.STRING
      }
    ],
    properties: []
  },
  {
    name: 'buttonLink',
    uiDataSourceElement: false,
    dataFields: [
      {
        propName: 'url.path',
        type: InterpolationType.STRING,
        keepInterpolation: true
      }
    ],
    properties: []
  }
];

export const uiDataSourceElements: string[] = componentsSchema
  .filter(({ uiDataSourceElement }: ComponentSchema) => uiDataSourceElement)
  .map(({ name }: ComponentSchema) => name);

export const dataFields: DataFields = componentsSchema.reduce(
  (fields: DataFields, componentSchema: ComponentSchema) => ({
    ...fields,
    [componentSchema.name]: componentSchema.dataFields
  }),
  {}
);

export const componentsProperties: readonly [string, ComponentProperties][] = componentsSchema
  .filter(({ uiDataSourceElement }: ComponentSchema) => uiDataSourceElement)
  .map(({ name, properties }: ComponentSchema) => [name, properties]);

export const definitionIdToScheme: { [definitionId: string]: ComponentSchema } = componentsSchema.reduce(
  (result, schema) => ({ ...result, [schema.name]: schema }),
  {}
);
