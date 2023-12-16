import { NgModule } from '@angular/core';
import { BakeryCommonModule } from '@common';
import { NbButtonModule, NbLayoutModule } from '@nebular/theme';

import { PreviewRoutingModule } from './preview-routing.module';
import { PreviewComponent } from './preview.component';
import { TOOL_OVERLAY_CONTAINER_ADAPTER } from '../overlay-container';

@NgModule({
  imports: [BakeryCommonModule, PreviewRoutingModule, NbButtonModule, NbLayoutModule],
  declarations: [PreviewComponent],
  providers: [TOOL_OVERLAY_CONTAINER_ADAPTER]
})
export class PreviewModule {
}
