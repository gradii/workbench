import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkflowToolComponent } from './workflow-tool.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowToolComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule {
}
