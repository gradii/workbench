import { AVAILABLE_BREAKPOINTS, Breakpoint } from '@core/breakpoint/breakpoint';
import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';

import { BreakpointActions } from '@tools-state/breakpoint/breakpoint.actions';
import { tap } from 'rxjs/operators';

export namespace fromBreakpoint {
  export interface State {
    selectedBreakpoint: Breakpoint;
    changedManually: boolean;
  }

  const initialState: State = {
    selectedBreakpoint: AVAILABLE_BREAKPOINTS[0],
    changedManually   : false
  };

  const { state, config } = createState(
    withProps<State>(initialState)
  );

  export const fromBreakpointStore = new Store({ name: 'kitchen-breakpoint', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect(
      (actions) => actions.pipe(
        tap((action) => {
          switch (action.type) {
            case BreakpointActions.ActionTypes.SelectBreakpoint:
              return fromBreakpointStore.update((state) => ({
                ...state,
                selectedBreakpoint: action.breakpoint,
                changedManually   : true
              }));
            default:
          }
        })
      )
    );
  }

  // export const reducer = createReducer(
  //   initialState,
  //
  //   on(BreakpointActions.selectBreakpoint, (state, action) => ({
  //     ...state,
  //     selectedBreakpoint: action.breakpoint,
  //     changedManually   : true
  //   }))
  // );
}
