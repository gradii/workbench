import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'kitchen-upgrade-template-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./upgrade-dialog.component.scss'],
  template: `
    <tri-card>
      <tri-card-header>
        <picture class="aspect-ratio-5375">
          <source srcset="assets/image-light.png 1x, assets/image-light@2x.png 2x" />
          <img src="assets/image-light.png" srcset="assets/image-light@2x.png 2x" />
        </picture>
      </tri-card-header>
      <tri-card-body>
        <p class="no-margin">
          Your plan provides only limited set of templates. Upgrade your plan to continue working with the locked
          functionality.
        </p>
        <div class="component-list-margin-sm component-top-margin">
          <button triButton triDialogClose>No, thank you</button>
          <a [routerLink]="['/plans']" triDialogClose triButton color="primary">Upgrade now</a>
        </div>
      </tri-card-body>
    </tri-card>
  `
})
export class UpgradeTemplateDialogComponent {
  constructor() {
  }
}
