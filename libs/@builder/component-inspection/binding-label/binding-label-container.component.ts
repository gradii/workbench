import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UserFacade } from '@auth/user-facade.service';
import { UserService } from '@auth/user.service';

import { fromTools } from '@tools-state/tools.reducer';
import { Subject } from 'rxjs';

@Component({
  selector       : 'pf-binding-label-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <div style="display: flex; justify-content: space-between; align-items:center">
      <ng-content></ng-content>

      <button triButton variant="text" size="xsmall" (click)="onClickBinding($event)">
        <tri-icon svgIcon="outline:thunderbolt"></tri-icon>
      </button>
    </div>
  `,
  styles         : [
    `:host {
      flex: 1;
    }`
  ]
})
export class BindingLabelContainerComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  constructor(
    private userFacade: UserFacade,
    private userService: UserService
  ) {
  }

  onClickBinding(event: MouseEvent) {
    event.stopPropagation();
    // this.userFacade.openBindingDialog();
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
