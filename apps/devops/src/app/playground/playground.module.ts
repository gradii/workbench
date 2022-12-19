import { NgModule } from '@angular/core';
import { PlaygroundRoutingModule } from './playground-routing.module';
import { CommonModule } from '@angular/common';
import { PlaygroundComponent } from './playground.component';
import { PlayCronComponent } from './play-cron/play-cron.component';
import { PlayCronEditorComponent } from './play-cron-editor/play-cron-editor.component';

@NgModule({
  imports     : [
    CommonModule,
    PlaygroundRoutingModule,

  ],
  declarations: [
    PlaygroundComponent,
    PlayCronComponent,
    PlayCronEditorComponent

  ],
  providers   : []
})
export class PlaygroundModule {
}
