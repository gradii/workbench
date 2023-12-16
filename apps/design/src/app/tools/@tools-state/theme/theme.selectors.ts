import { createSelector } from '@ngrx/store';
import { fromProjects } from '@tools-state/project/project.reducer';
import { getProjectFeatureState } from '@tools-state/project/project.selectors';
import { fromTheme } from '@tools-state/theme/theme.reducer';

import { fromTools } from '@tools-state/tools.reducer';
import { getToolsState } from '@tools-state/tools.selector';

export const getThemeState = createSelector(getToolsState, (state: fromTools.State) => state.theme);

export const getThemeList = createSelector(getThemeState, fromTheme.selectAll);

export const getActiveTheme = createSelector(
  getProjectFeatureState,
  getThemeState,
  (projectState: fromProjects.State, themeState: fromTheme.State) => themeState.entities[projectState.themeId]
);

export const getSupportLoading = createSelector(getThemeState, (state: fromTheme.State) => state.supportLoading);

export const getPaletteLoading = createSelector(
  getThemeState,
  (state: fromTheme.State) => state.supportLoading || state.shadesLoading
);
