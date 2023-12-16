import { createSelector } from '@ngrx/store';
import { BreakpointWidth, getBreakpointWidth } from '@common';

import { getToolsState } from '@tools-state/tools.selector';
import { fromTools } from '@tools-state/tools.reducer';
import { fromBreakpoint } from '@tools-state/breakpoint/breakpoint.reducer';
import { Breakpoint } from '@core/breakpoint/breakpoint';

export const getBreakpointState = createSelector(getToolsState, (state: fromTools.State) => state.breakpoint);
export const getSelectedBreakpoint = createSelector(
  getBreakpointState,
  (state: fromBreakpoint.State) => state.selectedBreakpoint
);
export const getChangedManually = createSelector(
  getBreakpointState,
  (state: fromBreakpoint.State) => state.changedManually
);
export const getSelectedBreakpointRealWidth = createSelector(getSelectedBreakpoint, (breakpoint: Breakpoint) => {
  return getRealBreakpointWidth(breakpoint);
});

function getRealBreakpointWidth(breakpoint: Breakpoint): string {
  const breakpointWidthMapping = {
    [BreakpointWidth.Desktop]: '100%',
    [BreakpointWidth.TabletLandscape]: `${getBreakpointWidth(BreakpointWidth.TabletLandscape)}px`,
    [BreakpointWidth.TabletPortrait]: `${getBreakpointWidth(BreakpointWidth.TabletPortrait)}px`,
    [BreakpointWidth.MobileLandscape]: `${getBreakpointWidth(BreakpointWidth.MobileLandscape)}px`,
    [BreakpointWidth.MobilePortrait]: `${getBreakpointWidth(BreakpointWidth.MobilePortrait)}px`
  };

  return breakpointWidthMapping[breakpoint.width];
}
