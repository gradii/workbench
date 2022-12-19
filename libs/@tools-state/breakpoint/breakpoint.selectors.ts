import { BreakpointWidth, getBreakpointWidth } from '@common/public-api';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { select } from '@ngneat/elf';
import { fromBreakpoint } from '@tools-state/breakpoint/breakpoint.reducer';

export const getBreakpointState             = fromBreakpoint.fromBreakpointStore;
export const getSelectedBreakpoint          = getBreakpointState.pipe(
  select((state: fromBreakpoint.State) => state.selectedBreakpoint)
);
export const getChangedManually             = getBreakpointState.pipe(
  select((state: fromBreakpoint.State) => state.changedManually)
);
export const getSelectedBreakpointRealWidth = getSelectedBreakpoint.pipe(
  select((breakpoint: Breakpoint) => {
    return getRealBreakpointWidth(breakpoint);
  })
);

function getRealBreakpointWidth(breakpoint: Breakpoint): string {
  const breakpointWidthMapping = {
    [BreakpointWidth.Desktop]        : '100%',
    [BreakpointWidth.TabletLandscape]: `${getBreakpointWidth(BreakpointWidth.TabletLandscape)}px`,
    [BreakpointWidth.TabletPortrait] : `${getBreakpointWidth(BreakpointWidth.TabletPortrait)}px`,
    [BreakpointWidth.MobileLandscape]: `${getBreakpointWidth(BreakpointWidth.MobileLandscape)}px`,
    [BreakpointWidth.MobilePortrait] : `${getBreakpointWidth(BreakpointWidth.MobilePortrait)}px`
  };

  return breakpointWidthMapping[breakpoint.width];
}
