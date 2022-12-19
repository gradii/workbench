import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TriDialogRef } from '@gradii/triangle/dialog';

@Component({
  selector       : 'kitchen-upgrade-painter-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./upgrade-dialog.component.scss'],
  template       : `
    <tri-card>
      <tri-card-header>
        <div class="picture-container">
          <picture class="aspect-ratio-100">
            <source srcset="assets/free-plan.png 1x, assets/free-plan@2x.png 2x" />
            <img src="assets/free-plan.png" srcset="assets/free-plan@2x.png 2x" />
          </picture>
        </div>
      </tri-card-header>
      <tri-card-body>
        <p class="no-margin">
          You are on Free plan, which provides only limited set of themes. Upgrade your plan to continue working with
          the locked functionality.
        </p>
        <div class="component-list-margin-sm component-top-margin">
          <button triButton tri-dialog-close>No, thank you</button>
          <a [routerLink]="['/plans']" triButton color="primary">Upgrade now</a>
        </div>
      </tri-card-body>
    </tri-card>
  `
})
export class UpgradePainterDialogComponent {
  constructor() {
  }
}
