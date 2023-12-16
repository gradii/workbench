import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { BakeryCommonModule } from '@common';

import {
  TutorialDialogComponent,
  TutorialDialogContentDirective,
  TutorialDialogPlaylistDirective
} from '@shared/tutorial-dialog/tutorial-dialog.component';
import { TutorialDialogHeaderComponent } from '@shared/tutorial-dialog/tutorial-dialog-header/tutorial-dialog-header.component';

const COMPONENTS = [
  TutorialDialogComponent,
  TutorialDialogHeaderComponent,
  TutorialDialogContentDirective,
  TutorialDialogPlaylistDirective
];

@NgModule({
  imports: [NbCardModule, NbButtonModule, BakeryCommonModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class TutorialDialogModule {
}
