import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../environments/environment';
import { FormBuilderService } from '../form-builder.service';
import { FormTemplate } from '../form-template';
import { AnalyticsService } from '@common';

@Component({
  selector: 'ub-continue-editing-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./continue-editing-dialog.component.scss', '../form-builder.component.scss'],
  template: `
    <div class="dialog">
      <img class="dialog-logo" src="assets/sign-up-form-builder-logo.svg" alt="UI Builder" />
      <div class="dialog-description">
        <h2>To continue customizing your Sign Up Form, go to UI Builder</h2>
        <p>Discover a wide range of UI components and Color generator inside.</p>
        <p>Click "Sign Up"</p>
      </div>
      <button
        nbButton
        fullWidth
        status="info"
        [nbSpinner]="loading"
        [nbSpinnerMessage]="'generating'"
        (click)="continueEditingOnClick()"
      >
        Sign up
      </button>
      <button nbButton fullWidth ghost (click)="close()">Skip</button>
    </div>
  `
})
export class ContinueEditingDialogComponent {
  public selectedTemplate: FormTemplate;
  public loading = false;

  constructor(
    protected dialogRef: NbDialogRef<any>,
    private formBuilderService: FormBuilderService,
    private analyticsService: AnalyticsService,
    private cd: ChangeDetectorRef
  ) {
  }

  continueEditingOnClick() {
    this.setLoading(true);
    this.analyticsService.logFormBuilderSignUpUIBakery();
    this.formBuilderService.saveTemporaryProject(this.selectedTemplate).subscribe(
      token => this.continueEditing(token),
      () => this.setLoading(false)
    );
  }

  close() {
    this.analyticsService.logFormBuilderSkip('editing');
    this.dialogRef.close();
  }

  private continueEditing(token: string) {
    this.setLoading(false);
    window.open(`${environment.appServerName}/auth/register?temporaryProjectToken=${token}`, '_blank');
  }

  private setLoading(status: boolean) {
    this.loading = status;
    this.cd.detectChanges();
  }
}
