import { Action, ActionReducer } from '@ngrx/store';

import { fromTools } from '@tools-state/tools.reducer';
import { AppActions } from '@tools-state/app/app.actions';

export function clearState(reducer: ActionReducer<fromTools.State>): ActionReducer<fromTools.State> {
  return (state: fromTools.State, action: Action): fromTools.State => {
    if (action.type === AppActions.ActionTypes.ClearAppState) {
      state = undefined;
    }
    return reducer(state, action);
  };
}
