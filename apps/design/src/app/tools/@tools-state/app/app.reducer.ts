import { BakeryApp } from './app.model';
import { createReducer, on } from '@ngrx/store';
import { AppActions } from './app.actions';

export namespace fromApp {
  export interface State {
    initialApp: BakeryApp;
  }

  const initialState: State = {
    initialApp: {} as BakeryApp
  };

  export const reducer = (state = initialState, action: AppActions.ActionsUnion): State => {
    switch (action.type) {
      case AppActions.ActionTypes.InitApplication:
        return {
          ...state,
          initialApp: action.state
        };
      default:
        return state;
    }
  };
}
