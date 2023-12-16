import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { FBDownloadService } from '../f-b-download.service';
import { FormTemplate } from '../form-template';
import { AnalyticsService } from '@common';

@Component({
  selector: 'ub-download-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../form-builder.component.scss', './download-form-dialog.component.scss'],
  template: `
    <div class="dialog">
      <img class="dialog-logo" src="assets/sign-up-form-builder-logo.svg" alt="UI Builder" />
      <form class="dialog-description" [formGroup]="form" (submit)="download()">
        <h2>To get the file with source code, please fill in the fields below.</h2>

        <div class="field-wrapper">
          <label class="label">1. Write your Email <span>*</span></label>
          <input
            nbInput
            fullWidth
            type="email"
            placeholder="example@mail.com"
            formControlName="email"
            [class.invalid]="invalidEmail"
            (keyup)="invalidEmail = false"
          />
          <p class="error-message" *ngIf="invalidEmail">Invalid email</p>
        </div>

        <label class="label">2. Do you need this Sign Up Form for personal or business use? <span>*</span></label>
        <nb-radio-group formControlName="usingType">
          <nb-radio value="Personal">Personal</nb-radio>
          <nb-radio value="Business">Business</nb-radio>
        </nb-radio-group>

        <label class="label">3. What industry does your company belong to (IT, healthcare, logistics, etc.)?</label>
        <input placeholder="Industrial" nbInput fullWidth type="text" formControlName="industryType" />

        <label class="label">4. Specify the number of your company employees. </label>
        <input placeholder="1" nbInput fullWidth type="number" formControlName="employeesAmount" />

        <button
          nbButton
          fullWidth
          status="info"
          type="submit"
          [disabled]="form.invalid"
          [nbSpinnerSize]="'small'"
          [nbSpinner]="loading"
          [nbSpinnerMessage]="'GENERATING'"
        >
          Download a form
        </button>
      </form>
      <button nbButton fullWidth ghost (click)="close()">
        Skip
      </button>
    </div>
  `
})
export class DownloadFormDialogComponent {
  public form = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    usingType: this.fb.control('', Validators.required),
    industryType: this.fb.control(''),
    employeesAmount: this.fb.control(null)
  });

  invalidEmail = false;
  loading = false;

  public selectedTemplate: FormTemplate;

  constructor(
    protected dialogRef: NbDialogRef<any>,
    private downloadService: FBDownloadService,
    private fb: FormBuilder,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private analyticsService: AnalyticsService,
    private toastrService: NbToastrService
  ) {
  }

  close() {
    this.analyticsService.logFormBuilderSkip('download');
    if (!this.loading) {
      this.dialogRef.close();
    }
  }

  download() {
    this.analyticsService.logFormBuilderDownloadForm();
    this.submitHubspotForm()
      .pipe(
        catchError(error => {
          if (error.error.errors.find(err => err.errorType === 'INVALID_EMAIL')) {
            throw new Error('INVALID_EMAIL');
          }
          return of();
        }),
        switchMap(() => {
          this.loading = true;
          this.cd.detectChanges();
          return this.downloadService.generateApplication(
            this.selectedTemplate.app,
            this.selectedTemplate.name,
            this.getUserData()
          );
        })
      )
      .subscribe(
        () => {
          this.close();
          this.loading = false;
          this.cd.detectChanges();
        },
        error => {
          this.loading = false;
          if (error.message === 'INVALID_EMAIL') {
            this.invalidEmail = true;
          } else {
            this.toastrService.danger('unknown error', 'Generating fail');
          }
          this.cd.detectChanges();
        }
      );
  }

  private getUserData() {
    return this.form.value;
  }

  private submitHubspotForm() {
    const url =
      'https://api.hsforms.com/submissions/v3/integration/submit/2452262/a3186b35-c0ab-461c-b9e6-4c3546cd4155';
    const formData = this.form.value;
    const body = {
      fields: [
        {
          name: 'email',
          value: formData.email
        },
        {
          name: 'industry',
          value: formData.industryType
        },
        {
          name: 'company_size',
          value: formData.employeesAmount || 0
        },
        {
          name: 'job_function',
          value: formData.usingType
        },
        {
          name: 'lead_source',
          value: 'UB Form Builder'
        },
        {
          name: 'interests_existing_products_services',
          value: 'UI Builder'
        }
      ]
    };

    return this.http.post(url, body);
  }
}
