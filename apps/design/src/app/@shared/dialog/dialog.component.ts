import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { NbDialogConfig, NbDialogContainerComponent, NbFocusTrapFactoryService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { AnimationEvent } from '@angular/animations';

import { dialogEnterLeaveAnimation } from './dialog-animation';

@Component({
  selector: 'ub-dialog',
  template: '<ng-template nbPortalOutlet></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[@dialogEnterLeave]': `state`,
    '(@dialogEnterLeave.done)': 'closeAnimationDone($event)'
  },
  animations: [dialogEnterLeaveAnimation]
})
export class DialogComponent extends NbDialogContainerComponent {
  state: 'enter' | 'leave' = 'enter';

  closeAnimationDone$ = new Subject<AnimationEvent>();
  private dialogRes;

  constructor(
    private cd: ChangeDetectorRef,
    config: NbDialogConfig,
    elementRef: ElementRef,
    focusTrapFactory: NbFocusTrapFactoryService
  ) {
    super(config, elementRef, focusTrapFactory);
  }

  animateClose(res) {
    this.state = 'leave';
    this.cd.markForCheck();
    this.dialogRes = res;
  }

  closeAnimationDone(event: AnimationEvent) {
    if (event.toState === 'leave') {
      this.closeAnimationDone$.next(this.dialogRes);
      this.closeAnimationDone$.complete();
    }
  }
}
