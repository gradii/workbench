import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AnalyticsService } from '@common';
import { WindowBreakpointService } from '@core/breakpoint/window-breakpoint.service';
import { dispatch } from '@ngneat/effects';

import { BreakpointActions } from '@tools-state/breakpoint/breakpoint.actions';
import { getChangedManually } from '@tools-state/breakpoint/breakpoint.selectors';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

@Component({
  selector       : 'len-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./preview.component.scss'],
  template       : `
    <tri-layout></tri-layout> `
})
export class PreviewComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  private window;

  constructor(
    private windowBreakpointService: WindowBreakpointService,
    private analytics: AnalyticsService
  ) {
    this.window = window;
  }

  ngOnInit() {
    this.setInitialBreakpoint();
    this.updateBreakpoint();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  private setInitialBreakpoint() {
    getChangedManually
      .pipe(
        filter((changedManually: boolean) => !changedManually),
        map(() => this.windowBreakpointService.getActiveBreakpoint(this.window)),
        takeUntil(this.destroyed$)
      )
      .subscribe(breakpoint => {
        dispatch(BreakpointActions.SelectBreakpoint(breakpoint));
      });
  }

  private updateBreakpoint() {
    this.windowBreakpointService
      .breakpointChanges()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(breakpoint => {
        dispatch(BreakpointActions.SelectBreakpoint(breakpoint));
        this.analytics.logChangeBreakpoint(breakpoint.width, 'preview', 'browserResize');
      });
  }
}
