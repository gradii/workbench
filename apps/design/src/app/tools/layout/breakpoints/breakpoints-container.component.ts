import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, merge, take } from 'rxjs/operators';
import { AnalyticsService, BreakpointChangePlace, getBreakpointWidth } from '@common';

import { fromTools } from '@tools-state/tools.reducer';
import { BreakpointActions } from '@tools-state/breakpoint/breakpoint.actions';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { getWorkingAreaMode } from '@tools-state/working-area/working-area.selectors';
import { WorkingAreaFacade } from '@tools-state/working-area/working-area-facade.service';

@Component({
  selector: 'ub-breakpoints-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./breakpoints-container.component.scss'],
  template: `
    <ub-breakpoint-switch (breakpointChange)="selectBreakpoint($event)" [breakpoint]="selectedBreakpoint$ | async">
    </ub-breakpoint-switch>

    <ub-breakpoint-width-indicator [breakpointWidth]="workingAreaWidth$ | async"> </ub-breakpoint-width-indicator>
  `
})
export class BreakpointsContainerComponent {
  selectedBreakpoint$: Observable<Breakpoint> = this.store.pipe(select(getSelectedBreakpoint));
  workingAreaWidth$: Observable<number> = this.workingAreaFacade.getIframeWidth();

  constructor(
    private store: Store<fromTools.State>,
    private analytics: AnalyticsService,
    private workingAreaFacade: WorkingAreaFacade
  ) {
  }

  selectBreakpoint(breakpoint: Breakpoint): void {
    this.store.dispatch(BreakpointActions.selectBreakpoint({ breakpoint }));
    this.logChangeBreakpoint(breakpoint);
  }

  private logChangeBreakpoint(breakpoint: Breakpoint): void {
    this.store.pipe(take(1), select(getWorkingAreaMode)).subscribe((mode: WorkingAreaMode) => {
      const breakpointChangePlace = this.getBreakpointChangePlace(mode);
      this.analytics.logChangeBreakpoint(breakpoint.width, breakpointChangePlace, 'icons');
    });
  }

  private getBreakpointChangePlace(mode: WorkingAreaMode): BreakpointChangePlace {
    if (mode === WorkingAreaMode.PREVIEW) {
      return 'preview';
    }

    return 'builder';
  }
}
