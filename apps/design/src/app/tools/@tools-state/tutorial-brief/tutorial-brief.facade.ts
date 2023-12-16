import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { fromTools } from '@tools-state/tools.reducer';
import { TutorialBriefActions } from '@tools-state/tutorial-brief/tutorial-brief.actions';
import { TutorialBrief } from './tutorial-brief.model';
import {
  getSelectedTutorialBrief,
  getSelectedTutorialBriefId,
  getTutorialBriefLoading,
  getTutorialBriefs
} from '@tools-state/tutorial-brief/tutorial-brief.selectors';

@Injectable({ providedIn: 'root' })
export class TutorialBriefFacade {
  readonly selectedTutorialId$: Observable<string> = this.store.pipe(select(getSelectedTutorialBriefId));

  readonly selectedTutorial$: Observable<TutorialBrief> = this.store.pipe(select(getSelectedTutorialBrief));

  readonly tutorials$: Observable<TutorialBrief[]> = this.store.pipe(select(getTutorialBriefs));

  readonly loading$: Observable<boolean> = this.store.pipe(select(getTutorialBriefLoading));

  constructor(private store: Store<fromTools.State>) {
  }

  loadTutorials(): void {
    this.store.dispatch(TutorialBriefActions.loadTutorials());
  }

  selectTutorial(tutorialId: string): void {
    this.store.dispatch(TutorialBriefActions.selectTutorial({ tutorialId }));
  }
}
