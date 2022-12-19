export enum BreakpointWidth {
  Desktop = 'xl',
  TabletLandscape = 'lg',
  TabletPortrait = 'md',
  MobileLandscape = 'sm',
  MobilePortrait = 'xs',
}

const breakpointsWidth = {
  [BreakpointWidth.Desktop]: 'fullWidth',
  [BreakpointWidth.TabletLandscape]: 1024,
  [BreakpointWidth.TabletPortrait]: 768,
  [BreakpointWidth.MobileLandscape]: 480,
  [BreakpointWidth.MobilePortrait]: 320
};

export function getBreakpointWidth(breakpointWidth: BreakpointWidth): number | string {
  return breakpointsWidth[breakpointWidth];
}
