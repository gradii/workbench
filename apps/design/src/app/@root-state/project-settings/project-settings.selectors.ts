import { createFeatureSelector, createSelector } from '@ngrx/store';

import { fromProjectSettings } from './project-settings.reducer';

const getProjectSettingsFeatureState = createFeatureSelector('projectSettings');

export const getCurrentProjectId = createSelector(
  getProjectSettingsFeatureState,
  (state: fromProjectSettings.State) => state.currentProjectId
);

export const getCurrentProject = createSelector(
  getProjectSettingsFeatureState,
  (state: fromProjectSettings.State) => state.project
);

export const getProjectSettings = createSelector(
  getProjectSettingsFeatureState,
  (state: fromProjectSettings.State) => state.settings
);

export const getProjectSettingsLoading = createSelector(
  getProjectSettingsFeatureState,
  (state: fromProjectSettings.State) => state.loading
);

export const getProjectSettingsFailed = createSelector(
  getProjectSettingsFeatureState,
  (state: fromProjectSettings.State) => state.failed
);

export const getFaviconUploading = createSelector(
  getProjectSettingsFeatureState,
  (state: fromProjectSettings.State) => state.faviconUploading
);

export const getFaviconUploadFailed = createSelector(
  getProjectSettingsFeatureState,
  (state: fromProjectSettings.State) => state.faviconUploadFailed
);
