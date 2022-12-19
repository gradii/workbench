import { fromEvent, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmWindowService {
  // Subscription blocking closing page while image loading
  private static ACTIVE_CONFIRM_SUB: Subscription;
  private static SUB_COUNTER = 0;

  constructor() {
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
      ConfirmWindowService.ACTIVE_CONFIRM_SUB = fromEvent(window, 'beforeunload')
        .subscribe((event: Event) => {
          event.preventDefault();
          event.returnValue = false;
        });
    }
  }
}
