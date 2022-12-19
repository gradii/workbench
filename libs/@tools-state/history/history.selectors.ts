import { select } from '@ngneat/elf';
import { fromHistory } from '@tools-state/history/history.reducer';

const getHistoryFeatureState = fromHistory.fromHistoryStore;

export const canForward = getHistoryFeatureState.pipe(
  select((state: fromHistory.State) => state.timeIndex < state.historyLength - 1)
);

export const canBack = getHistoryFeatureState.pipe(select((state: fromHistory.State) => state.timeIndex > 0));

export const getTimeIndex = getHistoryFeatureState.pipe(select((state: fromHistory.State) => state.timeIndex));
