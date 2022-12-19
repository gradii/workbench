import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayJsonRoutingModule } from './play-json-routing.module';
import { JsonEditorComponent } from './json-editor/json-editor.component';


@NgModule({
  declarations: [JsonEditorComponent],
  imports     : [
    CommonModule,
    PlayJsonRoutingModule
  ]
})
export class PlayJsonModule {
}
