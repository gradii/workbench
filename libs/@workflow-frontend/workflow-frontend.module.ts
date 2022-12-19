import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriCardModule } from '@gradii/triangle/card';
import { TriDialogModule } from '@gradii/triangle/dialog';
import { WorkflowCommonModule } from '../@workflow-common/workflow-common.module';
import { WorkflowFrontendDialogService } from './dialog/workflow-frontend-dialog.service';
import { WorkflowFrontendRoutingModule } from './workflow-frontend-routing.module';
import { WorkflowFrontendToolComponent } from './workflow-frontend-tool.component';
import { TriIconModule } from '@gradii/triangle/icon';

@NgModule({
  declarations: [
    WorkflowFrontendToolComponent
  ],
  imports     : [
    CommonModule,
    WorkflowCommonModule,
    WorkflowFrontendRoutingModule,

    TriCardModule,
    TriDialogModule,
    TriIconModule
  ],
  providers   : [
    WorkflowFrontendDialogService
  ],
  exports     : [
    WorkflowFrontendToolComponent
  ]
})
export class WorkflowFrontendModule {
}
