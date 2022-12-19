import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiActionComponent } from './api-action/api-action.component';
import { ApiWorkflowComponent } from './api-workflow/api-workflow.component';

const routes: Routes = [
  { path: '', redirectTo: 'api-action' },
  { path: 'api-action', component: ApiActionComponent },

  {
    path     : 'api-workflow',
    component: ApiWorkflowComponent,
    children : [
      { path: '', loadChildren: () => import('@workflow-backend/workflow-backend.module').then(it => it.WorkflowBackendModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayApiRoutingModule {
}
