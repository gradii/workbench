import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ub-continue-editing-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./welcome-dialog.component.scss', '../form-builder.component.scss'],
  template: `
    <div class="wrapper">
      <img class="dialog-side" src="assets/uibakery-preview.png" alt="UI Builder preview" />
      <div class="dialog welcome">
        <img class="dialog-logo" src="assets/sign-up-form-builder-logo.svg" alt="UI Builder" />
        <div class="dialog-description">
          <h2>Welcome to UI Builder Tools!</h2>
          <p>
            Create your Sign Up Form with UI Builder for free. Choose a template, fill in the fields, and select a color.
            Voila!
          </p>
          <p>
            You can get the ready Sign Up Form to your email, or continue customizing in UI Builder
          </p>
        </div>
        <button nbButton fullWidth status="info" (click)="close()">Start creating a form</button>
      </div>
    </div>
  `
})
export class WelcomeDialogComponent {
  constructor(protected dialogRef: NbDialogRef<any>) {
  }

  close() {
    this.dialogRef.close();
  }
}
