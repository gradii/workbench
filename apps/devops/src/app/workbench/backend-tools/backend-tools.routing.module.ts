import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackendToolsComponent } from './backend-tools.component';
import { ProjectPreloadResolver } from './project-preload-resolver.service';
import { WorkingAreaMode, WorkingAreaWorkflowMode } from '@tools-state/working-area/working-area.model';
import { ConfigUiCronComponent } from './config-ui-cron/config-ui-cron.component';
import { ConfigWorkflowComponent } from './config-workflow/config-workflow.component';

export const routes: Routes = [
  {
    path     : ':projectId',
    component: BackendToolsComponent,
    resolve  : { projectLoaded: ProjectPreloadResolver },
    children : [
      {
        path     : 'trigger',
        component: ConfigUiCronComponent
      },
      {
        path     : 'workflow',
        component: ConfigWorkflowComponent,
        children : [
          {
            path        : '',
            loadChildren: () => import('@workflow-backend/workflow-backend.module').then(m => m.WorkflowBackendModule),
            data        : {
              mode     : WorkingAreaMode.DATA,
              animation: WorkingAreaMode.DATA,
              workflowMode: WorkingAreaWorkflowMode.BACKEND
            }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackendToolsRoutingModule {
}
