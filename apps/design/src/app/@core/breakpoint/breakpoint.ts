import { BreakpointWidth } from '@common';

export interface Breakpoint {
  icon: string;
  name: string;
  width: BreakpointWidth;
}

export const AVAILABLE_BREAKPOINTS = [
  {
    icon: 'breakpoint-desktop',
    name: 'desktop',
    width: BreakpointWidth.Desktop
  },
  {
    icon: 'breakpoint-tablet-landscape',
    name: 'tablet-landscape',
    width: BreakpointWidth.TabletLandscape
  },
  {
    icon: 'breakpoint-tablet',
    name: 'tablet-portrait',
    width: BreakpointWidth.TabletPortrait
  },
  {
    icon: 'breakpoint-mobile-landscape',
    name: 'mobile-landscape',
    width: BreakpointWidth.MobileLandscape
  },
  {
    icon: 'breakpoint-mobile',
    name: 'mobile',
    width: BreakpointWidth.MobilePortrait
  }
];
