import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkflowFrontendToolComponent } from './workflow-frontend-tool.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowFrontendToolComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowFrontendRoutingModule {
}
