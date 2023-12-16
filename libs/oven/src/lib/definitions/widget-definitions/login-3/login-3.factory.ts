import { nextComponentId, OvenComponent } from '@common';

// tslint:disable:max-line-length
export function login3Factory(): OvenComponent {
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
          heightValue: 350,
          heightUnit: 'px',
          heightAuto: false
        },
        margins: {
          marginTop: 0,
          marginTopUnit: 'px'
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
      name: 'OnboardingLoginContainer'
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
                          type: 'custom',
                          customValue: 100,
                          customUnit: '%'
                        },
                        overflowX: 'visible',
                        overflowY: 'visible',
                        width: {
                          type: 'custom',
                          customUnit: 'col',
                          customValue: 6
                        },
                        paddings: {
                          paddingBottom: 0,
                          paddingBottomUnit: 'px',
                          paddingLeft: 0,
                          paddingLeftUnit: 'px',
                          paddingTop: 24,
                          paddingTopUnit: 'px',
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
                                direction: 'row',
                                justify: 'center',
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
                                justify: 'center',
                                align: 'center',
                                height: {
                                  type: 'custom',
                                  customValue: 30,
                                  customUnit: '%'
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
                                      text: 'Welcome',
                                      type: 'h4',
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
                            index: 1
                          },
                          {
                            id: nextComponentId(),
                            definitionId: 'space',
                            styles: {
                              xl: {
                                direction: 'row',
                                justify: 'center',
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
                                          marginBottom: 0,
                                          marginBottomUnit: 'px'
                                        },
                                        visible: true
                                      }
                                    },
                                    properties: {
                                      text: 'We are glad to have you on board!',
                                      type: 'paragraph',
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
                            slots: {
                              content: {
                                componentList: [
                                  {
                                    id: nextComponentId(),
                                    definitionId: 'buttonLink',
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
                                      text: 'Create Account',
                                      status: 'primary',
                                      disabled: false,
                                      appearance: 'filled',
                                      icon: 'star',
                                      url: {
                                        path: '',
                                        external: true
                                      },
                                      name: 'ButtonLink'
                                    },
                                    slots: {},
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
                          type: 'custom',
                          customValue: 100,
                          customUnit: '%'
                        },
                        overflowX: 'visible',
                        overflowY: 'visible',
                        width: {
                          type: 'custom',
                          customUnit: 'col',
                          customValue: 6
                        },
                        paddings: {
                          paddingLeft: 8,
                          paddingLeftUnit: 'px',
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
                                      text: 'Login',
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
                                  customValue: 50,
                                  customUnit: '%'
                                },
                                overflowX: 'visible',
                                overflowY: 'visible',
                                width: {
                                  type: 'custom',
                                  customUnit: 'col',
                                  customValue: 12
                                },
                                paddings: {
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
                                          marginBottom: 4,
                                          marginBottomUnit: 'px'
                                        },
                                        visible: true
                                      }
                                    },
                                    properties: {
                                      text: 'Password',
                                      type: 'label',
                                      color: 'basic',
                                      italic: false,
                                      bold: false,
                                      underline: false,
                                      name: 'Text'
                                    },
                                    slots: {},
                                    index: 2
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
                                      type: 'password',
                                      name: 'Input'
                                    },
                                    actions: {
                                      type: []
                                    },
                                    slots: {},
                                    index: 3
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
                                    definitionId: 'checkbox',
                                    styles: {
                                      xl: {
                                        visible: true
                                      }
                                    },
                                    properties: {
                                      label: 'Remember me',
                                      status: 'success',
                                      disabled: false,
                                      name: 'Checkbox'
                                    },
                                    actions: {
                                      change: []
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
                                      text: 'Login',
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
                              container: false,
                              name: 'Space'
                            },
                            actions: {
                              init: [],
                              click: []
                            },
                            slots: {
                              content: {
                                componentList: [],
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
  };
}
