import { fromEvent, Subscription } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { NB_WINDOW } from '@nebular/theme';

@Injectable({ providedIn: 'root' })
export class ConfirmWindowService {
  // Subscription blocking closing page while image loading
  private static ACTIVE_CONFIRM_SUB: Subscription;
  private static SUB_COUNTER = 0;

  constructor(@Inject(NB_WINDOW) private window) {
  }

  disableConfirmClosingPage(): void {
    if (ConfirmWindowService.ACTIVE_CONFIRM_SUB && ConfirmWindowService.SUB_COUNTER) {
      ConfirmWindowService.SUB_COUNTER--;
      if (!ConfirmWindowService.SUB_COUNTER) {
        ConfirmWindowService.ACTIVE_CONFIRM_SUB.unsubscribe();
      }
    }
  }

  enableConfirmClosingPage(): void {
    ConfirmWindowService.SUB_COUNTER++;
    if (!ConfirmWindowService.ACTIVE_CONFIRM_SUB) {
      ConfirmWindowService.ACTIVE_CONFIRM_SUB = fromEvent(this.window, 'beforeunload').subscribe((event: Event) => {
        event.preventDefault();
        event.returnValue = false;
      });
    }
  }
}
