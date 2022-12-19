import { Injectable } from '@angular/core';

import { KitchenBreakpointStyles, KitchenStyles } from '../models/kitchen.models';
import { BreakpointWidth } from '../models/responsive';

type StyleEntry = [BreakpointWidth, KitchenBreakpointStyles];

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

  compileStyles(styles: KitchenStyles): KitchenBreakpointStyles {
    const activeBreakpoint = this.activeBreakpointProvider.getActiveBreakpoint();
    return this.reduceActiveStyles(styles, activeBreakpoint);
  }

  private reduceActiveStyles(styles: KitchenStyles, breakpoint: BreakpointWidth): KitchenBreakpointStyles {
    const activeStyles: KitchenBreakpointStyles[] = this.createActiveStyles(styles, breakpoint);
    return this.createResultingStyles(styles, activeStyles);
  }

  private createActiveStyles(styles: KitchenStyles, breakpoint: BreakpointWidth): KitchenBreakpointStyles[] {
    const entries = this.createStyleEntries(styles);
    return this.selectActiveStyles(entries, breakpoint);
  }

  private createResultingStyles(styles: KitchenStyles, activeStyles: KitchenBreakpointStyles[]): KitchenBreakpointStyles {
    const resultingStyles: KitchenBreakpointStyles = { ...styles[BreakpointWidth.Desktop] };

    for (const style of activeStyles) {
      Object.assign(resultingStyles, style);
    }

    return resultingStyles;
  }

  private createStyleEntries(styles: KitchenStyles): StyleEntry[] {
    const entries: StyleEntry[] = Object.entries(styles || {}) as StyleEntry[];
    return entries.sort((s1: StyleEntry, s2: StyleEntry) => getBreakpointOrder(s2[0]) - getBreakpointOrder(s1[0]));
  }

  private selectActiveStyles(entries: StyleEntry[], breakpoint: BreakpointWidth): KitchenBreakpointStyles[] {
    return entries
      .filter((entry: StyleEntry) => getBreakpointOrder(entry[0]) >= getBreakpointOrder(breakpoint))
      .map((entry: StyleEntry) => entry[1]);
  }
}
