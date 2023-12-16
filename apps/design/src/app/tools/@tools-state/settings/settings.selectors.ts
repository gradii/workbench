import { createSelector } from '@ngrx/store';

import { getToolsState } from '@tools-state/tools.selector';
import { fromTools } from '@tools-state/tools.reducer';
import { fromSettings } from '@tools-state/settings/settings.reducer';

export const getSettingsState = createSelector(getToolsState, (state: fromTools.State) => state.settings);
export const getComponentTreePageSidebarScale = createSelector(
  getSettingsState,
  (state: fromSettings.State) => state.componentTreePagesSidebarScale
);
export const getXRay = createSelector(getSettingsState, (state: fromSettings.State) => state.xray);
