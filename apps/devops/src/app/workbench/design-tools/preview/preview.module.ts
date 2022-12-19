import { NgModule } from '@angular/core';
import { BakeryCommonModule } from '@common';
import { TriLayoutModule } from '@gradii/triangle/layout';

import { PreviewRoutingModule } from './preview-routing.module';
import { PreviewComponent } from './preview.component';

@NgModule({
  imports: [BakeryCommonModule, PreviewRoutingModule, TriLayoutModule],
  declarations: [PreviewComponent],
  providers: []
})
export class PreviewModule {
}
