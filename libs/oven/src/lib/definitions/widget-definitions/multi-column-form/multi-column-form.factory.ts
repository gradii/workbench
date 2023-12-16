import { nextComponentId, OvenComponent } from '@common';

// tslint:disable:max-line-length
export function multiColumnFormFactory(): OvenComponent {
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
      showFooter: true,
      container: true,
      name: 'Card'
    },
    actions: {
      init: []
    },
    slots: {
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
                  type: 'auto',
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
                      text: 'Create User',
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
              }
            },
            index: 0
          }
        ],
        id: nextComponentId()
      },
      body: {
        componentList: [
          {
            id: nextComponentId(),
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
            slots: {
              content: {
                componentList: [
                  {
                    id: nextComponentId(),
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
                    slots: {
                      content: {
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
                                  customValue: 6
                                },
                                paddings: {
                                  paddingLeft: 0,
                                  paddingLeftUnit: 'px',
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
                                        paddings: {
                                          paddingBottom: 16,
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
                                    slots: {
                                      content: {
                                        componentList: [
                                          {
                                            id: nextComponentId(),
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
                                            id: nextComponentId(),
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
                                                  marginBottom: 4,
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
                                          },
                                          {
                                            id: nextComponentId(),
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
                                              text: 'Enter your Full Name',
                                              type: 'caption',
                                              color: 'basic',
                                              italic: false,
                                              bold: false,
                                              underline: false,
                                              name: 'Text'
                                            },
                                            slots: {},
                                            index: 2
                                          }
                                        ],
                                        id: nextComponentId()
                                      }
                                    },
                                    index: 0
                                  },
                                  {
                                    id: nextComponentId(),
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
                                            id: nextComponentId(),
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
                                      }
                                    },
                                    index: 1
                                  },
                                  {
                                    id: nextComponentId(),
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
                                    slots: {
                                      content: {
                                        componentList: [
                                          {
                                            id: nextComponentId(),
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
                                          }
                                        ],
                                        id: nextComponentId()
                                      }
                                    },
                                    index: 2
                                  },
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
                                        margins: {
                                          marginLeft: -12,
                                          marginLeftUnit: 'px'
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
                                    slots: {
                                      content: {
                                        componentList: [
                                          {
                                            id: nextComponentId(),
                                            definitionId: 'select',
                                            styles: {
                                              xl: {
                                                size: 'medium',
                                                width: {
                                                  type: 'auto',
                                                  customValue: 220,
                                                  customUnit: 'px'
                                                },
                                                margins: {
                                                  marginLeft: 12,
                                                  marginLeftUnit: 'px',
                                                  marginBottom: 20,
                                                  marginBottomUnit: 'px'
                                                },
                                                visible: true
                                              }
                                            },
                                            properties: {
                                              placeholder: 'Country',
                                              status: 'primary',
                                              disabled: false,
                                              options: [
                                                {
                                                  value: 'USA'
                                                },
                                                {
                                                  value: 'UK'
                                                },
                                                {
                                                  value: 'France'
                                                }
                                              ],
                                              name: 'Select'
                                            },
                                            actions: {
                                              change: []
                                            },
                                            slots: {},
                                            index: 0
                                          },
                                          {
                                            id: nextComponentId(),
                                            definitionId: 'select',
                                            styles: {
                                              xl: {
                                                size: 'medium',
                                                width: {
                                                  type: 'auto',
                                                  customValue: 220,
                                                  customUnit: 'px'
                                                },
                                                margins: {
                                                  marginBottom: 20,
                                                  marginBottomUnit: 'px',
                                                  marginRight: 0,
                                                  marginRightUnit: 'px',
                                                  marginLeft: 12,
                                                  marginLeftUnit: 'px'
                                                },
                                                visible: true
                                              }
                                            },
                                            properties: {
                                              placeholder: 'City',
                                              status: 'primary',
                                              disabled: false,
                                              options: [
                                                {
                                                  value: 'New York'
                                                },
                                                {
                                                  value: 'Denver'
                                                },
                                                {
                                                  value: 'Salt Lake City'
                                                }
                                              ],
                                              name: 'Select'
                                            },
                                            actions: {
                                              change: []
                                            },
                                            slots: {},
                                            index: 1
                                          }
                                        ],
                                        id: nextComponentId()
                                      }
                                    },
                                    index: 3
                                  },
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
                                        paddings: {
                                          paddingBottom: 16,
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
                                    slots: {
                                      content: {
                                        componentList: [
                                          {
                                            id: nextComponentId(),
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
                                              placeholder: 'Address line 1',
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
                                            index: 0
                                          },
                                          {
                                            id: nextComponentId(),
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
                                                  marginBottom: 4,
                                                  marginBottomUnit: 'px'
                                                },
                                                visible: true
                                              }
                                            },
                                            properties: {
                                              iconPlacement: 'none',
                                              icon: 'star',
                                              placeholder: 'Address line 2',
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
                                          },
                                          {
                                            id: nextComponentId(),
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
                                              text: 'Enter your Address',
                                              type: 'caption',
                                              color: 'basic',
                                              italic: false,
                                              bold: false,
                                              underline: false,
                                              name: 'Text'
                                            },
                                            slots: {},
                                            index: 2
                                          }
                                        ],
                                        id: nextComponentId()
                                      }
                                    },
                                    index: 4
                                  },
                                  {
                                    id: nextComponentId(),
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
                                    slots: {
                                      content: {
                                        componentList: [
                                          {
                                            id: nextComponentId(),
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
                                              text: 'User Group',
                                              type: 'label',
                                              color: 'basic',
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
                                      }
                                    },
                                    index: 5
                                  },
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
                                    slots: {
                                      content: {
                                        componentList: [
                                          {
                                            id: nextComponentId(),
                                            definitionId: 'radio',
                                            styles: {
                                              xl: {
                                                visible: true,
                                                direction: 'column',
                                                justify: 'flex-start',
                                                align: 'flex-start',
                                                size: {
                                                  widthValue: 200,
                                                  widthUnit: 'px',
                                                  widthAuto: true,
                                                  heightValue: 36,
                                                  heightUnit: 'px',
                                                  heightAuto: true
                                                },
                                                overflowX: 'visible',
                                                overflowY: 'visible'
                                              }
                                            },
                                            properties: {
                                              name: 'Radio',
                                              status: 'basic',
                                              options: [
                                                {
                                                  value: 'User'
                                                },
                                                {
                                                  value: 'Admin'
                                                }
                                              ]
                                            },
                                            actions: {
                                              change: []
                                            },
                                            slots: {},
                                            index: 0
                                          }
                                        ],
                                        id: nextComponentId()
                                      }
                                    },
                                    index: 6
                                  }
                                ],
                                id: nextComponentId()
                              }
                            },
                            index: 0
                          },
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
                                  customValue: 6
                                },
                                paddings: {
                                  paddingRight: 0,
                                  paddingRightUnit: 'px',
                                  paddingLeft: 8,
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
                            slots: {
                              content: {
                                componentList: [
                                  {
                                    id: nextComponentId(),
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
                                              text: 'Contact Number',
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
                                            id: nextComponentId(),
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
                                                  marginBottom: 4,
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
                                          },
                                          {
                                            id: nextComponentId(),
                                            definitionId: 'text',
                                            styles: {
                                              xl: {
                                                margins: {
                                                  marginTop: 0,
                                                  marginTopUnit: 'px',
                                                  marginBottom: 16,
                                                  marginBottomUnit: 'px',
                                                  marginLeft: 'auto'
                                                },
                                                visible: true
                                              }
                                            },
                                            properties: {
                                              text: 'Enter your Contact Number',
                                              type: 'caption',
                                              color: 'basic',
                                              italic: false,
                                              bold: false,
                                              underline: false,
                                              name: 'Text'
                                            },
                                            slots: {},
                                            index: 2
                                          }
                                        ],
                                        id: nextComponentId()
                                      }
                                    },
                                    index: 0
                                  },
                                  {
                                    id: nextComponentId(),
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
                                              text: 'Post code',
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
                                            id: nextComponentId(),
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
                                      }
                                    },
                                    index: 1
                                  },
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
                                    slots: {
                                      content: {
                                        componentList: [
                                          {
                                            id: nextComponentId(),
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
                                              text: 'ID Scan',
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
                                            id: nextComponentId(),
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
                                              type: 'file',
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
                                      }
                                    },
                                    index: 2
                                  },
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
                                    slots: {
                                      content: {
                                        componentList: [
                                          {
                                            id: nextComponentId(),
                                            definitionId: 'tabs',
                                            styles: {
                                              xl: {
                                                size: {
                                                  widthValue: 100,
                                                  widthUnit: '%',
                                                  widthAuto: false,
                                                  heightValue: 200,
                                                  heightUnit: 'px',
                                                  heightAuto: true
                                                },
                                                visible: true
                                              }
                                            },
                                            properties: {
                                              options: [
                                                {
                                                  value: 'User Permissions',
                                                  id: 'tab0'
                                                },
                                                {
                                                  value: 'Admin Permissions',
                                                  id: 'tab1'
                                                }
                                              ],
                                              container: true,
                                              name: 'Tabs'
                                            },
                                            actions: {
                                              init: []
                                            },
                                            slots: {
                                              tab0: {
                                                componentList: [
                                                  {
                                                    id: nextComponentId(),
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
                                                    slots: {
                                                      content: {
                                                        componentList: [
                                                          {
                                                            id: nextComponentId(),
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
                                                            slots: {
                                                              content: {
                                                                componentList: [
                                                                  {
                                                                    id: nextComponentId(),
                                                                    definitionId: 'radio',
                                                                    styles: {
                                                                      xl: {
                                                                        visible: true,
                                                                        direction: 'column',
                                                                        justify: 'flex-start',
                                                                        align: 'flex-start',
                                                                        size: {
                                                                          widthValue: 200,
                                                                          widthUnit: 'px',
                                                                          widthAuto: true,
                                                                          heightValue: 36,
                                                                          heightUnit: 'px',
                                                                          heightAuto: true
                                                                        },
                                                                        overflowX: 'visible',
                                                                        overflowY: 'visible'
                                                                      }
                                                                    },
                                                                    properties: {
                                                                      name: 'Radio',
                                                                      status: 'basic',
                                                                      options: [
                                                                        {
                                                                          value: 'View Pages'
                                                                        },
                                                                        {
                                                                          value: 'View Orders'
                                                                        },
                                                                        {
                                                                          value: 'View Products'
                                                                        }
                                                                      ]
                                                                    },
                                                                    actions: {
                                                                      change: []
                                                                    },
                                                                    slots: {},
                                                                    index: 0
                                                                  }
                                                                ],
                                                                id: nextComponentId()
                                                              }
                                                            },
                                                            index: 0
                                                          },
                                                          {
                                                            id: nextComponentId(),
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
                                                            slots: {
                                                              content: {
                                                                componentList: [
                                                                  {
                                                                    id: nextComponentId(),
                                                                    definitionId: 'radio',
                                                                    styles: {
                                                                      xl: {
                                                                        visible: true,
                                                                        direction: 'column',
                                                                        justify: 'flex-start',
                                                                        align: 'flex-start',
                                                                        size: {
                                                                          widthValue: 200,
                                                                          widthUnit: 'px',
                                                                          widthAuto: true,
                                                                          heightValue: 36,
                                                                          heightUnit: 'px',
                                                                          heightAuto: true
                                                                        },
                                                                        overflowX: 'visible',
                                                                        overflowY: 'visible'
                                                                      }
                                                                    },
                                                                    properties: {
                                                                      name: '15796026816590.45381112645985144',
                                                                      status: 'basic',
                                                                      options: [
                                                                        {
                                                                          value: 'Edit Pages'
                                                                        },
                                                                        {
                                                                          value: 'Edit  Orders'
                                                                        },
                                                                        {
                                                                          value: 'Edit  Products'
                                                                        }
                                                                      ]
                                                                    },
                                                                    actions: {
                                                                      change: []
                                                                    },
                                                                    slots: {},
                                                                    index: 0
                                                                  }
                                                                ],
                                                                id: nextComponentId()
                                                              }
                                                            },
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
                                              },
                                              tab1: {
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
                                                          type: 'auto',
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
                                                    slots: {
                                                      content: {
                                                        componentList: [
                                                          {
                                                            id: nextComponentId(),
                                                            definitionId: 'radio',
                                                            styles: {
                                                              xl: {
                                                                visible: true,
                                                                direction: 'column',
                                                                justify: 'flex-start',
                                                                align: 'flex-start',
                                                                size: {
                                                                  widthValue: 200,
                                                                  widthUnit: 'px',
                                                                  widthAuto: true,
                                                                  heightValue: 36,
                                                                  heightUnit: 'px',
                                                                  heightAuto: true
                                                                },
                                                                overflowX: 'visible',
                                                                overflowY: 'visible'
                                                              }
                                                            },
                                                            properties: {
                                                              name: 'Radio',
                                                              status: 'basic',
                                                              options: [
                                                                {
                                                                  value: 'Delete Pages'
                                                                },
                                                                {
                                                                  value: 'Delete Orders'
                                                                },
                                                                {
                                                                  value: 'Delete Products'
                                                                }
                                                              ]
                                                            },
                                                            actions: {
                                                              change: []
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
                                              }
                                            },
                                            index: 0
                                          }
                                        ],
                                        id: nextComponentId()
                                      }
                                    },
                                    index: 3
                                  }
                                ],
                                id: nextComponentId()
                              }
                            },
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
          }
        ],
        id: nextComponentId()
      },
      footer: {
        componentList: [
          {
            id: nextComponentId(),
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
                  type: 'auto',
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
            slots: {
              content: {
                componentList: [
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
                        iconPlacement: 'none',
                        visible: true
                      }
                    },
                    properties: {
                      text: 'CREATE USER',
                      status: 'primary',
                      disabled: false,
                      appearance: 'filled',
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
