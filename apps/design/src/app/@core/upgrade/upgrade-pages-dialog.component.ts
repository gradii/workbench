import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'oven-upgrade-pages-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./upgrade-pages-dialog.component.scss'],
  template: `
    <nb-card>
      <nb-card-header>
        <img src="assets/pages-free.png" />
      </nb-card-header>
      <nb-card-body>
        <p>
          You are on a Free plan, which provides only 1 private app, 2 pages and 2 themes. To continue working with the
          locked functionality, upgrade your plan to have more possibilities in the app.
        </p>
        <div>
          <button class="text-capitalize color-white" nbButton ghost size="small" (click)="close()">
            No, thank you
          </button>
          <a [routerLink]="['/plans']" (click)="close()" size="small" nbButton status="success">
            Upgrade now
          </a>
        </div>
      </nb-card-body>
    </nb-card>
  `
})
export class UpgradePagesDialogComponent {
  constructor(private dialogRef: NbDialogRef<UpgradePagesDialogComponent>) {
  }

  close() {
    this.dialogRef.close();
  }
}
