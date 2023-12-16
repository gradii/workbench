import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { BreakpointWidth } from '@common';
import { select, Store } from '@ngrx/store';

import { fromTools } from '@tools-state/tools.reducer';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';
import { UserFacade } from '@auth/user-facade.service';
import { UserService } from '@auth/user.service';
import { Breakpoint } from '@core/breakpoint/breakpoint';

@Component({
  selector: 'ub-setting-label-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-notification-label
      [tooltipText]="
        'The blue dot indicates that this property will be changed only for the current and smaller screen sizes.'
      "
      [showNotification]="showNotification"
      [notificationPlacement]="notificationPlacement"
      [notificationDisabled]="notificationDisabled"
      [pulse]="pulse$ | async"
      (viewed)="saveViewedResponsiveStylesNotification$.next()"
    >
      <ng-content></ng-content>
    </bc-notification-label>
  `
})
export class SettingLabelContainerComponent implements OnInit, OnDestroy {
  @Input() showNotification = true;
  @Input() notificationPlacement = 'start';
  @Input() notificationDisabled = false;

  saveViewedResponsiveStylesNotification$ = new Subject();

  private destroyed$ = new Subject();
  private viewedResponsiveStyleNotification$: Observable<boolean> = this.userFacade.viewedResponsiveStyleNotification$;
  private desktopBreakpoint$: Observable<boolean> = this.store.pipe(
    select(getSelectedBreakpoint),
    map((breakpoint: Breakpoint) => breakpoint.width === BreakpointWidth.Desktop)
  );

  pulse$: Observable<boolean> = combineLatest([this.viewedResponsiveStyleNotification$, this.desktopBreakpoint$]).pipe(
    map(([viewedResponsiveStyleNotification, desktopBreakpoint]) => {
      return !viewedResponsiveStyleNotification && !desktopBreakpoint;
    })
  );

  constructor(
    private store: Store<fromTools.State>,
    private userFacade: UserFacade,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.saveViewedResponsiveStylesNotification$
      .pipe(
        switchMap(() => this.viewedResponsiveStyleNotification$),
        filter((viewed: boolean) => !viewed),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => this.userService.saveViewedResponsiveStylesNotification());
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
