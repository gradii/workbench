import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { NB_WINDOW } from '@nebular/theme';
import { AnalyticsService } from '@common';

import { BreakpointActions } from '@tools-state/breakpoint/breakpoint.actions';
import { WindowBreakpointService } from '@core/breakpoint/window-breakpoint.service';
import { fromTools } from '@tools-state/tools.reducer';
import { getChangedManually } from '@tools-state/breakpoint/breakpoint.selectors';

@Component({
  selector: 'ub-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./preview.component.scss'],
  template: ` <nb-layout></nb-layout> `
})
export class PreviewComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  constructor(
    private windowBreakpointService: WindowBreakpointService,
    private store: Store<fromTools.State>,
    private analytics: AnalyticsService,
    @Inject(NB_WINDOW) private window: Window
  ) {
  }

  ngOnInit() {
    this.setInitialBreakpoint();
    this.updateBreakpoint();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  private setInitialBreakpoint() {
    this.store
      .pipe(
        select(getChangedManually),
        filter((changedManually: boolean) => !changedManually),
        map(() => this.windowBreakpointService.getActiveBreakpoint(this.window)),
        takeUntil(this.destroyed$)
      )
      .subscribe(breakpoint => {
        this.store.dispatch(BreakpointActions.selectBreakpoint({ breakpoint }));
      });
  }

  private updateBreakpoint() {
    this.windowBreakpointService
      .breakpointChanges()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(breakpoint => {
        this.store.dispatch(BreakpointActions.selectBreakpoint({ breakpoint }));
        this.analytics.logChangeBreakpoint(breakpoint.width, 'preview', 'browserResize');
      });
  }
}
