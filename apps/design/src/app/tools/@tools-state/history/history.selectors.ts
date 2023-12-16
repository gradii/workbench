import { createSelector } from '@ngrx/store';

import { fromHistory } from '@tools-state/history/history.reducer';
import { fromTools } from '@tools-state/tools.reducer';
import { getToolsState } from '@tools-state/tools.selector';

const getHistoryFeatureState = createSelector(getToolsState, (state: fromTools.State) => state.history);

export const canForward = createSelector(
  getHistoryFeatureState,
  (state: fromHistory.State) => state.timeIndex < state.historyLength - 1
);

export const canBack = createSelector(getHistoryFeatureState, (state: fromHistory.State) => state.timeIndex > 0);

export const getTimeIndex = createSelector(getHistoryFeatureState, (state: fromHistory.State) => state.timeIndex);
