import { NgModule } from '@angular/core';
import { WorkflowCommonModule } from '../@workflow-common/workflow-common.module';
import { WorkflowBackendRoutingModule } from './workflow-backend-routing.module';
import { WorkflowBackendToolComponent } from './workflow-backend-tool.component';

@NgModule({
  declarations: [
    WorkflowBackendToolComponent,
  ],
  imports     : [
    WorkflowCommonModule,
    WorkflowBackendRoutingModule,
  ],
  providers   : [],
  exports     : [
    WorkflowBackendToolComponent
  ]
})
export class WorkflowBackendModule {
}
