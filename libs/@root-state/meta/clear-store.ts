import { RootActions } from '@root-state/root.actions';

export function clearStore(reducer) {
  return function(state, action) {
    if (action.type === RootActions.ActionTypes.ClearStore) {
      state = undefined;
    }

    return reducer(state, action);
  };
}
