import { ProjectProperties } from '@common/public-api';
import { createAction, props } from '@ngneat/effects';
import { ProjectBrief } from './project-brief.model';

export namespace ProjectBriefActions {
  export namespace ngneat {
    export const LoadProjects        = createAction('[Project Brief] Load Projects');
    export const LoadProjectsSuccess = createAction('[Project Brief] Load Projects Success',
      props<{ projects: ProjectBrief[] }>());
    export const LoadProjectsFailure = createAction('[Project Brief] Load Projects Failure');

    export const CreateProject        = createAction('[Project Brief] Create Project',
      props<{ name: string, projectType: string, templateId: string, templateName: string, properties: ProjectProperties }>());
    export const CreateProjectSuccess = createAction('[Project Brief] Create Project Success',
      props<{ name: string, projectType: string, templateId: string, templateName: string, properties: ProjectProperties }>());
    export const CreateProjectFailure = createAction('[Project Brief] Create Project Failure');

    export const DuplicateProject        = createAction('[Project Brief] Duplicate Project',
      props<{ id: string }>());
    export const DuplicateProjectSuccess = createAction('[Project Brief] Duplicate Project Success',
      props<{ project: ProjectBrief }>());
    export const DuplicateProjectFailure = createAction('[Project Brief] Duplicate Project Failure');

    export const DeleteProject        = createAction('[Project Brief] Delete Project',
      props<{ id: string }>());
    export const DeleteProjectSuccess = createAction('[Project Brief] Delete Project Success',
      props<{ id: string }>());
    export const DeleteProjectFailure = createAction('[Project Brief] Delete Project Failure');

    export const UpdateProject        = createAction('[Project Brief] Update Project',
      props<{ project: ProjectBrief }>());
    export const UpdateProjectSuccess = createAction('[Project Brief] Update Project Success',
      props<{ project: ProjectBrief }>());
    export const UpdateProjectFailure = createAction('[Project Brief] Update Project Failure');

    export const ClearUpdateProjectFailed = createAction('[Project Brief] Clear Update Project Failed');

  }


  export enum ActionTypes {
    LoadProjects             = '[Projects] Load Projects',
    LoadProjectsSuccess      = '[Projects] Load Projects Success',
    LoadProjectsFailed       = '[Projects] Load Projects Failed',

    CreateProject            = '[Projects] Create Project',
    CreateProjectSuccess     = '[Projects] Create Project Success',
    CreateProjectFailed      = '[Projects] Create Project Failed',

    DuplicateProject         = '[Projects] Duplicate Project',
    DuplicateProjectSuccess  = '[Projects] Duplicate Project Success',
    DuplicateProjectFailed   = '[Projects] Duplicate Project Failed',

    DeleteProject            = '[Projects] Delete Project',
    DeleteProjectSuccess     = '[Projects] Delete Project Success',
    DeleteProjectFailed      = '[Projects] Delete Project Failed',

    UpdateProject            = '[Projects] Update Project',
    UpdateProjectSuccess     = '[Projects] Update Project Success',
    UpdateProjectFailed      = '[Projects] Update Project Failed',

    ClearUpdateProjectFailed = '[Projects] Clear Update Project Failed',
  }

  export const LoadProjects = createAction(ActionTypes.LoadProjects);

  export const LoadProjectsSuccess = createAction(ActionTypes.LoadProjectsSuccess,
    (projects: ProjectBrief[]) => ({ projects }));

  export const LoadProjectsFailed = createAction(ActionTypes.LoadProjectsFailed);

  export const CreateProject = createAction(ActionTypes.CreateProject,
    (name: string, projectType: string,
     templateId: string, templateName: string, properties: ProjectProperties) =>
      ({ name, projectType, templateId, templateName, properties }));

  export const CreateProjectSuccess = createAction(ActionTypes.CreateProjectSuccess,
    (project: ProjectBrief) => ({ project }));

  export const CreateProjectFailed = createAction(ActionTypes.CreateProjectFailed);

  export const DuplicateProject = createAction(ActionTypes.DuplicateProject, (id: string) => ({ id }));

  export const DuplicateProjectSuccess = createAction(ActionTypes.DuplicateProjectSuccess,
    (project: ProjectBrief) => ({ project }));

  export const DuplicateProjectFailed = createAction(ActionTypes.DuplicateProjectFailed);

  export const DeleteProject = createAction(ActionTypes.DeleteProject, (id: string) => ({ id }));

  export const DeleteProjectSuccess = createAction(ActionTypes.DeleteProjectSuccess, (id: string) => ({ id }));

  export const DeleteProjectFailed = createAction(ActionTypes.DeleteProjectFailed);

  export const UpdateProject        = createAction(ActionTypes.UpdateProject, (project: ProjectBrief) => ({ project }));
  export const UpdateProjectSuccess = createAction(ActionTypes.UpdateProjectSuccess,
    (project: ProjectBrief) => ({ project }));

  export const UpdateProjectFailed = createAction(ActionTypes.UpdateProjectFailed);


  export const ClearUpdateProjectFailed = createAction(ActionTypes.ClearUpdateProjectFailed);
}
