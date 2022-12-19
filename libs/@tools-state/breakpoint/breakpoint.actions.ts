import { Breakpoint } from '@core/breakpoint/breakpoint';
import { createAction } from '@ngneat/effects';

export namespace BreakpointActions {
  export enum ActionTypes {
    SelectBreakpoint = '[Breakpoint] Select',
  }

  export const SelectBreakpoint = createAction(ActionTypes.SelectBreakpoint,
    (breakpoint: Breakpoint) => ({ breakpoint })
  );
}
