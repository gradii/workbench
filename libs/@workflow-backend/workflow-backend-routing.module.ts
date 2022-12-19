import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkflowBackendToolComponent } from './workflow-backend-tool.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowBackendToolComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowBackendRoutingModule {
}
