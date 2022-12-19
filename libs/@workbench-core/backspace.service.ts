import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KeyboardService, MessageAction } from '@common/public-api';

import { CommunicationService } from './communication/communication.service';

@Injectable({ providedIn: 'root' })
export class BackspaceService {
  private attached: boolean;

  private destroyed$ = new Subject<void>();

  constructor(
    private keyboardService: KeyboardService,
    private communicationService: CommunicationService
  ) {}

  attach() {
    if (this.attached) {
      return;
    }
    this.attached = true;
    this.keyboardService.delete$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() =>
        this.communicationService.sendMessage(
          MessageAction.REMOVE_ACTIVE_COMPONENTS
        )
      );
  }

  detach() {
    if (!this.attached) {
      return;
    }
    this.attached = false;
    this.destroyed$.next();
  }
}
