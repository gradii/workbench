import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaygroundComponent } from './playground.component';
import { authGuardFn } from '@auth/auth-guard.service';
import { PermissionCode } from '@devops-tools/api-interfaces';
import { PlayCronEditorComponent } from './play-cron-editor/play-cron-editor.component';

const routes: Routes = [
  {
    path            : '', component: PlaygroundComponent,
    canActivateChild: [
      authGuardFn([PermissionCode.R_PLAYGROUND])
    ],
    children        : [
      {
        path            : 'play-csv',
        canActivateChild: [
          authGuardFn([PermissionCode.R_PLAYGROUND, PermissionCode.R_PLAYGROUND_PLAY_CSV])
        ],
        loadChildren    : () => import('./play-csv/play-csv.module').then(it => it.PlayCsvModule)
      },
      {
        path            : 'play-json',
        canActivateChild: [
          authGuardFn([PermissionCode.R_PLAYGROUND, PermissionCode.R_PLAYGROUND_PLAY_JSON])
        ],
        loadChildren    : () => import('./play-json/play-json.module').then(it => it.PlayJsonModule)
      },
      {
        path            : 'play-api',
        canActivateChild: [
          authGuardFn([PermissionCode.R_PLAYGROUND, PermissionCode.R_PLAYGROUND_PLAY_API])
        ],
        loadChildren    : () => import('./play-api/play-api.module').then(it => it.PlayApiModule)
      },
      {
        path            : 'play-cron-editor',
        canActivateChild: [
          authGuardFn([PermissionCode.R_PLAYGROUND, PermissionCode.R_PLAYGROUND_PLAY_API])
        ],
        component       : PlayCronEditorComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaygroundRoutingModule {
}
