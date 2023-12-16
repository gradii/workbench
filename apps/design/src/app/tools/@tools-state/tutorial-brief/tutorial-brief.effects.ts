import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Store } from '@ngrx/store';

import { TutorialBriefActions } from '@tools-state/tutorial-brief/tutorial-brief.actions';
import { TutorialDataService } from '@shared/tutorial/tutorial-data.service';
import { TutorialBrief } from './tutorial-brief.model';
import { fromTutorialBrief } from '@tools-state/tutorial-brief/tutorial-brief.reducer';

@Injectable()
export class TutorialBriefEffects {
  tutorials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TutorialBriefActions.ActionTypes.LoadTutorials),
      tap(() => this.store.dispatch(TutorialBriefActions.setLoading({ loading: true }))),
      mergeMap(() =>
        this.tutorialData.getTutorials().pipe(
          map((tutorials: TutorialBrief[]) => TutorialBriefActions.setTutorials({ tutorials })),
          catchError(() => EMPTY),
          tap(() => this.store.dispatch(TutorialBriefActions.setLoading({ loading: false })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromTutorialBrief.State>,
    private tutorialData: TutorialDataService
  ) {
  }
}
