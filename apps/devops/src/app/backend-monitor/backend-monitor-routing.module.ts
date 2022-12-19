import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'server-log', pathMatch: 'full' },
  { path: 'server-log', loadChildren: () => import('./server-log/server-log.module').then(it => it.ServerLogModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackendMonitorRoutingModule {
}
