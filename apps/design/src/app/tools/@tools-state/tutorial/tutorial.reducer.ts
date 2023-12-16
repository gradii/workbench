import { TutorialProgress } from '@shared/tutorial/tutorial-data.service';
import { TutorialAction } from '@tools-state/tutorial/tutorial.actions';

import { createReducer, on } from '@ngrx/store';

export namespace fromTutorial {
  export interface State {
    tutorialProgress: TutorialProgress;
  }

  const initialState: State = {
    tutorialProgress: null
  };

  export const reducer = createReducer(
    initialState,
    on(TutorialAction.setProgress, (state: State, { tutorialProgress }) => {
      return { ...state, tutorialProgress };
    })
  );
}
