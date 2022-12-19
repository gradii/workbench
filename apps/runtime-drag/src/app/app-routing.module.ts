import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TriIconModule } from '@gradii/triangle/icon';
import { PreviewComponent } from './preview/preview.component';
import { RuntimeDragPreviewService } from './preview/runtime-drag-preview.service';

const routes: Routes = [
  { path: '', redirectTo: 'preview', pathMatch: 'full' },
  { path: 'preview', component: PreviewComponent }
];

@NgModule({
  imports     : [
    CommonModule,
    TriIconModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })
  ],
  declarations: [
    // PreviewComponent
  ],
  providers   : [RuntimeDragPreviewService],
  exports     : [RouterModule]
})
export class AppRoutingModule {
}
