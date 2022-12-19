import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TriDialogRef } from '@gradii/triangle/dialog';

@Component({
  selector       : 'kitchen-upgrade-pages-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./upgrade-pages-dialog.component.scss'],
  template       : `
    <tri-card>
      <tri-card-header>
        Free Plan Limit
      </tri-card-header>
      <tri-card-body>
        <p>
          You are using a Free plan, upgrade your plan here.
        </p>
        <div>
          <button class="text-capitalize color-white" triButton variant="text" size="small" (click)="close()">
            No, thanks
          </button>
          <a [routerLink]="['/plans']"
             (click)="close()"
             size="small"
             triButton
             color="success">
            Upgrade now
          </a>
        </div>
      </tri-card-body>
    </tri-card>
  `
})
export class UpgradePagesDialogComponent {
  constructor(private dialogRef: TriDialogRef<UpgradePagesDialogComponent>) {
  }

  close() {
    this.dialogRef.close();
  }
}
