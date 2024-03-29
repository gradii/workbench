import { nextComponentId, OvenComponent } from '@common';

// tslint:disable:max-line-length
export function login2Factory(): OvenComponent {
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
          marginBottom: 0,
          marginBottomUnit: 'px'
        },
        visible: true,
        accent: 'primary',
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
      name: 'SocialLoginContainer',
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
                        justify: 'center',
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
                      name: 'SignUpForm',
                      container: true
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
                    index: 0
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
                          customValue: 10
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
                            definitionId: 'link',
                            styles: {
                              xl: {
                                visible: true
                              }
                            },
                            properties: {
                              text: 'Forgot password?',
                              color: 'primary',
                              italic: false,
                              bold: false,
                              underline: true,
                              url: {
                                path: '',
                                external: true
                              },
                              name: 'Link'
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
                          customValue: 2
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
                              text: 'Or login with',
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
                      }
                    },
                    index: 3
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
                direction: 'column',
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
                                margins: {
                                  marginRight: 16,
                                  marginRightUnit: 'px'
                                },
                                visible: true
                              }
                            },
                            properties: {
                              text: 'Facebook',
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
                          },
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
                                margins: {
                                  marginRight: 16,
                                  marginRightUnit: 'px'
                                },
                                visible: true
                              }
                            },
                            properties: {
                              text: 'Twitter',
                              status: 'info',
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
                            index: 1
                          },
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
                              text: 'Google',
                              status: 'danger',
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
                            index: 2
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
    index: 0
  };
}
