import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbLayoutModule } from '@nebular/theme';

import { NotFoundComponent } from './not-found.component';

@NgModule({
  imports: [CommonModule, RouterModule, NbLayoutModule, NbButtonModule],
  exports: [NotFoundComponent],
  declarations: [NotFoundComponent],
  providers: []
})
export class NotFoundModule {
}
