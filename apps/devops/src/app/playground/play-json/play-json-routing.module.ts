import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JsonEditorComponent } from './json-editor/json-editor.component';

const routes: Routes = [
  { path: '', redirectTo: 'json-editor' },
  { path: 'json-editor', component: JsonEditorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayJsonRoutingModule {
}
