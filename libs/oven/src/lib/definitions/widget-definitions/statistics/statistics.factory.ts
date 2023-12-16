import { nextComponentId, OvenComponent } from '@common';

// tslint:disable:max-line-length
export function statisticsFactory(): OvenComponent {
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
      name: 'Statistics',
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
                      text: 'Statistics',
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
                      text: 'Refresh',
                      status: 'info',
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
                        align: 'flex-end',
                        height: {
                          type: 'custom',
                          customValue: 40,
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
                            definitionId: 'heading',
                            styles: {
                              xl: {
                                direction: 'row',
                                justify: 'flex-start',
                                align: 'flex-start',
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
                              text: 'Today\'s profit',
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
                        paddings: {
                          paddingRight: 0,
                          paddingRightUnit: 'px',
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
                                  marginBottom: 8,
                                  marginBottomUnit: 'px',
                                  marginLeft: 0,
                                  marginLeftUnit: 'px'
                                },
                                visible: true
                              }
                            },
                            properties: {
                              text: '572,900',
                              type: 'h2',
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
                            definitionId: 'progressBar',
                            styles: {
                              xl: {
                                size: 'medium',
                                margins: {
                                  marginRight: 0,
                                  marginRightUnit: 'px'
                                },
                                visible: true
                              }
                            },
                            properties: {
                              value: 66,
                              status: 'primary',
                              displayValue: false,
                              name: 'ProgressBar'
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
                                  marginTop: 12,
                                  marginTopUnit: 'px',
                                  marginBottom: 0,
                                  marginBottomUnit: 'px'
                                },
                                visible: true
                              }
                            },
                            properties: {
                              text: 'Better than last week (70%)',
                              type: 'caption-2',
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
                    index: 1
                  },
                  {
                    id: nextComponentId(),
                    definitionId: 'space',
                    styles: {
                      xl: {
                        direction: 'row',
                        justify: 'flex-start',
                        align: 'flex-end',
                        height: {
                          type: 'custom',
                          customValue: 40,
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
                          paddingTop: 0,
                          paddingTopUnit: 'px'
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
                              text: 'New orders',
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
                      }
                    },
                    index: 2
                  },
                  {
                    id: nextComponentId(),
                    definitionId: 'space',
                    styles: {
                      xl: {
                        direction: 'column',
                        justify: 'flex-start',
                        align: 'flex-start',
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
                                  marginBottom: 8,
                                  marginBottomUnit: 'px',
                                  marginLeft: 0,
                                  marginLeftUnit: 'px'
                                },
                                visible: true
                              }
                            },
                            properties: {
                              text: '6,387',
                              type: 'h2',
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
                            definitionId: 'progressBar',
                            styles: {
                              xl: {
                                size: 'medium',
                                margins: {
                                  marginRight: 0,
                                  marginRightUnit: 'px'
                                },
                                visible: true
                              }
                            },
                            properties: {
                              value: 45,
                              status: 'primary',
                              displayValue: false,
                              name: 'ProgressBar'
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
                                  marginTop: 12,
                                  marginTopUnit: 'px',
                                  marginBottom: 0,
                                  marginBottomUnit: 'px'
                                },
                                visible: true
                              }
                            },
                            properties: {
                              text: 'Better than last week (30%)',
                              type: 'caption-2',
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
                    index: 3
                  },
                  {
                    id: nextComponentId(),
                    definitionId: 'space',
                    styles: {
                      xl: {
                        direction: 'row',
                        justify: 'flex-start',
                        align: 'flex-end',
                        width: {
                          type: 'custom',
                          customUnit: 'col',
                          customValue: 12
                        },
                        height: {
                          type: 'custom',
                          customValue: 40,
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
                              text: 'New comments',
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
                      }
                    },
                    index: 4
                  },
                  {
                    id: nextComponentId(),
                    definitionId: 'space',
                    styles: {
                      xl: {
                        direction: 'column',
                        justify: 'flex-start',
                        align: 'flex-start',
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
                                  marginBottom: 8,
                                  marginBottomUnit: 'px',
                                  marginLeft: 0,
                                  marginLeftUnit: 'px'
                                },
                                visible: true
                              }
                            },
                            properties: {
                              text: '200',
                              type: 'h2',
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
                            definitionId: 'progressBar',
                            styles: {
                              xl: {
                                size: 'medium',
                                margins: {
                                  marginRight: 0,
                                  marginRightUnit: 'px'
                                },
                                visible: true
                              }
                            },
                            properties: {
                              value: 80,
                              status: 'primary',
                              displayValue: false,
                              name: 'ProgressBar'
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
                                  marginTop: 12,
                                  marginTopUnit: 'px',
                                  marginBottom: 0,
                                  marginBottomUnit: 'px'
                                },
                                visible: true
                              }
                            },
                            properties: {
                              text: 'Better than last week (15%)',
                              type: 'caption-2',
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
                    index: 5
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
