import { ProjectBrief } from './project-brief.model';
import { ProjectBriefActions } from './project-brief.actions';

export namespace fromProjectBrief {
  export interface State {
    projects: ProjectBrief[];

    loading: boolean;
    failed: boolean;

    duplicateLoading: boolean;
    duplicateFailed: boolean;

    createLoading: boolean;
    createFailed: boolean;

    deleteLoading: boolean;
    deleteFailed: boolean;

    updateLoading: boolean;
    updateFailed: boolean;
  }

  const initialState: State = {
    projects: [],

    loading: false,
    failed: false,

    duplicateLoading: false,
    duplicateFailed: false,

    createLoading: false,
    createFailed: false,

    deleteLoading: false,
    deleteFailed: false,

    updateLoading: false,
    updateFailed: false
  };

  export function reducer(state = initialState, action: ProjectBriefActions.ActionsUnion) {
    switch (action.type) {
      case ProjectBriefActions.ActionTypes.LoadProjects:
        return { ...state, loading: true, failed: false };
      case ProjectBriefActions.ActionTypes.LoadProjectsSuccess:
        return { ...state, loading: false, failed: false, projects: action.projects };
      case ProjectBriefActions.ActionTypes.LoadProjectsFailed:
        return { ...state, loading: false, failed: true };

      case ProjectBriefActions.ActionTypes.DuplicateProject:
        return { ...state, duplicateLoading: true, duplicateFailed: false };
      case ProjectBriefActions.ActionTypes.DuplicateProjectSuccess:
        return {
          ...state,
          projects: [...state.projects, action.project],
          duplicateLoading: false,
          duplicateFailed: false
        };
      case ProjectBriefActions.ActionTypes.DuplicateProjectFailed:
        return { ...state, duplicateLoading: false, duplicateFailed: true };

      case ProjectBriefActions.ActionTypes.CreateProject:
        return { ...state, createLoading: true, createFailed: false };
      case ProjectBriefActions.ActionTypes.CreateProjectSuccess:
        return { ...state, projects: [...state.projects, action.project], createLoading: false, createFailed: false };
      case ProjectBriefActions.ActionTypes.CreateProjectFailed:
        return { ...state, createLoading: false, createFailed: true };

      case ProjectBriefActions.ActionTypes.DeleteProject:
        return { ...state, deleteLoading: true, deleteFailed: false };
      case ProjectBriefActions.ActionTypes.DeleteProjectSuccess:
        const projects = state.projects.filter((project: ProjectBrief) => project.viewId !== action.id);
        return { ...state, projects, deleteLoading: false, deleteFailed: false };
      case ProjectBriefActions.ActionTypes.DeleteProjectFailed:
        return { ...state, deleteLoading: false, deleteFailed: true };

      case ProjectBriefActions.ActionTypes.UpdateProject:
        return { ...state, updateLoading: true, updateFailed: false };
      case ProjectBriefActions.ActionTypes.UpdateProjectSuccess:
        const updatedProjects = state.projects.map((project: ProjectBrief) => {
          if (action.project.viewId === project.viewId) {
            return action.project;
          }
          return project;
        });
        return { ...state, projects: updatedProjects, updateLoading: false, updateFailed: false };
      case ProjectBriefActions.ActionTypes.UpdateProjectFailed:
        return { ...state, updateLoading: false, updateFailed: true };
      case ProjectBriefActions.ActionTypes.ClearUpdateProjectFailed:
        return { ...state, updateFailed: false };
      default:
        return state;
    }
  }
}
