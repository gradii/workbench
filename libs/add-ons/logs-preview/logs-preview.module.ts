import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from './codemirror/codemirror.module';
import { LogsPreviewComponent } from './logs-preview.component';


@NgModule({
  declarations: [LogsPreviewComponent],
  exports     : [LogsPreviewComponent],
  imports     : [
    CommonModule,
    FormsModule,
    CodemirrorModule
  ]
})
export class LogsPreviewModule {
}
