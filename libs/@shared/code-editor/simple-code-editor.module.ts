import { NgModule } from '@angular/core';
import { SimpleCodeEditorComponent } from './simple-code-editor.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [SimpleCodeEditorComponent],
  exports: [SimpleCodeEditorComponent]
})
export class SimpleCodeEditorModule {
}
