import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BuilderComponent } from './builder.component';

const routes: Routes = [
  {
    path     : '',
    component: BuilderComponent,
    children : [
      {
        path        : '',
        loadChildren: () => import('@kitchen').then(it => it.KitchenModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuilderRoutingModule {
}
