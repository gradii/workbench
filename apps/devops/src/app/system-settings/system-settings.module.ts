import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriDataTableModule } from '@gradii/triangle/data-table';
import { TriDialogModule } from '@gradii/triangle/dialog';
import { TriFormModule } from '@gradii/triangle/form';
import { TriInputModule } from '@gradii/triangle/input';
import { TriSelectModule } from '@gradii/triangle/select';
import { ConfigMemberPermissionCodeComponent } from './config-member-permission-code/config-member-permission-code.component';
import { ImportPermissionCodesComponent } from './config-member-permission-code/dialogs/import-permission-codes/import-permission-codes.component';
import { ConfigMemberComponent } from './config-member/config-member.component';
import { AddMemberComponent } from './config-member/dialogs/add-member/add-member.component';
import { EditRoleComponent } from './config-member/dialogs/edit-role/edit-role.component';
import { ConfigPermissionRoleComponent } from './config-permission-role/config-permission-role.component';
import { AddRoleComponent } from './config-permission-role/diglogs/add-role/add-role.component';

import { SystemSettingsRoutingModule } from './system-settings-routing.module';
import { TriCardModule } from '@gradii/triangle/card';


@NgModule({
  declarations: [

    ConfigPermissionRoleComponent,

    ConfigMemberComponent,

    ConfigMemberPermissionCodeComponent,

    EditRoleComponent,

    AddRoleComponent,

    AddMemberComponent,

    ImportPermissionCodesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    SystemSettingsRoutingModule,
    TriFormModule,
    TriButtonModule,
    TriDataTableModule,
    TriDialogModule,
    TriSelectModule,
    TriCardModule,
    TriInputModule,
  ]
})
export class SystemSettingsModule {
}
