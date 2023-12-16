import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'oven-upgrade-template-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./upgrade-dialog.component.scss'],
  template: `
    <nb-card>
      <nb-card-header>
        <picture class="aspect-ratio-5375">
          <source srcset="assets/image-light.png 1x, assets/image-light@2x.png 2x" />
          <img src="assets/image-light.png" srcset="assets/image-light@2x.png 2x" />
        </picture>
      </nb-card-header>
      <nb-card-body>
        <p class="no-margin">
          Your plan provides only limited set of templates. Upgrade your plan to continue working with the locked
          functionality.
        </p>
        <div class="component-list-margin-sm component-top-margin">
          <button nbButton (click)="close()">No, thank you</button>
          <a [routerLink]="['/plans']" (click)="close()" nbButton status="primary">Upgrade now</a>
        </div>
      </nb-card-body>
    </nb-card>
  `
})
export class UpgradeTemplateDialogComponent {
  constructor(private dialogRef: NbDialogRef<UpgradeTemplateDialogComponent>) {
  }

  close() {
    this.dialogRef.close();
  }
}
