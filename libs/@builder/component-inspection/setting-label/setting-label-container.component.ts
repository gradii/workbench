import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserFacade } from '@auth/user-facade.service';
import { UserService } from '@auth/user.service';
import { BreakpointWidth } from '@common/public-api';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { TooltipPosition } from '@gradii/triangle/tooltip/src/tooltip.interface';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector       : 'pf-setting-label-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <pf-notification-label
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
    </pf-notification-label>
  `
})
export class SettingLabelContainerComponent implements OnInit, OnDestroy {
  @Input() showNotification                       = true;
  @Input() notificationPlacement: TooltipPosition = 'left';
  @Input() notificationDisabled                   = false;

  saveViewedResponsiveStylesNotification$ = new Subject<void>();

  private destroyed$                                              = new Subject<void>();
  private viewedResponsiveStyleNotification$: Observable<boolean> = this.userFacade.viewedResponsiveStyleNotification$;
  private desktopBreakpoint$: Observable<boolean>                 = getSelectedBreakpoint.pipe(
    map((breakpoint: Breakpoint) => breakpoint.width === BreakpointWidth.Desktop)
  );

  pulse$: Observable<boolean> = combineLatest([this.viewedResponsiveStyleNotification$, this.desktopBreakpoint$]).pipe(
    map(([viewedResponsiveStyleNotification, desktopBreakpoint]) => {
      return !viewedResponsiveStyleNotification && !desktopBreakpoint;
    })
  );

  constructor(
    private userFacade: UserFacade,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    // this.saveViewedResponsiveStylesNotification$
    //   .pipe(
    //     switchMap(() => this.viewedResponsiveStyleNotification$),
    //     filter((viewed: boolean) => !viewed),
    //     takeUntil(this.destroyed$)
    //   )
    //   .subscribe(() => this.userService.saveViewedResponsiveStylesNotification());
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
