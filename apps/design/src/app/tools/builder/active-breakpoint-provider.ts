import { Injectable } from '@angular/core';
import { ActiveBreakpointProvider, BreakpointWidth } from '@common';
import { select, Store } from '@ngrx/store';

import { fromTools } from '@tools-state/tools.reducer';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';
import { Breakpoint } from '@core/breakpoint/breakpoint';

@Injectable()
export class BakeryActiveBreakpointProvider extends ActiveBreakpointProvider {
  private activeBreakpoint: BreakpointWidth = BreakpointWidth.Desktop;

  constructor(private store: Store<fromTools.State>) {
    super();
    this.store
      .pipe(select(getSelectedBreakpoint))
      .subscribe((breakpoint: Breakpoint) => (this.activeBreakpoint = breakpoint.width));
  }

  getActiveBreakpoint(): BreakpointWidth {
    return this.activeBreakpoint;
  }
}
