import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { DesignComponent } from './design/design.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectSettingsCodeComponent } from './project-settings/project-settings-code/project-settings-code.component';
import { ProjectSettingsGeneralComponent } from './project-settings/project-settings-general/project-settings-general.component';
import { ProjectSettingsHostingComponent } from './project-settings/project-settings-hosting/project-settings-hosting.component';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { CreateProjectComponent } from './projects/create-project-page/create-project-page.component';
import { ProjectsComponent } from './projects/projects.component';

import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  {
    path     : '',
    component: AccountComponent,
    children : [
      {
        path      : '',
        redirectTo: './projects',
        pathMatch : 'full'
      },
      {
        path     : 'design',
        component: DesignComponent
      },
      {
        path     : 'projects',
        component: ProjectsComponent
      },
      {
        path     : 'projects/create',
        component: CreateProjectComponent
      },
      {
        path     : 'projects/:id',
        component: ProjectSettingsComponent,
        children : [
          {
            path     : '',
            component: ProjectSettingsGeneralComponent
          },
          {
            path     : 'code',
            component: ProjectSettingsCodeComponent
          },
          {
            path     : 'hosting',
            component: ProjectSettingsHostingComponent
          }
        ]
      }

    ]
  },
  {
    path     : 'account',
    component: AccountComponent,
    children : [
      {
        path     : 'settings',
        component: SettingsComponent,
        children : [
          {
            path     : 'profile',
            component: ProfileComponent
          },
          // {
          //   path     : 'billing',
          //   component: BillingComponent
          // },
          { path: '', pathMatch: 'full', redirectTo: 'profile' }
        ]
      },
      // {
      //   path     : 'plans',
      //   component: PlansComponent
      // },
      { path: '', pathMatch: 'full', redirectTo: 'projects' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
