import { Injectable } from '@angular/core';
import { ActiveBreakpointProvider, BreakpointWidth } from '@common/public-api';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';

@Injectable()
export class BakeryActiveBreakpointProvider extends ActiveBreakpointProvider {
  private activeBreakpoint: BreakpointWidth = BreakpointWidth.Desktop;

  constructor() {
    super();
    getSelectedBreakpoint
      .subscribe((breakpoint: Breakpoint) => (this.activeBreakpoint = breakpoint.width));
  }

  getActiveBreakpoint(): BreakpointWidth {
    return this.activeBreakpoint;
  }
}
