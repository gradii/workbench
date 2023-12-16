import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule,
  NbProgressBarModule,
  NbSelectModule,
  NbSpinnerModule
} from '@nebular/theme';
import { BakeryCommonModule } from '@common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StaticLessonExecutorService } from './lesson-executor/static-lesson/static-lesson-executor.service';
import { StaticLessonComponent } from './lesson-executor/static-lesson/static-lesson.component';
import { LessonControllerComponent } from './lesson-controller/lesson-controller.component';
import { LessonProgressComponent } from './lesson-progress/lesson-progress.component';
import { StepSwitchComponent } from './step-swith/step-switch.component';
import { LessonProgressContainerComponent } from './lesson-progress/lesson-progress-container.component';
import { StepSwitchContainerComponent } from './step-swith/step-switch-container.component';
import { StepContainerComponent } from './step/step-container.component';
import { DynamicLessonComponent } from './lesson-executor/dynamic-lesson/dynamic-lesson.component';
import { DynamicLessonExecutorService } from './lesson-executor/dynamic-lesson/dynamic-lesson-executor.service';
import { LessonExecutorRegistryService } from './lesson-executor/lesson-executor-registry.service';
import { TourProgressComponent } from './tour-progress/tour-progress.component';
import { TourProgressService } from './tour-progress/tour-progress.service';
import { TourProgressControlComponent } from './tour-progress/tour-progress-control.component';
import { TourProgressContainerComponent } from './tour-progress/tour-progress-container.component';
import { TutorialSharedModule } from '@shared/tutorial/tutorial-shared.module';
import { InteractiveTutorialDialogComponent } from './interactive-tutorial/interactive-tutorial-dialog.component';
import { InteractiveTutorialService } from './interactive-tutorial/interactive-tutorial.service';
import { InteractiveTutorialDescriptionComponent } from './interactive-tutorial/interactive-tutorial-description.component';
import { InteractiveTutorialPlaylistComponent } from './interactive-tutorial/interactive-tutorial-playlist.component';
import { TutorialDialogModule } from '@shared/tutorial-dialog/tutorial-dialog.module';
import { StepDoneIndicatorComponent } from './lesson-executor/step-done-indicator/step-done-indicator.component';
import { DialogModule } from '@shared/dialog/dialog.module';
import { SaveContinueDialogComponent } from './save-continue-dialog/save-continue-dialog.component';
import { SaveContinueService } from './save-continue-dialog/save-continue.service';
import { QuiteBarrierDialogComponent } from './quite-barrier-dialog/quite-barrier-dialog.component';
import { QuiteBarrierService } from './quite-barrier-dialog/quite-barrier.service';
import { StartYourJourneyComponent } from './start-your-journey/start-your-journey.component';
import { StartYourJourneyService } from './start-your-journey/start-your-journey.service';

@NgModule({
  declarations: [
    StaticLessonComponent,
    DynamicLessonComponent,
    LessonControllerComponent,
    LessonProgressComponent,
    StepSwitchComponent,
    LessonProgressContainerComponent,
    StepSwitchContainerComponent,
    StepContainerComponent,
    TourProgressComponent,
    TourProgressControlComponent,
    TourProgressContainerComponent,
    InteractiveTutorialDialogComponent,
    InteractiveTutorialDescriptionComponent,
    InteractiveTutorialPlaylistComponent,
    StepDoneIndicatorComponent,
    SaveContinueDialogComponent,
    QuiteBarrierDialogComponent,
    StartYourJourneyComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    BakeryCommonModule,
    DialogModule,

    NbButtonModule,
    NbDialogModule.forChild(),
    NbCardModule,
    NbProgressBarModule,
    NbPopoverModule,
    NbSpinnerModule,
    NbInputModule,

    TutorialSharedModule,
    TutorialDialogModule,
    NbSelectModule,
    NbIconModule
  ],
  entryComponents: [
    StaticLessonComponent,
    DynamicLessonComponent,
    TourProgressControlComponent,
    InteractiveTutorialDialogComponent,
    SaveContinueDialogComponent,
    QuiteBarrierDialogComponent,
    StartYourJourneyComponent
  ],
  providers: [
    LessonExecutorRegistryService,
    StaticLessonExecutorService,
    DynamicLessonExecutorService,
    TourProgressService,
    InteractiveTutorialService,
    SaveContinueService,
    QuiteBarrierService,
    StartYourJourneyService
  ]
})
export class TutorialsModule {
}
