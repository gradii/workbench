import { NgModule } from '@angular/core';
import { NbOverlayModule } from '@nebular/theme';

import { DialogComponent } from './dialog.component';
import { DialogService } from './dialog.service';

@NgModule({
  imports: [NbOverlayModule],
  declarations: [DialogComponent],
  entryComponents: [DialogComponent],
  providers: [DialogService]
})
export class DialogModule {
}
