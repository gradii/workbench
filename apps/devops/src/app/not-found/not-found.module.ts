import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriLayoutModule } from '@gradii/triangle/layout';

import { NotFoundComponent } from './not-found.component';

@NgModule({
  imports: [CommonModule, RouterModule, TriLayoutModule, TriButtonModule],
  exports     : [NotFoundComponent],
  declarations: [NotFoundComponent],
  providers   : []
})
export class NotFoundModule {
}
