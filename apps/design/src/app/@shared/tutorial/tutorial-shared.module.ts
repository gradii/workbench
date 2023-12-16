import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule } from '@nebular/theme';

import { StepComponent } from '@shared/tutorial/step.component';
import { TutorialDataService } from '@shared/tutorial/tutorial-data.service';
import { TutorialService } from '@shared/tutorial/tutorial.service';

@NgModule({
  imports: [CommonModule, NbButtonModule],
  declarations: [StepComponent],
  providers: [TutorialDataService, TutorialService],
  exports: [StepComponent]
})
export class TutorialSharedModule {
}
