import { createAction, props } from '@ngrx/store';

import { TutorialProgress } from '@shared/tutorial/tutorial-data.service';

export namespace TutorialAction {
  export enum ActionType {
    Initialize = '[Tutorial] Initialize',
    Start = '[Tutorial] Start',
    Execute = '[Tutorial] Execute',
    Finish = '[Tutorial] Finish',
    SetProgress = '[Tutorial] Set Progress',
  }

  export const initialize = createAction(ActionType.Initialize, props<{ tutorialId: string }>());
  export const start = createAction(ActionType.Start, props<{ tutorialProgressId: string }>());
  export const finish = createAction(ActionType.Finish);
  export const setProgress = createAction(ActionType.SetProgress, props<{ tutorialProgress: TutorialProgress }>());
  export const execute = createAction(ActionType.Execute);
}
