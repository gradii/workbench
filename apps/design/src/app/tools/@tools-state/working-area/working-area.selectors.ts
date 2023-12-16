import { createSelector } from '@ngrx/store';

import { fromWorkingArea } from '@tools-state/working-area/working-area.reducer';
import { getToolsState } from '@tools-state/tools.selector';
import { fromTools } from '@tools-state/tools.reducer';

const getWorkingAreaFeatureState = createSelector(getToolsState, (state: fromTools.State) => state.workingArea);

export const getWorkingAreaMode = createSelector(
  getWorkingAreaFeatureState,
  (state: fromWorkingArea.State) => state.mode
);

export const getOvenApp = createSelector(getWorkingAreaFeatureState, (state: fromWorkingArea.State) => state.app);
