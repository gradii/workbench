import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { AuthGuard } from '@auth/auth-guard.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { AccountThemeComponent } from './account-theme.component';

const routes: Routes = [
  {
    path: '',
    component: AccountThemeComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        canActivateChild: [AuthGuard]
      },
      {
        path: '',
        loadChildren: () => import('@auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'share',
        loadChildren: () => import('./share/share.module').then(m => m.ShareModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      }
    ]
  },
  {
    path: 'tools',
    loadChildren: () => import('./tools/tools.module').then(m => m.ToolsModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: '**',
    component: AccountThemeComponent,
    children: [{ path: '', component: NotFoundComponent }]
  }
];

const formBuilderRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./form-builder/form-builder.module').then(m => m.FormBuilderModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(environment.formBuilder ? formBuilderRoutes : routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
