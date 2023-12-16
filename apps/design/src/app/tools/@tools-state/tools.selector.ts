import { createFeatureSelector } from '@ngrx/store';

import { fromTools } from '@tools-state/tools.reducer';

export const getToolsState = createFeatureSelector<fromTools.State>('tools');
