import { nextComponentId, KitchenComponent, KitchenType } from '@common/public-api';

// tslint:disable:max-line-length
export function tasksFactory(): KitchenComponent {
  return {
    id: nextComponentId(),
    type: KitchenType.Component,
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
        margins: {
          marginLeft: 0,
          marginLeftUnit: 'px',
          marginRight: 0,
          marginRightUnit: 'px',
          marginBottom: 0,
          marginBottomUnit: 'px'
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
      name: 'Tasks',
      container: true
    },
    actions: {
      init: []
    },
    slots: {
      header: {
        componentList: [
          {
            id: nextComponentId(),
            type: KitchenType.Component,
            definitionId: 'space',
            styles: {
              xl: {
                direction: 'row',
                justify: 'flex-start',
                align: 'center',
                width: {
                  type: 'custom',
                  customUnit: 'col',
                  customValue: 12
                },
                height: {
                  type: 'auto',
                  customValue: 48,
                  customUnit: 'px'
                },
                overflowX: 'visible',
                overflowY: 'visible',
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
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'heading',
                  styles: {
                    xl: {
                      margins: {
                        marginTop: 0,
                        marginTopUnit: 'px',
                        marginRight: 24,
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
                    text: 'Tasks',
                    type: 'h6',
                    italic: false,
                    underline: false,
                    color: 'basic',
                    name: 'Heading'
                  },
                  slots: {},
                  index: 0
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
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
                    text: 'Add new task',
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
            },
            slots: {
            },
            index: 0
          }
        ],
        id: nextComponentId(),
        featureList: []
      },
      body: {
        componentList: [
          {
            id: nextComponentId(),
            type: KitchenType.Component,
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
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-start',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 9
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'checkbox',
                        styles: {
                          xl: {
                            visible: true
                          }
                        },
                        properties: {
                          label: 'New campaign message',
                          status: 'success',
                          disabled: false,
                          name: 'Checkbox'
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
                  index: 0
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-end',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 2
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      paddings: {
                        paddingRight: 8,
                        paddingRightUnit: 'px'
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'text',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: '20 Mar 2019',
                          italic: false,
                          bold: false,
                          underline: false,
                          color: 'basic',
                          type: 'paragraph',
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
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-end',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 1
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      paddings: {
                        paddingRight: 8,
                        paddingRightUnit: 'px'
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'text',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px',
                              marginRight: 'auto'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: 'Delete',
                          italic: false,
                          bold: false,
                          underline: false,
                          color: 'danger',
                          type: 'paragraph',
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
                  index: 2
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-start',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 9
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
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
                  actions: {
                    init: [],
                    click: []
                  },
                  properties: {
                    name: 'Space',
                    container: false
                  },
                  contentSlot: {
                    componentList: [
                      {
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'checkbox',
                        styles: {
                          xl: {
                            visible: true
                          }
                        },
                        properties: {
                          label: 'Answer to Victoria',
                          status: 'success',
                          disabled: false,
                          name: 'Checkbox'
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
                  index: 3
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-end',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 2
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      paddings: {
                        paddingRight: 8,
                        paddingRightUnit: 'px'
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
                  actions: {
                    init: [],
                    click: []
                  },
                  properties: {
                    name: 'Space',
                    container: false
                  },
                  contentSlot: {
                    componentList: [
                      {
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'text',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: '21 Mar 2019',
                          italic: false,
                          bold: false,
                          underline: false,
                          color: 'basic',
                          type: 'paragraph',
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
                  index: 4
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-end',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 1
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      paddings: {
                        paddingRight: 8,
                        paddingRightUnit: 'px'
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'text',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px',
                              marginRight: 'auto'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: 'Delete',
                          italic: false,
                          bold: false,
                          underline: false,
                          color: 'danger',
                          type: 'paragraph',
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
                  index: 5
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-start',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 9
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'checkbox',
                        styles: {
                          xl: {
                            visible: true
                          }
                        },
                        properties: {
                          label: 'Update Twitter campaign for Site',
                          status: 'danger',
                          disabled: false,
                          name: 'Checkbox'
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
                  index: 6
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-end',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 2
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      paddings: {
                        paddingRight: 8,
                        paddingRightUnit: 'px'
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'text',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: '22 Mar 2019',
                          italic: false,
                          bold: false,
                          underline: false,
                          color: 'basic',
                          type: 'paragraph',
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
                  index: 7
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-end',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 1
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      paddings: {
                        paddingRight: 8,
                        paddingRightUnit: 'px'
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'text',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px',
                              marginRight: 'auto'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: 'Delete',
                          italic: false,
                          bold: false,
                          underline: false,
                          color: 'danger',
                          type: 'paragraph',
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
                  index: 8
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-start',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 9
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'checkbox',
                        styles: {
                          xl: {
                            visible: true
                          }
                        },
                        properties: {
                          label: 'Meeting with Henrick',
                          status: 'success',
                          disabled: false,
                          name: 'Checkbox'
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
                  index: 9
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-end',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 2
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      paddings: {
                        paddingRight: 8,
                        paddingRightUnit: 'px'
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'text',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: '23 Mar 2019',
                          italic: false,
                          bold: false,
                          underline: false,
                          color: 'basic',
                          type: 'paragraph',
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
                  index: 10
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-end',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 1
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      paddings: {
                        paddingRight: 8,
                        paddingRightUnit: 'px'
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'text',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px',
                              marginRight: 'auto'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: 'Delete',
                          italic: false,
                          bold: false,
                          underline: false,
                          color: 'danger',
                          type: 'paragraph',
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
                  index: 11
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-start',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 9
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'checkbox',
                        styles: {
                          xl: {
                            visible: true
                          }
                        },
                        properties: {
                          label: 'Update Tracking board',
                          status: 'success',
                          disabled: false,
                          name: 'Checkbox'
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
                  index: 12
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-end',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 2
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      paddings: {
                        paddingRight: 8,
                        paddingRightUnit: 'px'
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'text',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: '24 Mar 2019',
                          italic: false,
                          bold: false,
                          underline: false,
                          color: 'basic',
                          type: 'paragraph',
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
                  index: 13
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-end',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 1
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      paddings: {
                        paddingRight: 8,
                        paddingRightUnit: 'px'
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'text',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px',
                              marginRight: 'auto'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: 'Delete',
                          italic: false,
                          bold: false,
                          underline: false,
                          color: 'danger',
                          type: 'paragraph',
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
                  index: 14
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-start',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 9
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'checkbox',
                        styles: {
                          xl: {
                            visible: true
                          }
                        },
                        properties: {
                          label: 'Answer to Robert',
                          status: 'success',
                          disabled: false,
                          name: 'Checkbox'
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
                  index: 15
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-end',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 2
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      paddings: {
                        paddingRight: 8,
                        paddingRightUnit: 'px'
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'text',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: '24 Mar 2019',
                          italic: false,
                          bold: false,
                          underline: false,
                          color: 'basic',
                          type: 'paragraph',
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
                  index: 16
                },
                {
                  id: nextComponentId(),
                  type: KitchenType.Component,
                  definitionId: 'space',
                  styles: {
                    xl: {
                      direction: 'row',
                      justify: 'flex-end',
                      align: 'center',
                      width: {
                        type: 'custom',
                        customUnit: 'col',
                        customValue: 1
                      },
                      height: {
                        type: 'auto',
                        customValue: 48,
                        customUnit: 'px'
                      },
                      overflowX: 'visible',
                      overflowY: 'visible',
                      paddings: {
                        paddingRight: 8,
                        paddingRightUnit: 'px'
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
                        id: nextComponentId(),
                        type: KitchenType.Component,
                        definitionId: 'text',
                        styles: {
                          xl: {
                            margins: {
                              marginTop: 0,
                              marginTopUnit: 'px',
                              marginBottom: 0,
                              marginBottomUnit: 'px',
                              marginRight: 'auto'
                            },
                            visible: true
                          }
                        },
                        properties: {
                          text: 'Delete',
                          italic: false,
                          bold: false,
                          underline: false,
                          color: 'danger',
                          type: 'paragraph',
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
                  index: 17
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
