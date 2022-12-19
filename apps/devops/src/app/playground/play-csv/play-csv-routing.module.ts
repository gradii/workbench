import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParseCsvComponent } from './parse-csv/parse-csv.component';

const routes: Routes = [
  { path: 'parse-csv', component: ParseCsvComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayCsvRoutingModule {
}
