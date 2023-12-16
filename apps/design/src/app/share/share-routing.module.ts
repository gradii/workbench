import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShareComponent } from './share.component';
import { NotFoundComponent } from '../not-found/not-found.component';

const routes: Routes = [
  {
    path: ':shareId',
    component: ShareComponent
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShareRoutingModule {
}
