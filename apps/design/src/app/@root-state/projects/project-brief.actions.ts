import { Action } from '@ngrx/store';
import { ProjectProperties } from '@common';

import { ProjectBrief } from './project-brief.model';

export namespace ProjectBriefActions {
  export enum ActionTypes {
    LoadProjects = '[Projects] Load Projects',
    LoadProjectsSuccess = '[Projects] Load Projects Success',
    LoadProjectsFailed = '[Projects] Load Projects Failed',

    CreateProject = '[Projects] Create Project',
    CreateProjectSuccess = '[Projects] Create Project Success',
    CreateProjectFailed = '[Projects] Create Project Failed',

    DuplicateProject = '[Projects] Duplicate Project',
    DuplicateProjectSuccess = '[Projects] Duplicate Project Success',
    DuplicateProjectFailed = '[Projects] Duplicate Project Failed',

    DeleteProject = '[Projects] Delete Project',
    DeleteProjectSuccess = '[Projects] Delete Project Success',
    DeleteProjectFailed = '[Projects] Delete Project Failed',

    UpdateProject = '[Projects] Update Project',
    UpdateProjectSuccess = '[Projects] Update Project Success',
    UpdateProjectFailed = '[Projects] Update Project Failed',

    ClearUpdateProjectFailed = '[Projects] Clear Update Project Failed',
  }

  export class LoadProjects implements Action {
    readonly type = ActionTypes.LoadProjects;
  }

  export class LoadProjectsSuccess implements Action {
    readonly type = ActionTypes.LoadProjectsSuccess;

    constructor(public projects: ProjectBrief[]) {
    }
  }

  export class LoadProjectsFailed implements Action {
    readonly type = ActionTypes.LoadProjectsFailed;
  }

  export class CreateProject implements Action {
    readonly type = ActionTypes.CreateProject;

    constructor(
      public name: string,
      public templateId: string,
      public templateName: string,
      public properties: ProjectProperties
    ) {
    }
  }

  export class CreateProjectSuccess implements Action {
    readonly type = ActionTypes.CreateProjectSuccess;

    constructor(public project: ProjectBrief) {
    }
  }

  export class CreateProjectFailed implements Action {
    readonly type = ActionTypes.CreateProjectFailed;
  }

  export class DuplicateProject implements Action {
    readonly type = ActionTypes.DuplicateProject;

    constructor(public id: string) {
    }
  }

  export class DuplicateProjectSuccess implements Action {
    readonly type = ActionTypes.DuplicateProjectSuccess;

    constructor(public project: ProjectBrief) {
    }
  }

  export class DuplicateProjectFailed implements Action {
    readonly type = ActionTypes.DuplicateProjectFailed;
  }

  export class DeleteProject implements Action {
    readonly type = ActionTypes.DeleteProject;

    constructor(public id: string) {
    }
  }

  export class DeleteProjectSuccess implements Action {
    readonly type = ActionTypes.DeleteProjectSuccess;

    constructor(public id: string) {
    }
  }

  export class DeleteProjectFailed implements Action {
    readonly type = ActionTypes.DeleteProjectFailed;
  }

  export class UpdateProject implements Action {
    readonly type = ActionTypes.UpdateProject;

    constructor(public project: ProjectBrief) {
    }
  }

  export class UpdateProjectSuccess implements Action {
    readonly type = ActionTypes.UpdateProjectSuccess;

    constructor(public project: ProjectBrief) {
    }
  }

  export class UpdateProjectFailed implements Action {
    readonly type = ActionTypes.UpdateProjectFailed;
  }

  export class ClearUpdateProjectFailed implements Action {
    readonly type = ActionTypes.ClearUpdateProjectFailed;
  }

  export type ActionsUnion =
    | LoadProjects
    | LoadProjectsSuccess
    | LoadProjectsFailed
    | CreateProject
    | CreateProjectSuccess
    | CreateProjectFailed
    | DuplicateProject
    | DuplicateProjectSuccess
    | DuplicateProjectFailed
    | DeleteProject
    | DeleteProjectSuccess
    | DeleteProjectFailed
    | UpdateProject
    | UpdateProjectSuccess
    | UpdateProjectFailed
    | ClearUpdateProjectFailed;
}
