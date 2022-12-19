import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { containsNoMoreNChars, Theme, getConfigValue } from '@common';
import { TriDialogRef } from '@gradii/triangle/dialog';
import { TriNotificationService } from '@gradii/triangle/notification';

import { lightTheme, darkTheme } from '@tools-state/theme/theme.reducer';
import { ThemeService } from '@tools-state/theme/theme.service';
import { UniqueThemeNameValidator } from './theme.validators';

@Component({
  selector: 'len-new-theme',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./theme-form.scss'],
  template: `
    <form class="form" [formGroup]="newTheme" (ngSubmit)="onSubmit()" #formElement="ngForm">
      <span class="form-title">To start generate your theme choose one of themes to start customize yours</span>
      <label for="name-input">Your theme name</label>
      <input id="name-input" class="name-input" placeholder="name" triTrim nbInput fullWidth formControlName="name" />
      <div *ngIf="isNameInvalid()" class="validation-errors">
        <div *ngIf="isNameHasError('required')">Theme name is required</div>
        <div *ngIf="isNameHasError('unique')">Theme with that name already exists</div>
        <div *ngIf="isNameHasError('tooManyChars')">Theme name should not contain more than 140 symbols</div>
      </div>
      <label>Choose starter theme</label>
      <div class="preview-container">
        <len-theme-item [theme]="lightTheme" [class.active]="!dark" (click)="dark = false"></len-theme-item>
        <len-theme-item [theme]="darkTheme" [class.active]="dark" (click)="dark = true"></len-theme-item>
      </div>
      <div class="button-container">
        <button class="submit-button" nbButton status="primary" size="small" [disabled]="loading">
          <ng-container *ngIf="!loading">DONE</ng-container>
          <nb-icon *ngIf="loading" icon="loader-outline"></nb-icon>
        </button>
      </div>
    </form>
  `
})
export class NewThemeComponent {
  dark = false;
  newTheme: UntypedFormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, containsNoMoreNChars(getConfigValue('theme.name.maxLength'))],
      [this.uniqueNameValidator]
    ]
  });

  lightTheme: Theme = lightTheme;
  darkTheme: Theme = darkTheme;

  loading: boolean;

  @ViewChild('formElement', { static: true }) formElement: FormGroupDirective;

  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: TriDialogRef<NewThemeComponent>,
    private uniqueNameValidator: UniqueThemeNameValidator,
    private themeService: ThemeService,
    private toastrService: TriNotificationService,
    private changeDetectionRef: ChangeDetectorRef
  ) {
  }

  onSubmit() {
    if (!this.newTheme.valid) {
      return;
    }
    this.loading = true;
    this.newTheme.disable();
    this.themeService.createTheme({ name: this.newTheme.value.name, dark: this.dark }).subscribe(
      (theme: Theme) => {
        this.dialogRef.close(theme);
      },
      () => {
        this.loading = false;
        this.newTheme.enable();
        this.toastrService.error('Please try again', 'Error occurred during theme creation');
        this.changeDetectionRef.markForCheck();
      }
    );
  }

  isNameInvalid(): boolean {
    return this.formElement.submitted && this.newTheme.controls.name.invalid;
  }

  isNameHasError(errorName: string): boolean {
    return this.newTheme.controls.name.errors[errorName];
  }
}
