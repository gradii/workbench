import { BakeryLayout } from '@tools-state/layout/layout.model';
import { LayoutActions } from '@tools-state/layout/layout.actions';

export namespace fromLayout {
  export interface State {
    layout: BakeryLayout;
  }

  const initialState: State = {
    layout: null
  };

  export function reducer(state = initialState, action: LayoutActions.ActionsUnion) {
    switch (action.type) {
      case LayoutActions.ActionTypes.SetLayout:
        return { ...state, layout: action.layout };
      case LayoutActions.ActionTypes.UpdateLayout:
        return { ...state, layout: { ...state.layout, ...action.change } };
      default:
        return state;
    }
  }
}
