import { BreakpointWidth } from '@common/public-api';

export interface Breakpoint {
  icon: string;
  name: string;
  width: BreakpointWidth;
}

export const AVAILABLE_BREAKPOINTS = [
  {
    icon: 'workbench:breakpoint-desktop',
    name: 'desktop',
    width: BreakpointWidth.Desktop
  },
  {
    icon: 'workbench:breakpoint-tablet-landscape',
    name: 'tablet-landscape',
    width: BreakpointWidth.TabletLandscape
  },
  {
    icon: 'workbench:breakpoint-tablet',
    name: 'tablet-portrait',
    width: BreakpointWidth.TabletPortrait
  },
  {
    icon: 'workbench:breakpoint-mobile-landscape',
    name: 'mobile-landscape',
    width: BreakpointWidth.MobileLandscape
  },
  {
    icon: 'workbench:breakpoint-mobile',
    name: 'mobile',
    width: BreakpointWidth.MobilePortrait
  }
];
