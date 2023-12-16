import { NgModule } from '@angular/core';

import { BkSafePipe } from './safe.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [BkSafePipe],
  exports: [BkSafePipe],
})
export class BkPipeModule {}
