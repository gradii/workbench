import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { ProjectDto } from '@shared/project.service';
import { PuffApp } from '@tools-state/app/app.model';
import { tap } from 'rxjs/operators';

import { ProjectSettingsActions } from './project-settings.actions';
import { ProjectSettings } from './project-settings.model';

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
    project         : {} as ProjectDto,
    settings        : {} as ProjectSettings,

    loading: false,
    failed : false,

    faviconUploading   : false,
    faviconUploadFailed: false
  };

  const { state, config } = createState(
    withProps<State>(initialState)
  );

  export const projectSettingsStore = new Store({ name: 'projectSettings', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect((actions) => actions.pipe(
      tap((action) => {
          switch (action.type) {
            case ProjectSettingsActions.loadProjectSettings:
              return projectSettingsStore.update((state) => ({
                ...state,
                loading: true,
                failed : false
              }));
            case ProjectSettingsActions.loadProjectSettingsSuccess:
              return projectSettingsStore.update((state) => ({
                ...state,
                project : action.project,
                settings: getSettingsFromApp(action.project.app),
                loading : false
              }));
            case ProjectSettingsActions.loadProjectSettingsFailed:
              return projectSettingsStore.update((state: State) => ({
                ...state,
                loading: false,
                failed : true
              }));

            case ProjectSettingsActions.updateProjectSettings:
              return projectSettingsStore.update((state: State) => ({ ...state, loading: true, failed: false }));
            case ProjectSettingsActions.updateProjectSettingsSuccess:
              return projectSettingsStore.update((state: State) => ({
                ...state,
                project : action.project,
                settings: getSettingsFromApp(action.project.app),
                loading : false
              }));
            case ProjectSettingsActions.updateProjectSettingsFailed:
              return projectSettingsStore.update((state: State) => ({
                ...state,
                loading: false,
                failed : true,
                error  : action.error
              }));
            case ProjectSettingsActions.uploadFavicon:
              return projectSettingsStore.update((state: State) => ({
                ...state,
                faviconUploadFailed: false,
                faviconUploading   : true
              }));
            case ProjectSettingsActions.uploadFaviconSuccess:
              return projectSettingsStore.update((state: State) => ({
                ...state,
                faviconUploading: false
              }));
            case ProjectSettingsActions.uploadFaviconFailed:
              return projectSettingsStore.update((state: State) => ({
                ...state,
                faviconUploadFailed: true,
                faviconUploading   : false
              }));

            case ProjectSettingsActions.setProjectId:
              return projectSettingsStore.update((state: State) => ({
                ...state,
                currentProjectId: action.projectId
              }));
            case ProjectSettingsActions.setSettings:
              return projectSettingsStore.update((state: State) => ({ ...state, settings: action.settings }));
            case ProjectSettingsActions.clearProjectSettingsFailed:
              return projectSettingsStore.update((state: State) => ({
                ...state,
                failed             : false,
                faviconUploadFailed: false
              }));
          }
        }
      )
    ));
  }


  // export const reducer = createReducer(
  //   initialState,
  //   on(ProjectSettingsActions.loadProjectSettings, (state: State) => ({ ...state, failed: false, loading: true })),
  //   on(ProjectSettingsActions.loadProjectSettingsSuccess, (state: State, action) => ({
  //     ...state,
  //     project : action.project,
  //     settings: getSettingsFromApp(action.project.app),
  //     loading : false
  //   })),
  //   on(ProjectSettingsActions.loadProjectSettingsFailed, (state: State) => ({
  //     ...state,
  //     loading: false,
  //     failed : true
  //   })),
  //
  //   on(ProjectSettingsActions.updateProjectSettings, (state: State) => ({ ...state, loading: true, failed: false })),
  //   on(ProjectSettingsActions.updateProjectSettingsSuccess, (state: State, action) => ({
  //     ...state,
  //     project : action.project,
  //     settings: getSettingsFromApp(action.project.app),
  //     loading : false
  //   })),
  //   on(ProjectSettingsActions.updateProjectSettingsFailed, (state: State, action) => ({
  //     ...state,
  //     loading: false,
  //     failed : true,
  //     error  : action.error
  //   })),
  //
  //   on(ProjectSettingsActions.uploadFavicon, (state: State) => ({
  //     ...state,
  //     faviconUploadFailed: false,
  //     faviconUploading   : true
  //   })),
  //   on(ProjectSettingsActions.uploadFaviconSuccess, (state: State) => ({
  //     ...state,
  //     faviconUploading: false
  //   })),
  //   on(ProjectSettingsActions.uploadFaviconFailed, (state: State) => ({
  //     ...state,
  //     faviconUploadFailed: true,
  //     faviconUploading   : false
  //   })),
  //
  //   on(ProjectSettingsActions.setProjectId, (state: State, action) => ({
  //     ...state,
  //     currentProjectId: action.projectId
  //   })),
  //
  //   on(ProjectSettingsActions.setSettings, (state: State, action) => ({ ...state, settings: action.settings })),
  //
  //   on(ProjectSettingsActions.clearProjectSettingsFailed, (state: State) => ({
  //     ...state,
  //     failed             : false,
  //     faviconUploadFailed: false
  //   }))
  // );

  function getSettingsFromApp(app: PuffApp): ProjectSettings {
    const { favicon, code } = app || {};
    return { favicon, code };
  }
}
