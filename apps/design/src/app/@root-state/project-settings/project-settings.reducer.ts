import { on, createReducer } from '@ngrx/store';

import { ProjectSettingsActions } from './project-settings.actions';
import { ProjectSettings } from './project-settings.model';
import { ProjectDto } from '@shared/project.service';
import { BakeryApp } from '@tools-state/app/app.model';

export namespace fromProjectSettings {
  export interface State {
    currentProjectId: string;
    project: ProjectDto;
    settings: ProjectSettings;

    loading: boolean;
    failed: boolean;

    faviconUploading: boolean;
    faviconUploadFailed: boolean;
  }

  const initialState: State = {
    currentProjectId: '',
    project: {} as ProjectDto,
    settings: {} as ProjectSettings,

    loading: false,
    failed: false,

    faviconUploading: false,
    faviconUploadFailed: false
  };

  export const reducer = createReducer(
    initialState,
    on(ProjectSettingsActions.loadProjectSettings, (state: State) => ({ ...state, failed: false, loading: true })),
    on(ProjectSettingsActions.loadProjectSettingsSuccess, (state: State, action) => ({
      ...state,
      project: action.project,
      settings: getSettingsFromApp(action.project.app),
      loading: false
    })),
    on(ProjectSettingsActions.loadProjectSettingsFailed, (state: State) => ({
      ...state,
      loading: false,
      failed: true
    })),

    on(ProjectSettingsActions.updateProjectSettings, (state: State) => ({ ...state, loading: true, failed: false })),
    on(ProjectSettingsActions.updateProjectSettingsSuccess, (state: State, action) => ({
      ...state,
      project: action.project,
      settings: getSettingsFromApp(action.project.app),
      loading: false
    })),
    on(ProjectSettingsActions.updateProjectSettingsFailed, (state: State, action) => ({
      ...state,
      loading: false,
      failed: true,
      error: action.error
    })),

    on(ProjectSettingsActions.uploadFavicon, (state: State) => ({
      ...state,
      faviconUploadFailed: false,
      faviconUploading: true
    })),
    on(ProjectSettingsActions.uploadFaviconSuccess, (state: State) => ({
      ...state,
      faviconUploading: false
    })),
    on(ProjectSettingsActions.uploadFaviconFailed, (state: State) => ({
      ...state,
      faviconUploadFailed: true,
      faviconUploading: false
    })),

    on(ProjectSettingsActions.setProjectId, (state: State, action) => ({
      ...state,
      currentProjectId: action.projectId
    })),

    on(ProjectSettingsActions.setSettings, (state: State, action) => ({ ...state, settings: action.settings })),

    on(ProjectSettingsActions.clearProjectSettingsFailed, (state: State) => ({
      ...state,
      failed: false,
      faviconUploadFailed: false
    }))
  );

  function getSettingsFromApp(app: BakeryApp): ProjectSettings {
    const { favicon, code } = app || {};
    return { favicon, code };
  }
}
