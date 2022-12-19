import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { DownloadActions } from '@tools-state/download/download.actions';
import { tap } from 'rxjs/operators';

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

  const { state, config } = createState(
    withProps<State>(initialState)
  );

  export const fromDownloadStore = new Store({ name: 'kitchen-download', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect(
      (actions) => actions.pipe(
        tap((action) => {
          switch (action.type) {
            case DownloadActions.ActionTypes.Download:
              return fromDownloadStore.update((state) => ({ ...state, loading: true }));
            case DownloadActions.ActionTypes.DownloadSuccess:
              return fromDownloadStore.update((state) => ({ ...state, loading: false, success: true }));
            case DownloadActions.ActionTypes.DownloadError:
              return fromDownloadStore.update((state) => ({ ...state, loading: false, errored: true }));
            case DownloadActions.ActionTypes.ClearDownloadState:
              return fromDownloadStore.update((state) => ({ ...state, errored: false, success: false }));
            default:
          }
        })
      )
    );
  }

  // export function reducer(state = initialState, action: DownloadActions.ActionsUnion) {
  //   switch (action.type) {
  //     case DownloadActions.ActionTypes.Download:
  //       return { ...state, loading: true };
  //     case DownloadActions.ActionTypes.DownloadSuccess:
  //       return { ...state, loading: false, success: true };
  //     case DownloadActions.ActionTypes.DownloadError:
  //       return { ...state, loading: false, errored: true };
  //     case DownloadActions.ActionTypes.ClearDownloadState:
  //       return { ...state, errored: false, success: false };
  //     default:
  //       return state;
  //   }
  // }
}
