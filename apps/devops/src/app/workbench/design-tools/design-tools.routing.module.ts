import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
// import { NotFoundComponent } from '../not-found/not-found.component';
import { ProjectPreloadResolver } from './project-preload-resolver.service';
import { DesignToolsComponent } from './design-tools.component';

// TODO use new lazy declaration when it will be fixed
export const routes: Routes = [
  {
    path     : ':projectId',
    component: DesignToolsComponent,
    resolve  : { projectLoaded: ProjectPreloadResolver },
    children : [
      {
        path        : 'builder',
        loadChildren: () => import('@builder/builder.module').then(m => m.BuilderModule),
        data        : {
          mode     : WorkingAreaMode.BUILDER,
          animation: WorkingAreaMode.BUILDER
        }
      },
      // {
      //   path        : 'data',
      //   loadChildren: () => import('@workflow-frontend/workflow-frontend.module').then(m => m.WorkflowFrontendModule),
      //   data        : {
      //     mode     : WorkingAreaMode.DATA,
      //     animation: WorkingAreaMode.DATA
      //   }
      // },
      {
        path        : 'painter',
        loadChildren: () => import('./painter/painter.module').then(m => m.PainterModule),
        data        : {
          mode     : WorkingAreaMode.PAINTER,
          animation: WorkingAreaMode.PAINTER
        }
      },
      {
        path        : 'preview',
        loadChildren: () => import('./preview/preview.module').then(m => m.PreviewModule),
        data        : {
          mode     : WorkingAreaMode.PREVIEW,
          animation: WorkingAreaMode.PREVIEW
        }
      },
      { path: '', redirectTo: 'builder', pathMatch: 'full' }
    ]
  },
  // { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  declarations: [
  ],
  exports: [RouterModule]
})
export class DesignToolsRoutingModule {
}
