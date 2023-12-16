import { Injectable } from '@angular/core';
import { KeyboardService, MessageAction } from '@common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CommunicationService } from './communication/communication.service';

@Injectable({ providedIn: 'root' })
export class ShortcutService {
  private attached: boolean;

  private destroyed$ = new Subject();

  constructor(private keyboardService: KeyboardService, private communicationService: CommunicationService) {
  }

  attach() {
    if (this.attached) {
      return;
    }
    this.attached = true;
    this.keyboardService.undo$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.communicationService.sendMessage(MessageAction.UNDO));

    this.keyboardService.redo$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.communicationService.sendMessage(MessageAction.REDO));
  }

  detach() {
    if (!this.attached) {
      return;
    }
    this.attached = false;
    this.destroyed$.next();
  }
}
