import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { OvenApp } from '@common';

export namespace fromWorkingArea {
  export interface State {
    mode: WorkingAreaMode;
    app: OvenApp;
  }

  const initialState: State = {
    mode: WorkingAreaMode.BUILDER,
    app: null
  };

  export function reducer(state = initialState, action: WorkingAreaActions.ActionsUnion) {
    switch (action.type) {
      case WorkingAreaActions.ActionTypes.ChangeMode:
        return { ...state, mode: action.mode };
      case WorkingAreaActions.ActionTypes.SetOvenState:
        return { ...state, app: action.app };
      default:
        return state;
    }
  }
}
