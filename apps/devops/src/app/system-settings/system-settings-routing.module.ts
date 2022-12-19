import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { authGuardFn } from '@auth/auth-guard.service';
import { PermissionCode } from '@devops-tools/api-interfaces';
import { TriFormModule } from '@gradii/triangle/form';
import { ConfigMemberPermissionCodeComponent } from './config-member-permission-code/config-member-permission-code.component';
import { ConfigMemberComponent } from './config-member/config-member.component';
import { ConfigPermissionRoleComponent } from './config-permission-role/config-permission-role.component';

const routes: Routes = [
  {
    path            : 'config-member',
    canActivateChild: [
      authGuardFn([PermissionCode.R_SYSTEM_SETTINGS, PermissionCode.R_SYSTEM_SETTINGS_CONFIG_MEMBER])
    ],
    component       : ConfigMemberComponent
  },
  {
    path            : 'config-member-permission-code',
    canActivateChild: [
      authGuardFn([PermissionCode.R_SYSTEM_SETTINGS, PermissionCode.R_SYSTEM_SETTINGS_CONFIG_MEMBER_PERMISSION_CODE])
    ],
    component       : ConfigMemberPermissionCodeComponent
  },
  {
    path            : 'config-permission-role',
    canActivateChild: [
      authGuardFn([PermissionCode.R_SYSTEM_SETTINGS, PermissionCode.R_SYSTEM_SETTINGS_CONFIG_PERMISSION_ROLE])
    ],
    component       : ConfigPermissionRoleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemSettingsRoutingModule {
}
