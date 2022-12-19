import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuardFn } from '@auth/auth-guard.service';
import { PermissionCode } from '@devops-tools/api-interfaces';
import { WorkbenchComponent } from './workbench.component';

const routes: Routes = [
  {
    path            : '',
    component       : WorkbenchComponent,
    canActivateChild: [
      authGuardFn([PermissionCode.R_WORKBENCH])
    ],
    children        : [
      // including projects, account
      { path: '', loadChildren: () => import('./account/account.module').then(it => it.AccountModule) }
    ]
  },
  {
    path        : 'backend-tools',
    loadChildren: () => import('./backend-tools/backend-tools.module').then(m => m.BackendToolsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkbenchRoutingModule {
}
