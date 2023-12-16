import { createSelector } from '@ngrx/store';

import { fromDownload } from '@tools-state/download/download.reducer';
import { fromTools } from '@tools-state/tools.reducer';
import { getToolsState } from '@tools-state/tools.selector';

const getDownloadFeatureState = createSelector(getToolsState, (state: fromTools.State) => state.download);

export const getLoading = createSelector(getDownloadFeatureState, (state: fromDownload.State) => state.loading);
export const getErrored = createSelector(getDownloadFeatureState, (state: fromDownload.State) => state.errored);
export const getSuccess = createSelector(getDownloadFeatureState, (state: fromDownload.State) => state.success);
