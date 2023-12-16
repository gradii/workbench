import { DownloadActions } from '@tools-state/download/download.actions';

export namespace fromDownload {
  export interface State {
    loading: boolean;
    success: boolean;
    errored: boolean;
  }

  const initialState: State = {
    loading: false,
    success: false,
    errored: false
  };

  export function reducer(state = initialState, action: DownloadActions.ActionsUnion) {
    switch (action.type) {
      case DownloadActions.ActionTypes.Download:
        return { ...state, loading: true };
      case DownloadActions.ActionTypes.DownloadSuccess:
        return { ...state, loading: false, success: true };
      case DownloadActions.ActionTypes.DownloadError:
        return { ...state, loading: false, errored: true };
      case DownloadActions.ActionTypes.ClearDownloadState:
        return { ...state, errored: false, success: false };
      default:
        return state;
    }
  }
}
