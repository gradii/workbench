import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnalyticsService, BreakpointChangePlace } from '@common';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { dispatch } from '@ngneat/effects';
import { BreakpointActions } from '@tools-state/breakpoint/breakpoint.actions';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';

import { fromTools } from '@tools-state/tools.reducer';
import { WorkingAreaFacade } from '@tools-state/working-area/working-area-facade.service';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { getWorkingAreaMode } from '@tools-state/working-area/working-area.selectors';
import { Observable } from 'rxjs';

@Component({
  selector       : 'len-breakpoints-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./breakpoints-container.component.scss'],
  template       : `
    <len-breakpoint-switch (breakpointChange)="selectBreakpoint($event)" [breakpoint]="selectedBreakpoint$ | async">
    </len-breakpoint-switch>

    <len-breakpoint-width-indicator [breakpointWidth]="workingAreaWidth$ | async"></len-breakpoint-width-indicator>
  `
})
export class BreakpointsContainerComponent {
  selectedBreakpoint$: Observable<Breakpoint> = getSelectedBreakpoint;
  workingAreaWidth$: Observable<number>       = this.workingAreaFacade.getIframeWidth();

  constructor(
    private analytics: AnalyticsService,
    private workingAreaFacade: WorkingAreaFacade
  ) {
  }

  selectBreakpoint(breakpoint: Breakpoint): void {
    dispatch(BreakpointActions.SelectBreakpoint(breakpoint));
    this.logChangeBreakpoint(breakpoint);
  }

  private logChangeBreakpoint(breakpoint: Breakpoint): void {
    getWorkingAreaMode.subscribe((mode: WorkingAreaMode) => {
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
