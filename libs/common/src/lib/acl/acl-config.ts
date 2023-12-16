import { NbAclOptions } from '@nebular/security';

export const aclConfig: NbAclOptions = {
  accessControl: {
    generateUICode: {
      generate: ['components']
    },
    generateDataCode: {
      generate: ['data']
    },
    useProjectTemplate: {
      use: ['free_project_template', 'light_project_template', 'standard_project_template']
    },
    projectCreator: {
      create: ['project']
    },
    themeCreator: {
      create: ['theme']
    },
    pageCreator: {
      create: ['page']
    },
    pageOpener: {
      open: []
    },
    widgetAdder: {
      add: [
        'Login',
        'Register',
        'Statistics',
        'Contacts',
        'Login 2',
        'Login 3',
        'Multi Column Form',
        'Orders',
        'Profile',
        'Register 2',
        'Status Card',
        'Status Chart',
        'Status Chart 2',
        'Tasks',
        'Users'
      ]
    },
    accessFeatureAmplify: {
      use: ['amplify']
    },
    extendedThemeSettings: {
      use: ['extendedThemeSettings']
    },
    pageImporter: {
      use: ['pageImport']
    }
  }
};

export interface PlanConfig {
  privileges: string[];
  limits: {
    projects: number;
    themes: number;
    pages: number;
  };
}

export const plansConfig = {
  free: {
    privileges: ['useProjectTemplate', 'widgetAdder', 'pageOpener'],
    limits: {
      projects: 1,
      themes: 2,
      pages: Infinity
    }
  },
  template: {
    privileges: ['useProjectTemplate', 'widgetAdder', 'pageOpener', 'generateUICode'],
    limits: {
      projects: 6,
      themes: 2,
      pages: Infinity
    }
  },
  light: {
    privileges: [
      'useProjectTemplate',
      'widgetAdder',
      'pageOpener',
      'generateUICode',
      'pageImporter',
      'extendedThemeSettings'
    ],
    limits: {
      projects: Infinity,
      themes: Infinity,
      pages: Infinity
    }
  },
  standard: {
    privileges: [
      'useProjectTemplate',
      'widgetAdder',
      'pageOpener',
      'generateUICode',
      'pageImporter',
      'extendedThemeSettings',
      'generateDataCode'
    ],
    limits: {
      projects: Infinity,
      themes: Infinity,
      pages: Infinity
    }
  },
  admin: {
    privileges: [
      'useProjectTemplate',
      'widgetAdder',
      'pageOpener',
      'extendedWidgetAdder',
      'extendedThemeSettings',
      'pageImporter',
      'generateDataCode',
      'generateUICode'
    ],
    limits: {
      projects: Infinity,
      themes: Infinity,
      pages: Infinity
    }
  }
};
