import { createAction, props } from '@ngrx/store';

import { TutorialBrief } from './tutorial-brief.model';

export namespace TutorialBriefActions {
  export enum ActionTypes {
    Loading = '[Tutorial] Loading',
    LoadTutorials = '[Tutorial] Load Tutorials',
    SetTutorials = '[Tutorial] Set Tutorials',
    SelectTutorial = '[Tutorial] Select Tutorial',
  }

  export const loadTutorials = createAction(ActionTypes.LoadTutorials);
  export const setTutorials = createAction(ActionTypes.SetTutorials, props<{ tutorials: TutorialBrief[] }>());
  export const selectTutorial = createAction(ActionTypes.SelectTutorial, props<{ tutorialId: string }>());
  export const setLoading = createAction(ActionTypes.Loading, props<{ loading: boolean }>());
}
