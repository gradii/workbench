import { createSelector } from '@ngrx/store';

import { getToolsState } from '@tools-state/tools.selector';
import { fromTools } from '@tools-state/tools.reducer';
import { fromTutorial } from '@tools-state/tutorial/tutorial.reducer';

export const getTutorialState = createSelector(getToolsState, (state: fromTools.State) => state.tutorial);
export const getTutorialProgress = createSelector(
  getTutorialState,
  (state: fromTutorial.State) => state.tutorialProgress
);
