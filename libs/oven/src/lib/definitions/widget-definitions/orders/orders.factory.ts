import { nextComponentId, OvenComponent } from '@common';
import { dataPropsFactory } from '../../../workflow/data/data-factory';
import { smartTableSample } from '../../components-definitions/smart-table/smart-table-definition.module';

// tslint:disable:max-line-length
export function ordersFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'card',
    styles: {
      xl: {
        headerPadding: true,
        bodyPadding: true,
        footerPadding: true,
        size: {
          widthValue: 100,
          widthUnit: '%',
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
      name: 'OrderList'
    },
    actions: {
      init: []
    },
    slots: {
      body: {
        componentList: [
          {
            id: nextComponentId(),
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
                    name: 'Space',
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
            slots: {
              content: {
                componentList: [
                  {
                    id: nextComponentId(),
                    definitionId: 'smartTable',
                    styles: {
                      xl: {
                        size: {
                          widthValue: 100,
                          widthUnit: '%',
                          widthAuto: false,
                          heightValue: 150,
                          heightUnit: 'px',
                          heightAuto: true
                        },
                        visible: true
                      }
                    },
                    properties: {
                      ...dataPropsFactory(smartTableSample, 'source'),
                      name: 'SmartTable',
                      settings: {
                        columns: {
                          id: {
                            title: 'ID',
                            filter: true
                          },
                          date: {
                            title: 'Date'
                          },
                          amount: {
                            title: 'Amount'
                          },
                          customer: {
                            title: 'Customer'
                          },
                          status: {
                            title: 'Status'
                          }
                        },
                        delete: {
                          confirmDelete: true
                        },
                        add: {
                          confirmCreate: true
                        },
                        edit: {
                          confirmSave: true
                        },
                        actions: {
                          add: true,
                          edit: true,
                          delete: true
                        },
                        mode: 'internal',
                        pager: { perPage: 10 }
                      }
                    },
                    actions: {
                      init: [],
                      smartTableCreate: [],
                      smartTableEdit: [],
                      smartTableDelete: [],
                      smartTableRowSelect: []
                    },
                    slots: {},
                    index: 0
                  }
                ],
                id: nextComponentId()
              }
            },
            index: 0
          }
        ],
        id: nextComponentId()
      },
      header: {
        componentList: [
          {
            id: nextComponentId(),
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
              name: 'Space',
              container: false
            },
            actions: {
              init: [],
              click: []
            },
            slots: {
              content: {
                componentList: [
                  {
                    id: nextComponentId(),
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
                      text: 'Orders List',
                      type: 'h6',
                      color: 'basic',
                      italic: false,
                      underline: false,
                      name: 'Heading'
                    },
                    slots: {},
                    index: 0
                  },
                  {
                    id: nextComponentId(),
                    definitionId: 'button',
                    styles: {
                      xl: {
                        size: 'medium',
                        width: {
                          type: 'auto',
                          customValue: 220,
                          customUnit: 'px'
                        },
                        margins: {
                          marginLeft: 'auto'
                        },
                        iconPlacement: 'none',
                        visible: true
                      }
                    },
                    properties: {
                      text: 'Place order',
                      status: 'primary',
                      appearance: 'filled',
                      disabled: false,
                      icon: 'star',
                      name: 'Button'
                    },
                    actions: {
                      click: []
                    },
                    slots: {},
                    index: 1
                  }
                ],
                id: nextComponentId()
              }
            },
            index: 0
          }
        ],
        id: nextComponentId()
      }
    },
    index: 0
  };
}
