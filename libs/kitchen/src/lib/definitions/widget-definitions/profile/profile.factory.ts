import { nextComponentId, KitchenComponent, KitchenType } from '@common/public-api';

// tslint:disable:max-line-length
export function profileFactory(): KitchenComponent {
  return {
    id: nextComponentId(),type: KitchenType.Component,
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
      showFooter: true,
      container: true,
      name: 'ProfileContainer'
    },
    actions: {
      init: []
    },
    slots: {
      header: {
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
                    text: 'Profile',
                    type: 'h5',
                    color: 'basic',
                    italic: false,
                    underline: false,
                    name: 'Heading'
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
                        marginLeft: 'auto'
                      },
                      visible: true
                    }
                  },
                  properties: {
                    text: 'Update your information here',
                    type: 'caption-2',
                    color: 'basic',
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
            index: 0
          }
        ],
        id: nextComponentId(),
        featureList: []
      },
      body: {
        componentList: [
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
                        customValue: 6
                      },
                      paddings: {
                        paddingRight: 12,
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
                        id: nextComponentId(),type: KitchenType.Component,
                        definitionId: 'space',
                        styles: {
                          xl: {
                            direction: 'row',
                            justify: 'center',
                            align: 'center',
                            height: {
                              type: 'custom',
                              customValue: 160,
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
                              paddingBottom: 24,
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
                            justify: 'center',
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
                              paddingBottom: 0,
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
                              definitionId: 'input',
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
                                iconPlacement: 'none',
                                icon: 'star',
                                placeholder: '',
                                type: 'file',
                                status: 'basic',
                                shape: 'rectangle',
                                disabled: false,
                                name: 'Input'
                              },
                              actions: {
                                type: []
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
                            direction: 'column',
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
                                text: 'Password',
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
                        index: 2
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
                              definitionId: 'text',
                              styles: {
                                xl: {
                                  margins: {
                                    marginTop: 0,
                                    marginTopUnit: 'px',
                                    marginBottom: 4,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                text: 'Current Password',
                                type: 'label',
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
                              definitionId: 'input',
                              styles: {
                                xl: {
                                  size: 'medium',
                                  width: {
                                    type: 'full',
                                    customValue: 220,
                                    customUnit: 'px'
                                  },
                                  margins: {
                                    marginBottom: 20,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                iconPlacement: 'none',
                                icon: 'star',
                                placeholder: '',
                                status: 'basic',
                                shape: 'rectangle',
                                disabled: false,
                                type: 'password',
                                name: 'Input'
                              },
                              actions: {
                                type: []
                              },
                              slots: {},
                              index: 1
                            }
                          ],
                          id: nextComponentId()
                        },
                        slots: {
                        },
                        index: 3
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
                              definitionId: 'text',
                              styles: {
                                xl: {
                                  margins: {
                                    marginTop: 0,
                                    marginTopUnit: 'px',
                                    marginBottom: 4,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                text: 'New Password',
                                type: 'label',
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
                              definitionId: 'input',
                              styles: {
                                xl: {
                                  size: 'medium',
                                  width: {
                                    type: 'full',
                                    customValue: 220,
                                    customUnit: 'px'
                                  },
                                  margins: {
                                    marginBottom: 20,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                iconPlacement: 'none',
                                icon: 'star',
                                placeholder: '',
                                status: 'basic',
                                shape: 'rectangle',
                                disabled: false,
                                type: 'password',
                                name: 'Input'
                              },
                              actions: {
                                type: []
                              },
                              slots: {},
                              index: 1
                            }
                          ],
                          id: nextComponentId()
                        },
                        slots: {
                        },
                        index: 4
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
                              definitionId: 'text',
                              styles: {
                                xl: {
                                  margins: {
                                    marginTop: 0,
                                    marginTopUnit: 'px',
                                    marginBottom: 4,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                text: 'Repeat New Password',
                                type: 'label',
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
                              definitionId: 'input',
                              styles: {
                                xl: {
                                  size: 'medium',
                                  width: {
                                    type: 'full',
                                    customValue: 220,
                                    customUnit: 'px'
                                  },
                                  margins: {
                                    marginBottom: 20,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                iconPlacement: 'none',
                                icon: 'star',
                                placeholder: '',
                                status: 'basic',
                                shape: 'rectangle',
                                disabled: false,
                                type: 'password',
                                name: 'Input'
                              },
                              actions: {
                                type: []
                              },
                              slots: {},
                              index: 1
                            }
                          ],
                          id: nextComponentId()
                        },
                        slots: {
                        },
                        index: 5
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
                      direction: 'column',
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
                        customValue: 6
                      },
                      paddings: {
                        paddingLeft: 12,
                        paddingLeftUnit: 'px'
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
                                text: 'Customer info',
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
                                    marginBottom: 4,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                text: 'Full Name',
                                type: 'label',
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
                              definitionId: 'input',
                              styles: {
                                xl: {
                                  size: 'medium',
                                  width: {
                                    type: 'full',
                                    customValue: 220,
                                    customUnit: 'px'
                                  },
                                  margins: {
                                    marginBottom: 20,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                iconPlacement: 'none',
                                icon: 'star',
                                placeholder: '',
                                status: 'basic',
                                shape: 'rectangle',
                                disabled: false,
                                type: 'text',
                                name: 'Input'
                              },
                              actions: {
                                type: []
                              },
                              slots: {},
                              index: 1
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
                              definitionId: 'text',
                              styles: {
                                xl: {
                                  margins: {
                                    marginTop: 0,
                                    marginTopUnit: 'px',
                                    marginBottom: 4,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                text: 'Company Name',
                                type: 'label',
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
                              definitionId: 'input',
                              styles: {
                                xl: {
                                  size: 'medium',
                                  width: {
                                    type: 'full',
                                    customValue: 220,
                                    customUnit: 'px'
                                  },
                                  margins: {
                                    marginBottom: 20,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                iconPlacement: 'none',
                                icon: 'star',
                                placeholder: '',
                                status: 'basic',
                                shape: 'rectangle',
                                disabled: false,
                                type: 'text',
                                name: 'Input'
                              },
                              actions: {
                                type: []
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
                                text: 'Contact info',
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
                        index: 3
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
                              definitionId: 'text',
                              styles: {
                                xl: {
                                  margins: {
                                    marginTop: 0,
                                    marginTopUnit: 'px',
                                    marginBottom: 4,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                text: 'Email',
                                type: 'label',
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
                              definitionId: 'input',
                              styles: {
                                xl: {
                                  size: 'medium',
                                  width: {
                                    type: 'full',
                                    customValue: 220,
                                    customUnit: 'px'
                                  },
                                  margins: {
                                    marginBottom: 20,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                iconPlacement: 'none',
                                icon: 'star',
                                placeholder: '',
                                status: 'basic',
                                shape: 'rectangle',
                                disabled: false,
                                type: 'email',
                                name: 'Input'
                              },
                              actions: {
                                type: []
                              },
                              slots: {},
                              index: 1
                            }
                          ],
                          id: nextComponentId()
                        },
                        slots: {
                        },
                        index: 4
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
                              definitionId: 'text',
                              styles: {
                                xl: {
                                  margins: {
                                    marginTop: 0,
                                    marginTopUnit: 'px',
                                    marginBottom: 4,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                text: 'Phone',
                                type: 'label',
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
                              definitionId: 'input',
                              styles: {
                                xl: {
                                  size: 'medium',
                                  width: {
                                    type: 'full',
                                    customValue: 220,
                                    customUnit: 'px'
                                  },
                                  margins: {
                                    marginBottom: 20,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                iconPlacement: 'none',
                                icon: 'star',
                                placeholder: '',
                                status: 'basic',
                                shape: 'rectangle',
                                disabled: false,
                                type: 'text',
                                name: 'Input'
                              },
                              actions: {
                                type: []
                              },
                              slots: {},
                              index: 1
                            }
                          ],
                          id: nextComponentId()
                        },
                        slots: {
                        },
                        index: 5
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
                            paddings: {
                              paddingLeft: 0,
                              paddingLeftUnit: 'px'
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
                                    marginBottom: 4,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                text: 'Address',
                                type: 'label',
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
                              definitionId: 'input',
                              styles: {
                                xl: {
                                  size: 'medium',
                                  width: {
                                    type: 'full',
                                    customValue: 220,
                                    customUnit: 'px'
                                  },
                                  margins: {
                                    marginBottom: 20,
                                    marginBottomUnit: 'px'
                                  },
                                  visible: true
                                }
                              },
                              properties: {
                                iconPlacement: 'none',
                                icon: 'star',
                                placeholder: '',
                                status: 'basic',
                                shape: 'rectangle',
                                disabled: false,
                                type: 'text',
                                name: 'Input'
                              },
                              actions: {
                                type: []
                              },
                              slots: {},
                              index: 1
                            }
                          ],
                          id: nextComponentId()
                        },
                        slots: {
                        },
                        index: 6
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
      },
      footer: {
        componentList: [
          {
            id: nextComponentId(),type: KitchenType.Component,
            definitionId: 'space',
            styles: {
              xl: {
                direction: 'row',
                justify: 'center',
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
                  definitionId: 'button',
                  styles: {
                    xl: {
                      size: 'medium',
                      width: {
                        type: 'auto',
                        customValue: 220,
                        customUnit: 'px'
                      },
                      iconPlacement: 'none',
                      visible: true
                    }
                  },
                  properties: {
                    text: 'Update Profile',
                    status: 'success',
                    appearance: 'filled',
                    disabled: false,
                    icon: 'star',
                    name: 'Button'
                  },
                  actions: {
                    click: []
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
          }
        ],
        id: nextComponentId(),
        featureList: []
      }
    },
    index: 0
  };
}
