import { createAction } from '@ngneat/effects';

import { ProjectDto } from '@shared/project.service';

export namespace ProjectActions {
  export enum ActionTypes {
    OpenProject          = '[Project] Open Project',
    UpdateProject        = '[Project] Update Project',
    SelectTheme          = '[Project] Select Theme',
    PersistThumbnail     = '[App] Persist Thumbnail',
    UpdateSharingLoading = '[Project] Update Sharing Loading',
    UpdateSharingSuccess = '[Project] Update Sharing Success',
    UpdateSharingError   = '[Project] Update Sharing Error',
  }

  export const OpenProject = createAction(
    ActionTypes.OpenProject,
    (project: ProjectDto) => ({ project })
  );

  export const UpdateProject = createAction(
    ActionTypes.UpdateProject
  );

  export const SelectTheme = createAction(
    ActionTypes.SelectTheme,
    (themeId: string) => ({ themeId })
  );

  export const PersistThumbnail = createAction(
    ActionTypes.PersistThumbnail,
    (thumbnail: string) => ({ thumbnail })
  );

  export const UpdateSharingSuccess = createAction(
    ActionTypes.UpdateSharingSuccess,
    (shareId: string) => ({ shareId })
  );

  export const UpdateSharingLoading = createAction(
    ActionTypes.UpdateSharingLoading
  );

  export const UpdateSharingError = createAction(
    ActionTypes.UpdateSharingError
  );
}
