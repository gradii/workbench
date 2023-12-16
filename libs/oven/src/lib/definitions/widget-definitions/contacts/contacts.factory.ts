import { nextComponentId, OvenComponent } from '@common';

// tslint:disable:max-line-length
export function contactsFactory(): OvenComponent {
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
      name: 'Contacts',
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
                              text: 'My contacts                                          ',
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
                              text: '223 contacts',
                              type: 'label',
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
                                  widthValue: 40,
                                  widthUnit: 'px',
                                  widthAuto: false,
                                  heightValue: 200,
                                  heightUnit: 'px',
                                  heightAuto: true
                                },
                                fit: 'fill',
                                radius: {
                                  value: 100,
                                  unit: 'px'
                                },
                                margins: {
                                  marginTop: 4,
                                  marginTopUnit: 'px',
                                  marginBottom: 4,
                                  marginBottomUnit: 'px'
                                },
                                visible: true,
                                src: {
                                  url:
                                    'https://media.creativemornings.com/uploads/user/avatar/2279/kim_face_circle.jpeg',
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
                        justify: 'flex-start',
                        align: 'center',
                        width: {
                          type: 'custom',
                          customUnit: 'col',
                          customValue: 10
                        },
                        paddings: {
                          paddingLeft: 12,
                          paddingLeftUnit: 'px'
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
                              text: 'Andy Kit',
                              type: 'subtitle-2',
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
                        width: {
                          type: 'custom',
                          customUnit: 'col',
                          customValue: 2
                        },
                        paddings: {
                          paddingTop: 4,
                          paddingTopUnit: 'px',
                          paddingBottom: 4,
                          paddingBottomUnit: 'px'
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
                                  widthValue: 40,
                                  widthUnit: 'px',
                                  widthAuto: false,
                                  heightValue: 40,
                                  heightUnit: 'px',
                                  heightAuto: false
                                },
                                fit: 'cover',
                                radius: {
                                  value: 100,
                                  unit: 'px'
                                },
                                visible: true,
                                src: {
                                  url:
                                    'https://images.unsplash.com/photo-1500522144261-ea64433bbe27?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
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
                    index: 2
                  },
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
                          customValue: 10
                        },
                        paddings: {
                          paddingLeft: 12,
                          paddingLeftUnit: 'px'
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
                              text: 'Anna Guanga',
                              type: 'subtitle-2',
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
                    index: 3
                  },
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
                          customValue: 2
                        },
                        paddings: {
                          paddingTop: 4,
                          paddingTopUnit: 'px',
                          paddingBottom: 4,
                          paddingBottomUnit: 'px'
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
                                  widthValue: 40,
                                  widthUnit: 'px',
                                  widthAuto: false,
                                  heightValue: 200,
                                  heightUnit: 'px',
                                  heightAuto: true
                                },
                                fit: 'fill',
                                radius: {
                                  value: 100,
                                  unit: 'px'
                                },
                                visible: true,
                                src: {
                                  url:
                                    'https://images.unsplash.com/photo-1506919258185-6078bba55d2a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1630&q=80',
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
                    index: 4
                  },
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
                          customValue: 10
                        },
                        paddings: {
                          paddingLeft: 12,
                          paddingLeftUnit: 'px'
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
                              text: 'Kevin Bull',
                              type: 'subtitle-2',
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
                        align: 'center',
                        width: {
                          type: 'custom',
                          customUnit: 'col',
                          customValue: 2
                        },
                        paddings: {
                          paddingBottom: 4,
                          paddingBottomUnit: 'px',
                          paddingTop: 4,
                          paddingTopUnit: 'px'
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
                                  widthValue: 40,
                                  widthUnit: 'px',
                                  widthAuto: false,
                                  heightValue: 40,
                                  heightUnit: 'px',
                                  heightAuto: false
                                },
                                fit: 'cover',
                                radius: {
                                  value: 100,
                                  unit: 'px'
                                },
                                visible: true,
                                src: {
                                  url:
                                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80',
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
                    index: 6
                  },
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
                          customValue: 10
                        },
                        paddings: {
                          paddingLeft: 12,
                          paddingLeftUnit: 'px'
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
                              text: 'Leo Natan',
                              type: 'subtitle-2',
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
                    index: 7
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
                      text: 'Other contacts                                      ',
                      type: 'subtitle-2',
                      color: 'primary',
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
            index: 0
          }
        ],
        id: nextComponentId()
      }
    },
    index: 0
  };
}
