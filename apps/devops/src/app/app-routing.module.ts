import { NgModule } from '@angular/core';

import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { PuffAppWorkspace } from './puff-app/puff-app-workspace';

const routes: Routes = [
  //带侧边栏
  {
    path            : '',
    canActivateChild: [AuthGuard],
    component       : HomeComponent,
    children        : [
      { path: '', redirectTo: 'v2', pathMatch: 'full' },
      // { path: 'v1', loadChildren: () => import('./v1/v1.module').then(it => it.V1Module) },
      {
        path        : 'v2',
        loadChildren: () => import('./v2/v2.module').then(it => it.V2Module)
      },
      {
        path        : 'playground',
        loadChildren: () => import('./playground/playground.module').then(it => it.PlaygroundModule)
      },

      {
        path        : 'backend-monitor',
        loadChildren: () => import('./backend-monitor/backend-monitor.module').then(it => it.BackendMonitorModule)
      },
      {
        path        : 'system-settings',
        loadChildren: () => import('./system-settings/system-settings.module').then(it => it.SystemSettingsModule)
      }
    ]
  },
  //全窗口模式
  {
    path            : '',
    canActivateChild: [AuthGuard],
    component       : PuffAppWorkspace,
    children        : [
      {
        path        : 'workbench',
        loadChildren: () => import('./workbench/workbench.module').then(it => it.WorkbenchModule)
      }
    ]
  },
  {
    path            : 'workbench/design-tools',
    canActivateChild: [AuthGuard],
    loadChildren    : () => import('./workbench/design-tools/design-tools.module').then(m => m.DesignToolsModule)
  },
  { path: '', loadChildren: () => import('@auth/auth.module').then(it => it.AuthModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preloadingStrategy    : PreloadAllModules,
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
