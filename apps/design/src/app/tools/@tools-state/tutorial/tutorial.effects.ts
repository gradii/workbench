import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AnalyticsService, onlyLatestFrom } from '@common';
import { NB_WINDOW } from '@nebular/theme';

import { fromTutorial } from '@tools-state/tutorial/tutorial.reducer';
import { TutorialAction } from '@tools-state/tutorial/tutorial.actions';
import { TutorialDataService, TutorialProgress } from '@shared/tutorial/tutorial-data.service';
import { getTutorialProgress } from '@tools-state/tutorial/tutorial.selectors';
import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { Tutorial } from '@tools-state/tutorial-brief/tutorial-brief.model';
import { TourProgressService } from '../../tutorial/tour-progress/tour-progress.service';
import { LessonFacade } from '@tools-state/tutorial-lesson/lesson.facade';
import { LessonExecutorProvider } from '@tools-state/tutorial-lesson/lesson.effects';

@Injectable()
export class TutorialEffects {
  initialize$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TutorialAction.ActionType.Initialize),
        mergeMap(({ tutorialId }) => this.tutorialsDataService.initialize(tutorialId)),
        tap((tutorialProgress: TutorialProgress) => {
          // tutorial: true query param is used to create a unique url for tutorials.
          const link = `/tools/${tutorialProgress.projectId}/builder?tutorial=true`;
          this.window.open(link, '_blank');
        })
      ),
    { dispatch: false }
  );

  start$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TutorialAction.ActionType.Start),
      mergeMap(({ tutorialProgressId }: { tutorialProgressId: string }) => {
        return this.tutorialsDataService.getTutorialProgress(tutorialProgressId);
      }),
      mergeMap((tutorialProgress: TutorialProgress) => [
        TutorialAction.setProgress({ tutorialProgress }),
        TutorialAction.execute()
      ])
    )
  );

  execute$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TutorialAction.ActionType.Execute),
        onlyLatestFrom(this.store.pipe(select(getTutorialProgress))),
        mergeMap((tutorialProgress: TutorialProgress) =>
          this.projectFacade.initialize(tutorialProgress.projectId).pipe(
            switchMap(() => this.tutorialsDataService.getTutorial(tutorialProgress.tutorialId)),
            tap((tutorial: Tutorial) => {
              this.tourProgress.show();
              this.lessonFacade.execute(tutorial.lessons, tutorialProgress);
              this.analytics.logTutorialStarted();
            })
          )
        )
      ),
    { dispatch: false }
  );

  finish$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TutorialAction.ActionType.Finish),
      tap(() => this.tourProgress.hide()),
      onlyLatestFrom(this.store.pipe(select(getTutorialProgress))),
      tap(() => {
        const executor = this.lessonExecutorProvider.getLessonExecutor();
        if (executor) {
          executor.forceComplete();
        }
      }),
      mergeMap((tutorialProgress: TutorialProgress) => this.finishTutorialProgress(tutorialProgress)),
      map(() => TutorialAction.setProgress({ tutorialProgress: null }))
    )
  );

  private window: Window;

  constructor(
    private actions$: Actions,
    private store: Store<fromTutorial.State>,
    private tutorialsDataService: TutorialDataService,
    private projectFacade: ProjectFacade,
    private tourProgress: TourProgressService,
    private analytics: AnalyticsService,
    private lessonFacade: LessonFacade,
    private lessonExecutorProvider: LessonExecutorProvider,
    @Inject(NB_WINDOW) window
  ) {
    this.window = window;
  }

  private finishTutorialProgress(tutorialProgress: TutorialProgress): Observable<void> {
    return this.tutorialsDataService.updateTutorialProgress(tutorialProgress.id, {
      lesson: null,
      step: null,
      complete: true
    });
  }
}
