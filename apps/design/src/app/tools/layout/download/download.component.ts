import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DownloadFacade } from '@tools-state/download/download-facade.service';

@Component({
  selector: 'ub-download',
  styleUrls: ['./download.component.scss'],
  template: `
    <button
      class="bakery-button"
      nbButton
      ghost
      [nbPopover]="download"
      nbPopoverAdjustment="noop"
      nbPopoverPlacement="bottom-start"
      [nbSpinner]="loading$ | async"
      nbSpinnerSize="tiny"
    >
      <bc-icon name="download" *ngIf="(clear$ | async) && !(loading$ | async)"></bc-icon>
      <bc-icon class="success" name="checkmark-outline" *ngIf="success$ | async"></bc-icon>
      <bc-icon class="error" name="close-outline" *ngIf="errored$ | async"></bc-icon>
    </button>

    <ng-template #download>
      <ub-download-popup (download)="downloadCode()" (downloadSample)="downloadSample()" [loading]="loading$ | async">
      </ub-download-popup>
    </ng-template>
  `
})
export class DownloadComponent {
  loading$: Observable<boolean> = combineLatest([
    this.downloadFacade.loading$,
    this.downloadFacade.loadingSample$
  ]).pipe(map(([s1, s2]) => s1 || s2));
  errored$ = combineLatest([this.downloadFacade.errored$, this.downloadFacade.loadingSampleFailed$]).pipe(
    map(([s1, s2]) => s1 || s2)
  );
  success$ = combineLatest([this.downloadFacade.success$, this.downloadFacade.loadingSampleSuccess$]).pipe(
    map(([s1, s2]) => s1 || s2)
  );
  clear$ = combineLatest([this.errored$, this.success$]).pipe(map(([errored, success]) => !errored && !success));

  constructor(private downloadFacade: DownloadFacade) {
  }

  downloadCode() {
    this.downloadFacade.downloadApp();
  }

  downloadSample() {
    this.downloadFacade.downloadSample();
  }
}
