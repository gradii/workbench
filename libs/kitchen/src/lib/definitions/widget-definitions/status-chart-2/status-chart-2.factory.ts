import { doughnutChartSample, nextComponentId, KitchenComponent, KitchenType } from '@common/public-api';
import { dataPropsFactory } from '../../../workflow/data/data-factory';

// tslint:disable:max-line-length
export function statusChart2Factory(): KitchenComponent {
  return {
    id: nextComponentId(),type: KitchenType.Component,
    definitionId: 'card',
    styles: {
      xl: {
        headerPadding: true,
        bodyPadding: true,
        footerPadding: true,
        size: {
          widthValue: 360,
          widthUnit: 'px',
          widthAuto: false,
          heightValue: 300,
          heightUnit: 'px',
          heightAuto: true
        },
        visible: true,
        accent: '',
        status: '',
        background: {
          color: 'default',
          imageSrc: {
            url: '',
            uploadUrl: '',
            name: '',
            active: 'upload'
          },
          imageSize: 'auto'
        }
      }
    },
    properties: {
      showHeader: true,
      showFooter: false,
      container: true,
      name: 'StatusChartCard'
    },
    actions: {
      init: []
    },
    slots: {
      body: {
        componentList: [
          {
            id: nextComponentId(),type: KitchenType.Component,
            definitionId: 'space',
            styles: {
              xl: {
                direction: 'row',
                justify: 'flex-start',
                align: 'stretch',
                overflowX: 'visible',
                overflowY: 'visible',
                width: {
                  type: 'auto',
                  customValue: 100,
                  customUnit: '%'
                },
                height: {
                  type: 'custom',
                  customValue: 100,
                  customUnit: '%'
                },
                visible: true,
                background: {
                  color: 'transparent',
                  imageSrc: {
                    url: '',
                    uploadUrl: '',
                    name: '',
                    active: 'upload'
                  },
                  imageSize: 'auto'
                }
              }
            },
            properties: {
              container: true,
              name: 'Space'
            },
            actions: {
              init: [],
              click: []
            },
            contentSlot: {
              componentList: [
                {
                  id: nextComponentId(),type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-start',
                      align: 'center',
                      height: {
                        type: 'custom',
                        customValue: 32,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 12
                      },
                      paddings: {
                        paddingRight: 0,
                        paddingRightUnit: 'px',
                        paddingBottom: 12,
                        paddingBottomUnit: 'px'
                      },
                      visible: true,
                      background: {
                        color: 'transparent',
                        imageSrc: {
                          url: '',
                          uploadUrl: '',
                          name: '',
                          active: 'upload'
                        },
                        imageSize: 'auto'
                      }
                    }
                  },
                  properties: {
                    container: false,
                    name: 'Space'
                  },
                  actions: {
                    init: [],
                    click: []
                  },
                  contentSlot: {
                    componentList: [
                      {
                        id: nextComponentId(),type: KitchenType.Component,
                        definitionId: 'heading',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginRight: 0,
                              marginRightUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px',
                              marginLeft: 0,
                              marginLeftUnit: 'px'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: '56+',
                          type: 'h5',
                          color: 'primary',
                          italic: false,
                          underline: false,
                          name: 'Heading'
                        },
                        slots: {},
                        index: 0
                      }
                    ],
                    id: nextComponentId()
                  },
                  slots: {
                  },
                  index: 0
                },
                {
                  id: nextComponentId(),type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-start',
                      align: 'flex-start',
                      height: {
                        type: 'custom',
                        customValue: 24,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 12
                      },
                      visible: true,
                      background: {
                        color: 'transparent',
                        imageSrc: {
                          url: '',
                          uploadUrl: '',
                          name: '',
                          active: 'upload'
                        },
                        imageSize: 'auto'
                      }
                    }
                  },
                  properties: {
                    container: false,
                    name: 'Space'
                  },
                  actions: {
                    init: [],
                    click: []
                  },
                  contentSlot: {
                    componentList: [
                      {
                        id: nextComponentId(),type: KitchenType.Component,
                        definitionId: 'text',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px',
                              marginLeft: 0,
                              marginLeftUnit: 'px'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: 'today',
                          type: 'subtitle',
                          color: 'hint',
                          italic: false,
                          bold: false,
                          underline: false,
                          name: 'Text'
                        },
                        slots: {},
                        index: 0
                      }
                    ],
                    id: nextComponentId()
                  },
                  slots: {
                  },
                  index: 1
                },
                {
                  id: nextComponentId(),type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-start',
                      align: 'flex-start',
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 12
                      },
                      visible: true,
                      background: {
                        color: 'transparent',
                        imageSrc: {
                          url: '',
                          uploadUrl: '',
                          name: '',
                          active: 'upload'
                        },
                        imageSize: 'auto'
                      }
                    }
                  },
                  properties: {
                    container: false,
                    name: 'Space'
                  },
                  actions: {
                    init: [],
                    click: []
                  },
                  contentSlot: {
                    componentList: [
                      {
                        id: nextComponentId(),type: KitchenType.Component,
                        definitionId: 'doughnutChart',
                        styles: {
                          xl: {
                            size: {
                              widthValue: 100,
                              widthUnit: '%',
                              widthAuto: false,
                              heightValue: 200,
                              heightUnit: 'px',
                              heightAuto: false
                            },
                            visible: true
                          }
                        },
                        properties: {
                          ...dataPropsFactory(doughnutChartSample),
                          name: 'DoughnutChart'
                        },
                        actions: {
                          init: []
                        },
                        slots: {},
                        index: 0
                      }
                    ],
                    id: nextComponentId()
                  },
                  slots: {
                  },
                  index: 2
                }
              ],
              id: nextComponentId()
            },
            slots: {
            },
            index: 0
          }
        ],
        id: nextComponentId(),
        featureList: []
      },
      header: {
        componentList: [
          {
            id: nextComponentId(),type: KitchenType.Component,
            definitionId: 'space',
            styles: {
              xl: {
                direction: 'row',
                justify: 'flex-start',
                align: 'stretch',
                overflowX: 'visible',
                overflowY: 'visible',
                width: {
                  type: 'auto',
                  customValue: 100,
                  customUnit: '%'
                },
                height: {
                  type: 'custom',
                  customValue: 100,
                  customUnit: '%'
                },
                visible: true,
                background: {
                  color: 'transparent',
                  imageSrc: {
                    url: '',
                    uploadUrl: '',
                    name: '',
                    active: 'upload'
                  },
                  imageSize: 'auto'
                }
              }
            },
            properties: {
              container: true,
              name: 'Space'
            },
            actions: {
              init: [],
              click: []
            },
            contentSlot: {
              componentList: [
                {
                  id: nextComponentId(),type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-start',
                      align: 'center',
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 3
                      },
                      visible: true,
                      background: {
                        color: 'transparent',
                        imageSrc: {
                          url: '',
                          uploadUrl: '',
                          name: '',
                          active: 'upload'
                        },
                        imageSize: 'auto'
                      }
                    }
                  },
                  properties: {
                    name: 'Space',
                    container: false
                  },
                  actions: {
                    init: [],
                    click: []
                  },
                  contentSlot: {
                    componentList: [
                      {
                        id: nextComponentId(),type: KitchenType.Component,
                        definitionId: 'heading',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginRight: 0,
                              marginRightUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px',
                              marginLeft: 0,
                              marginLeftUnit: 'px'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: 'Orders',
                          type: 'h5',
                          color: 'basic',
                          italic: false,
                          underline: false,
                          name: 'Heading'
                        },
                        slots: {},
                        index: 0
                      }
                    ],
                    id: nextComponentId()
                  },
                  slots: {
                  },
                  index: 0
                },
                {
                  id: nextComponentId(),type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-end',
                      align: 'center',
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 9
                      },
                      visible: true,
                      background: {
                        color: 'transparent',
                        imageSrc: {
                          url: '',
                          uploadUrl: '',
                          name: '',
                          active: 'upload'
                        },
                        imageSize: 'auto'
                      }
                    }
                  },
                  properties: {
                    container: false,
                    name: 'Space'
                  },
                  actions: {
                    init: [],
                    click: []
                  },
                  contentSlot: {
                    componentList: [
                      {
                        id: nextComponentId(),type: KitchenType.Component,
                        definitionId: 'select',
                        styles: {
                          xl: {
                            size: 'medium',
                            width: {
                              type: 'auto',
                              customValue: 220,
                              customUnit: 'px'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          placeholder: 'Export',
                          status: 'warning',
                          disabled: false,
                          options: [
                            {
                              value: 'Excel'
                            },
                            {
                              value: 'CSV'
                            }
                          ],
                          name: 'Select'
                        },
                        actions: {
                          change: []
                        },
                        slots: {},
                        index: 0
                      }
                    ],
                    id: nextComponentId()
                  },
                  slots: {
                  },
                  index: 1
                }
              ],
              id: nextComponentId()
            },
            slots: {
            },
            index: 0
          }
        ],
        id: nextComponentId(),
        featureList: []
      }
    },
    index: 0
  };
}
