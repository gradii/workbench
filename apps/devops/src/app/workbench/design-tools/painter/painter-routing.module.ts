import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PainterComponent } from './painter.component';

const routes: Routes = [
  {
    path: '',
    component: PainterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PainterRoutingModule {
}
