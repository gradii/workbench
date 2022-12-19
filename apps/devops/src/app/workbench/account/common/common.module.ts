import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BakeryCommonModule } from '@common';

import { SubheaderComponent } from './subheader.component';
import { TriButtonModule } from '@gradii/triangle/button';

@NgModule({
  imports     : [CommonModule, BakeryCommonModule, TriButtonModule],
  declarations: [SubheaderComponent],
  exports     : [SubheaderComponent]
})
export class AccountCommonModule {
}
