import { createSelector } from '@ngrx/store';

import { fromLayout } from '@tools-state/layout/layout.reducer';
import { fromTools } from '@tools-state/tools.reducer';
import { getToolsState } from '@tools-state/tools.selector';

const getLayoutFeatureState = createSelector(getToolsState, (state: fromTools.State) => state.layout);

export const getLayout = createSelector(getLayoutFeatureState, (state: fromLayout.State) => state.layout);
