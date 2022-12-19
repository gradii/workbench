import { nextComponentId, KitchenComponent, KitchenType } from '@common/public-api';

// tslint:disable:max-line-length
export function statusCardFactory(): KitchenComponent {
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
      showHeader: false,
      showFooter: false,
      container: true,
      name: 'StatusCard'
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
                        definitionId: 'image',
                        styles: {
                          xl: {
                            size: {
                              widthValue: 80,
                              widthUnit: 'px',
                              widthAuto: false,
                              heightValue: 80,
                              heightUnit: 'px',
                              heightAuto: false
                            },
                            margins: {
                              marginRight: 8,
                              marginRightUnit: 'px'
                            },
                            fit: 'cover',
                            radius: {
                              value: 100,
                              unit: 'px'
                            },
                            visible: true,
                            src: {
                              url:
                                'https://c7.uihere.com/files/348/800/890/computer-icons-avatar-user-login-avatar.jpg',
                              uploadUrl: '',
                              name: '',
                              active: 'url'
                            }
                          }
                        },
                        properties: {
                          name: 'Image'
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
                          text: 'Orders',
                          type: 'h6',
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
                  index: 1
                },
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
                              marginLeftUnit: 'px',
                              marginRight: 4,
                              marginRightUnit: 'px'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: '25 new',
                          type: 'subtitle',
                          color: 'basic',
                          italic: false,
                          bold: false,
                          underline: false,
                          name: 'Text'
                        },
                        slots: {},
                        index: 0
                      },
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
                          text: 'this week',
                          type: 'subtitle',
                          color: 'hint',
                          italic: false,
                          bold: false,
                          underline: false,
                          name: 'Text'
                        },
                        slots: {},
                        index: 1
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
      }
    },
    index: 0
  };
}
