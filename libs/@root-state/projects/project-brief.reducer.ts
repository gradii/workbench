import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { tap } from 'rxjs/operators';
import { ProjectBriefActions } from './project-brief.actions';
import { ProjectBrief } from './project-brief.model';

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
    failed : false,

    duplicateLoading: false,
    duplicateFailed : false,

    createLoading: false,
    createFailed : false,

    deleteLoading: false,
    deleteFailed : false,

    updateLoading: false,
    updateFailed : false
  };

  const { state, config } = createState(
    withProps<State>(initialState)
  );

  export const fromProjectBriefStore = new Store({ name: 'kitchen-projectBrief', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect((actions) => actions.pipe(
      tap((action) => {
        switch (action.type) {
          case ProjectBriefActions.ActionTypes.LoadProjects:
            return fromProjectBriefStore.update(state => ({ ...state, loading: true, failed: false }));
          case ProjectBriefActions.ActionTypes.LoadProjectsSuccess:
            return fromProjectBriefStore.update(
              state => ({ ...state, loading: false, failed: false, projects: action.projects }));
          case ProjectBriefActions.ActionTypes.LoadProjectsFailed:
            return fromProjectBriefStore.update(state => ({ ...state, loading: false, failed: true }));
          case ProjectBriefActions.ActionTypes.DuplicateProject:
            return fromProjectBriefStore.update(
              state => ({ ...state, duplicateLoading: true, duplicateFailed: false }));
          case ProjectBriefActions.ActionTypes.DuplicateProjectSuccess:
            return fromProjectBriefStore.update(state => ({
              ...state,
              projects        : [...state.projects, action.project],
              duplicateLoading: false,
              duplicateFailed : false
            }));
          case ProjectBriefActions.ActionTypes.DuplicateProjectFailed:
            return fromProjectBriefStore.update(
              state => ({ ...state, duplicateLoading: false, duplicateFailed: true }));

          case ProjectBriefActions.ActionTypes.CreateProject:
            return fromProjectBriefStore.update(state => ({ ...state, createLoading: true, createFailed: false }));
          case ProjectBriefActions.ActionTypes.CreateProjectSuccess:
            return fromProjectBriefStore.update(state => ({
              ...state,
              projects     : [...state.projects, action.project],
              createLoading: false,
              createFailed : false
            }));
          case ProjectBriefActions.ActionTypes.CreateProjectFailed:
            return fromProjectBriefStore.update(state => ({ ...state, createLoading: false, createFailed: true }));

          case ProjectBriefActions.ActionTypes.DeleteProject:
            return fromProjectBriefStore.update(state => ({ ...state, deleteLoading: true, deleteFailed: false }));
          case ProjectBriefActions.ActionTypes.DeleteProjectSuccess:
            const projects = state.projects.filter((project: ProjectBrief) => project.viewId !== action.id);
            return fromProjectBriefStore.update(
              state => ({ ...state, projects, deleteLoading: false, deleteFailed: false }));
          case ProjectBriefActions.ActionTypes.DeleteProjectFailed:
            return fromProjectBriefStore.update(state => ({ ...state, deleteLoading: false, deleteFailed: true }));
          case ProjectBriefActions.ActionTypes.UpdateProject:
            return fromProjectBriefStore.update(state => ({ ...state, updateLoading: true, updateFailed: false }));
          case ProjectBriefActions.ActionTypes.UpdateProjectSuccess:
            const updatedProjects = state.projects.map((project: ProjectBrief) => {
              if (action.project.viewId === project.viewId) {
                return action.project;
              }
              return project;
            });
            return fromProjectBriefStore.update(
              state => ({ ...state, projects: updatedProjects, updateLoading: false, updateFailed: false }));
          case ProjectBriefActions.ActionTypes.UpdateProjectFailed:
            return fromProjectBriefStore.update(state => ({ ...state, updateLoading: false, updateFailed: true }));
          case ProjectBriefActions.ActionTypes.ClearUpdateProjectFailed:
            return fromProjectBriefStore.update(state => ({ ...state, updateFailed: false }));
          default:
        }
      }))
    );
  }

  // export function reducer(state = initialState, action: ProjectBriefActions.ActionsUnion) {
  //   switch (action.type) {
  //     case ProjectBriefActions.ActionTypes.LoadProjects:
  //       return { ...state, loading: true, failed: false };
  //     case ProjectBriefActions.ActionTypes.LoadProjectsSuccess:
  //       return { ...state, loading: false, failed: false, projects: action.projects };
  //     case ProjectBriefActions.ActionTypes.LoadProjectsFailed:
  //       return { ...state, loading: false, failed: true };
  //
  //     case ProjectBriefActions.ActionTypes.DuplicateProject:
  //       return { ...state, duplicateLoading: true, duplicateFailed: false };
  //     case ProjectBriefActions.ActionTypes.DuplicateProjectSuccess:
  //       return {
  //         ...state,
  //         projects        : [...state.projects, action.project],
  //         duplicateLoading: false,
  //         duplicateFailed : false
  //       };
  //     case ProjectBriefActions.ActionTypes.DuplicateProjectFailed:
  //       return { ...state, duplicateLoading: false, duplicateFailed: true };
  //
  //     case ProjectBriefActions.ActionTypes.CreateProject:
  //       return { ...state, createLoading: true, createFailed: false };
  //     case ProjectBriefActions.ActionTypes.CreateProjectSuccess:
  //       return { ...state, projects: [...state.projects, action.project], createLoading: false, createFailed: false };
  //     case ProjectBriefActions.ActionTypes.CreateProjectFailed:
  //       return { ...state, createLoading: false, createFailed: true };
  //
  //     case ProjectBriefActions.ActionTypes.DeleteProject:
  //       return { ...state, deleteLoading: true, deleteFailed: false };
  //     case ProjectBriefActions.ActionTypes.DeleteProjectSuccess:
  //       const projects = state.projects.filter((project: ProjectBrief) => project.viewId !== action.id);
  //       return { ...state, projects, deleteLoading: false, deleteFailed: false };
  //     case ProjectBriefActions.ActionTypes.DeleteProjectFailed:
  //       return { ...state, deleteLoading: false, deleteFailed: true };
  //
  //     case ProjectBriefActions.ActionTypes.UpdateProject:
  //       return { ...state, updateLoading: true, updateFailed: false };
  //     case ProjectBriefActions.ActionTypes.UpdateProjectSuccess:
  //       const updatedProjects = state.projects.map((project: ProjectBrief) => {
  //         if (action.project.viewId === project.viewId) {
  //           return action.project;
  //         }
  //         return project;
  //       });
  //       return { ...state, projects: updatedProjects, updateLoading: false, updateFailed: false };
  //     case ProjectBriefActions.ActionTypes.UpdateProjectFailed:
  //       return { ...state, updateLoading: false, updateFailed: true };
  //     case ProjectBriefActions.ActionTypes.ClearUpdateProjectFailed:
  //       return { ...state, updateFailed: false };
  //     default:
  //       return state;
  //   }
  // }
}
