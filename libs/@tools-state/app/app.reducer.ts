import { Actions, createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { tap } from 'rxjs/operators';
import { AppActions } from './app.actions';
import { PuffApp } from './app.model';

export namespace fromApp {
  export interface State {
    initialApp: PuffApp;
  }

  const initialState: State = {
    initialApp: {} as PuffApp
  };


  const { state, config } = createState(
    withProps<State>(initialState)
  );

  export const appStore = new Store({ name: 'app', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect((actions: Actions) => {
      return actions.pipe(
        tap((action) => {
          switch (action.type) {
            case AppActions.ActionTypes.InitApplication:
              return appStore.update((state: State) => ({
                  ...state,
                  initialApp: action.state
                })
              );
          }
        })
      );
    });
  }

  // export const reducer = (state = initialState, action: AppActions.ActionsUnion): State => {
  //   switch (action.type) {
  //     case AppActions.ActionTypes.InitApplication:
  //       return {
  //         ...state,
  //         initialApp: action.state
  //       };
  //     default:
  //       return state;
  //   }
  // };
}
