import { ProjectActions } from '@tools-state/project/project.actions';

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
    themeId: null,
    name: '',
    shareId: '',
    shareLoading: false,
    tutorialId: ''
  };

  export function reducer(state = initialState, action: ProjectActions.ActionsUnion): State {
    switch (action.type) {
      case ProjectActions.ActionTypes.OpenProject:
        return {
          ...state,
          activeProjectId: action.project.id,
          name: action.project.name,
          themeId: action.project.themeId,
          shareId: action.project.shareId,
          tutorialId: action.project.tutorialId
        };
      case ProjectActions.ActionTypes.SelectTheme:
        return { ...state, themeId: action.themeId };

      case ProjectActions.ActionTypes.UpdateSharingSuccess:
        return { ...state, shareId: action.shareId, shareLoading: false };
      case ProjectActions.ActionTypes.UpdateSharingError:
        return { ...state, shareLoading: false };
      case ProjectActions.ActionTypes.UpdateSharingLoading:
        return { ...state, shareLoading: true };

      default:
        return state;
    }
  }
}
