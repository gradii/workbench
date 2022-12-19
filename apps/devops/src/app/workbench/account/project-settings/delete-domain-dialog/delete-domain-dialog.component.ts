import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';

import { HostingFacade } from '@root-state/hosting/hosting.facade';
import { Hosting } from '@root-state/hosting/hosting.model';
import { TriDialogRef } from '@gradii/triangle/dialog';

@Component({
  selector: 'len-delete-domain',
  styleUrls: ['./delete-domain-dialog.component.scss'],
  templateUrl: './delete-domain-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteDomainDialogComponent {
  @Input() hosting: Hosting;

  name = '';

  deleteLoading$: Observable<boolean> = this.hostingFacade.hostingView$.pipe(
    map(hostingView => hostingView[this.hosting?.id]?.deleteDomainLoading)
  );

  constructor(private dialogRef: TriDialogRef<DeleteDomainDialogComponent>,
              private hostingFacade: HostingFacade) {
  }

  cancel() {
    this.close();
  }

  delete() {
    this.hostingFacade.deleteDomain(this.hosting.id);
    this.closeOnLoadingFinish();
  }

  private close() {
    this.dialogRef.close();
  }

  private closeOnLoadingFinish() {
    this.deleteLoading$
      .pipe(
        filter((loading: boolean) => !loading),
        take(1)
      )
      .subscribe(() => this.close());
  }
}
