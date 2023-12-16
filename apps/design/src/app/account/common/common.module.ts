import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule } from '@nebular/theme';
import { BakeryCommonModule } from '@common';

import { SubheaderComponent } from './subheader.component';

@NgModule({
  imports: [CommonModule, BakeryCommonModule, NbButtonModule],
  declarations: [SubheaderComponent],
  exports: [SubheaderComponent]
})
export class AccountCommonModule {
}
