import { Injectable } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { share, takeUntil } from 'rxjs/operators';

import { CommunicationService } from '@shared/communication/communication.service';
import { MessageData } from '@common';

@Injectable({ providedIn: 'root' })
export class UIActionIntentService {
  private listenCommunicationUntil: Subject<void> = new Subject();

  readonly connectDataSource$: Observable<MessageData<void>> = this.communication.connectDataSource$.pipe(
    takeUntil(this.listenCommunicationUntil),
    share()
  );

  readonly fixDataSource$: Observable<MessageData<void>> = this.communication.fixDataSource$.pipe(
    takeUntil(this.listenCommunicationUntil),
    share()
  );

  readonly showSequenceSource$: Observable<MessageData<void>> = this.communication.showSequenceSource$.pipe(
    takeUntil(this.listenCommunicationUntil),
    share()
  );

  readonly connectOrFixDataSource$: Observable<MessageData<void>> = merge(
    this.connectDataSource$,
    this.fixDataSource$
  ).pipe(takeUntil(this.listenCommunicationUntil), share());

  constructor(private communication: CommunicationService) {
  }

  detach() {
    this.listenCommunicationUntil.next();
  }
}
