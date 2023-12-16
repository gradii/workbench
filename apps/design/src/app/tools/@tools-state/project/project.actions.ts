import { Action } from '@ngrx/store';

import { ProjectDto } from '@shared/project.service';

export namespace ProjectActions {
  export enum ActionTypes {
    OpenProject = '[Project] Open Project',
    UpdateProject = '[Project] Update Project',
    SelectTheme = '[Project] Select Theme',
    PersistThumbnail = '[App] Persist Thumbnail',
    UpdateSharingLoading = '[Project] Update Sharing Loading',
    UpdateSharingSuccess = '[Project] Update Sharing Success',
    UpdateSharingError = '[Project] Update Sharing Error',
  }

  export class OpenProject implements Action {
    readonly type = ActionTypes.OpenProject;

    constructor(public project: ProjectDto) {
    }
  }

  export class UpdateProject implements Action {
    readonly type = ActionTypes.UpdateProject;
  }

  export class SelectTheme implements Action {
    readonly type = ActionTypes.SelectTheme;

    constructor(public themeId: string) {
    }
  }

  export class PersistThumbnail implements Action {
    readonly type = ActionTypes.PersistThumbnail;

    constructor(public image: string) {
    }
  }

  export class UpdateSharingSuccess implements Action {
    readonly type = ActionTypes.UpdateSharingSuccess;

    constructor(public shareId: string) {
    }
  }

  export class UpdateSharingLoading implements Action {
    readonly type = ActionTypes.UpdateSharingLoading;
  }

  export class UpdateSharingError implements Action {
    readonly type = ActionTypes.UpdateSharingError;
  }

  export type ActionsUnion =
    | OpenProject
    | UpdateProject
    | SelectTheme
    | UpdateSharingSuccess
    | UpdateSharingLoading
    | UpdateSharingError
    | PersistThumbnail;
}
