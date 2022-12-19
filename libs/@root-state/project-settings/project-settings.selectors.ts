import { select } from '@ngneat/elf';

import { fromProjectSettings } from './project-settings.reducer';

const getProjectSettingsFeatureState = fromProjectSettings.projectSettingsStore;

export const getCurrentProjectId = getProjectSettingsFeatureState.pipe(select(
  (state: fromProjectSettings.State) => state.currentProjectId
));

export const getCurrentProject = getProjectSettingsFeatureState.pipe(select(
  (state: fromProjectSettings.State) => state.project
));

export const getProjectSettings = getProjectSettingsFeatureState.pipe(select(
  (state: fromProjectSettings.State) => state.settings
));

export const getProjectSettingsLoading = getProjectSettingsFeatureState.pipe(select(
  (state: fromProjectSettings.State) => state.loading
));

export const getProjectSettingsFailed = getProjectSettingsFeatureState.pipe(select(
  (state: fromProjectSettings.State) => state.failed
));

export const getFaviconUploading = getProjectSettingsFeatureState.pipe(select(
  (state: fromProjectSettings.State) => state.faviconUploading
));

export const getFaviconUploadFailed = getProjectSettingsFeatureState.pipe(select(
  (state: fromProjectSettings.State) => state.faviconUploadFailed
));
