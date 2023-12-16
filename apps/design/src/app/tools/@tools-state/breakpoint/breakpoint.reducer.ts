import { createReducer, on } from '@ngrx/store';

import { BreakpointActions } from '@tools-state/breakpoint/breakpoint.actions';
import { AVAILABLE_BREAKPOINTS, Breakpoint } from '@core/breakpoint/breakpoint';

export namespace fromBreakpoint {
  export interface State {
    selectedBreakpoint: Breakpoint;
    changedManually: boolean;
  }

  const initialState: State = {
    selectedBreakpoint: AVAILABLE_BREAKPOINTS[0],
    changedManually: false
  };

  export const reducer = createReducer(
    initialState,

    on(BreakpointActions.selectBreakpoint, (state, action) => ({
      ...state,
      selectedBreakpoint: action.breakpoint,
      changedManually: true
    }))
  );
}
