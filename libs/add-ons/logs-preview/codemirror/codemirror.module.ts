import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CodemirrorComponent } from './codemirror.component';

@NgModule({
  declarations: [CodemirrorComponent],
  imports     : [CommonModule],
  exports     : [CodemirrorComponent],
  providers   : []
})
export class CodemirrorModule {
}
