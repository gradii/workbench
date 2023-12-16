import { Injectable } from '@angular/core';

import { OvenBreakpointStyles, OvenStyles } from '../models/oven.models';
import { BreakpointWidth } from '../models/responsive';

type StyleEntry = [BreakpointWidth, OvenBreakpointStyles];

export abstract class ActiveBreakpointProvider {
  abstract getActiveBreakpoint(): BreakpointWidth;
}

export const breakpointsOrdering = {
  [BreakpointWidth.Desktop]: 4,
  [BreakpointWidth.TabletLandscape]: 3,
  [BreakpointWidth.TabletPortrait]: 2,
  [BreakpointWidth.MobileLandscape]: 1,
  [BreakpointWidth.MobilePortrait]: 0
};

export function getBreakpointOrder(breakpointWidth: BreakpointWidth): number {
  return breakpointsOrdering[breakpointWidth];
}

@Injectable()
export class StylesCompilerService {
  constructor(private activeBreakpointProvider: ActiveBreakpointProvider) {
  }

  compileStyles(styles: OvenStyles): OvenBreakpointStyles {
    const activeBreakpoint = this.activeBreakpointProvider.getActiveBreakpoint();
    return this.reduceActiveStyles(styles, activeBreakpoint);
  }

  private reduceActiveStyles(styles: OvenStyles, breakpoint: BreakpointWidth): OvenBreakpointStyles {
    const activeStyles: OvenBreakpointStyles[] = this.createActiveStyles(styles, breakpoint);
    return this.createResultingStyles(styles, activeStyles);
  }

  private createActiveStyles(styles: OvenStyles, breakpoint: BreakpointWidth): OvenBreakpointStyles[] {
    const entries = this.createStyleEntries(styles);
    return this.selectActiveStyles(entries, breakpoint);
  }

  private createResultingStyles(styles: OvenStyles, activeStyles: OvenBreakpointStyles[]): OvenBreakpointStyles {
    const resultingStyles: OvenBreakpointStyles = { ...styles[BreakpointWidth.Desktop] };

    for (const style of activeStyles) {
      Object.assign(resultingStyles, style);
    }

    return resultingStyles;
  }

  private createStyleEntries(styles: OvenStyles): StyleEntry[] {
    const entries: StyleEntry[] = Object.entries(styles || {}) as StyleEntry[];
    return entries.sort((s1: StyleEntry, s2: StyleEntry) => getBreakpointOrder(s2[0]) - getBreakpointOrder(s1[0]));
  }

  private selectActiveStyles(entries: StyleEntry[], breakpoint: BreakpointWidth): OvenBreakpointStyles[] {
    return entries
      .filter((entry: StyleEntry) => getBreakpointOrder(entry[0]) >= getBreakpointOrder(breakpoint))
      .map((entry: StyleEntry) => entry[1]);
  }
}
