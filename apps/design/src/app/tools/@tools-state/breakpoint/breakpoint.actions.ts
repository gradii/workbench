import { createAction, props } from '@ngrx/store';

import { Breakpoint } from '@core/breakpoint/breakpoint';

export namespace BreakpointActions {
  export enum ActionTypes {
    SelectBreakpoint = '[Breakpoint] Select',
  }

  export const selectBreakpoint = createAction(ActionTypes.SelectBreakpoint, props<{ breakpoint: Breakpoint }>());
}
