import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiLogComponent } from './api-log/api-log.component';
import { SampleApiLogComponent } from './sample-api-log/sample-api-log.component';

const routes: Routes = [
  { path: '', redirectTo: 'api-log', pathMatch: 'full' },
  { path: 'api-log', component: ApiLogComponent },
  { path: 'sample-api-log', component: SampleApiLogComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerLogRoutingModule {
}
