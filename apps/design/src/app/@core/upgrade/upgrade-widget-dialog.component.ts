import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'oven-upgrade-widget-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./upgrade-dialog.component.scss'],
  template: `
    <nb-card>
      <nb-card-header>
        <div class="picture-container">
          <picture class="aspect-ratio-100">
            <source srcset="assets/free-plan.png 1x, assets/free-plan@2x.png 2x" />
            <img src="assets/free-plan.png" srcset="assets/free-plan@2x.png 2x" />
          </picture>
        </div>
      </nb-card-header>
      <nb-card-body>
        <p class="no-margin">
          You are on Free plan, which provides only limited set of widgets. Upgrade your plan to continue working with
          the locked functionality.
        </p>
        <div class="component-list-margin-sm component-top-margin">
          <button nbButton (click)="close()">No, thank you</button>
          <a [routerLink]="['/plans']" nbButton status="primary">Upgrade now</a>
        </div>
      </nb-card-body>
    </nb-card>
  `
})
export class UpgradeWidgetDialogComponent {
  constructor(private dialogRef: NbDialogRef<UpgradeWidgetDialogComponent>) {
  }

  close() {
    this.dialogRef.close();
  }
}
