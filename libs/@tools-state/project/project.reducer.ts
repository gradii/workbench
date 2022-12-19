import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { ProjectActions } from '@tools-state/project/project.actions';
import { tap } from 'rxjs/operators';

export namespace fromProjects {
  export interface State {
    activeProjectId: string;
    themeId: string;
    name: string;
    shareId: string;
    shareLoading: boolean;
    tutorialId: string;
  }

  const initialState: State = {
    activeProjectId: null,
    themeId        : null,
    name           : '',
    shareId        : '',
    shareLoading   : false,
    tutorialId     : ''
  };

  const { state, config } = createState(
    withProps<State>(initialState)
  );

  export const fromProjectsStore = new Store({ name: 'kitchen-projects', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect(
      (actions) => actions.pipe(
        tap((action) => {
          switch (action.type) {
            case ProjectActions.ActionTypes.OpenProject:
              return fromProjectsStore.update(state => ({
                ...state,
                activeProjectId: action.project.viewId,
                name           : action.project.name,
                themeId        : action.project.themeId,
                shareId        : action.project.shareId,
                tutorialId     : action.project.tutorialId
              }));
            case ProjectActions.ActionTypes.SelectTheme:
              return fromProjectsStore.update(state => ({
                ...state,
                themeId: action.themeId
              }));
            case ProjectActions.ActionTypes.UpdateSharingSuccess:
              return fromProjectsStore.update(state => ({
                ...state,
                shareId: action.shareId, shareLoading: false
              }));
            case ProjectActions.ActionTypes.UpdateSharingError:
              return fromProjectsStore.update(state => ({
                ...state,
                shareLoading: false
              }));
            case ProjectActions.ActionTypes.UpdateSharingLoading:
              return fromProjectsStore.update(state => ({
                ...state,
                shareLoading: true
              }));
            default:
          }
        })
      )
    );
  }

  // export function reducer(state = initialState, action): State {
  //   switch (action.type) {
  //     case ProjectActions.ActionTypes.OpenProject:
  //       return {
  //         ...state,
  //         activeProjectId: action.project.viewId,
  //         name           : action.project.name,
  //         themeId        : action.project.themeId,
  //         shareId        : action.project.shareId,
  //         tutorialId     : action.project.tutorialId
  //       };
  //     case ProjectActions.ActionTypes.SelectTheme:
  //       return { ...state, themeId: action.themeId };
  //
  //     case ProjectActions.ActionTypes.UpdateSharingSuccess:
  //       return { ...state, shareId: action.shareId, shareLoading: false };
  //     case ProjectActions.ActionTypes.UpdateSharingError:
  //       return { ...state, shareLoading: false };
  //     case ProjectActions.ActionTypes.UpdateSharingLoading:
  //       return { ...state, shareLoading: true };
  //
  //     default:
  //       return state;
  //   }
  // }
}
