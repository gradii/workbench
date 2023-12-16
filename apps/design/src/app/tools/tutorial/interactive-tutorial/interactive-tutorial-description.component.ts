import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { TutorialBrief } from '@tools-state/tutorial-brief/tutorial-brief.model';
import { StepSizeProviderService } from '@shared/tutorial/step-size-provider.service';
import { TutorialBriefFacade } from '@tools-state/tutorial-brief/tutorial-brief.facade';
import { InteractiveTutorialDialogComponent } from './interactive-tutorial-dialog.component';
import { TutorialFacade } from '@tools-state/tutorial/tutorial.facade';
import { environment } from '../../../../environments/environment';
import { DialogRef } from '@shared/dialog/dialog-ref';

@Component({
  selector: 'ub-interactive-tutorial-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StepSizeProviderService],
  templateUrl: './interactive-tutorial-description.component.html',
  styleUrls: ['./interactive-tutorial-description.component.scss']
})
export class InteractiveTutorialDescriptionComponent implements OnDestroy {
  readonly selectedTutorial$: Observable<TutorialBrief> = this.tutorialBriefFacade.selectedTutorial$;
  readonly width$: Observable<number> = this.stepSizeProvider.width$;
  readonly height$: Observable<number> = this.stepSizeProvider.height$;
  readonly url$: Observable<SafeUrl> = this.selectedTutorial$.pipe(
    filter((tutorial: TutorialBrief) => !!tutorial),
    map((tutorial: TutorialBrief) => {
      const contentId: string = tutorial.description;
      const url = environment.tutorialsPrefix + contentId;
      return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    })
  );

  private destroyed$ = new Subject();

  constructor(
    private dialogRef: DialogRef<InteractiveTutorialDialogComponent>,
    private domSanitizer: DomSanitizer,
    private stepSizeProvider: StepSizeProviderService,
    private tutorialBriefFacade: TutorialBriefFacade,
    private tutorialFacade: TutorialFacade
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  startTutorial(tutorialId: string): void {
    this.tutorialFacade.initialize(tutorialId);
    this.dialogRef.close();
  }
}
