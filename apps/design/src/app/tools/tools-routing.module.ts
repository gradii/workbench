import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { ToolsComponent } from './tools.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { ProjectPreloadResolver } from './project-preload-resolver.service';

// TODO use new lazy declaration when it will be fixed
export const routes: Routes = [
  {
    path: ':projectId',
    component: ToolsComponent,
    resolve: { projectLoaded: ProjectPreloadResolver },
    children: [
      {
        path: 'builder',
        loadChildren: () => import('./builder/builder.module').then(m => m.BuilderModule),
        data: {
          mode: WorkingAreaMode.BUILDER,
          animation: WorkingAreaMode.BUILDER
        }
      },
      {
        path: 'painter',
        loadChildren: () => import('./painter/painter.module').then(m => m.PainterModule),
        data: {
          mode: WorkingAreaMode.PAINTER,
          animation: WorkingAreaMode.PAINTER
        }
      },
      {
        path: 'preview',
        loadChildren: () => import('./preview/preview.module').then(m => m.PreviewModule),
        data: {
          mode: WorkingAreaMode.PREVIEW,
          animation: WorkingAreaMode.PREVIEW
        }
      },
      {
        path: 'data',
        loadChildren: () => import('./workflow/workflow.module').then(m => m.WorkflowModule),
        data: {
          mode: WorkingAreaMode.DATA,
          animation: WorkingAreaMode.DATA
        }
      },
      { path: '', redirectTo: 'builder', pathMatch: 'full' }
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule {
}
