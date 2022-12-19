import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Theme } from '@common';
import { TriDialogRef } from '@gradii/triangle/dialog';
import { TriNotificationService } from '@gradii/triangle/notification';

import { ThemeService } from '@tools-state/theme/theme.service';
import { UniqueThemeNameValidator } from './theme.validators';

@Component({
  selector: 'len-rename-theme',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./theme-form.scss'],
  template: `
    <form class="form" [formGroup]="themeForm" (ngSubmit)="onSubmit()" #formElement="ngForm">
      <span class="form-title">Rename theme</span>
      <label for="name-input">New theme name</label>
      <input id="name-input" class="name-input" placeholder="name" nbInput fullWidth formControlName="name" />
      <div *ngIf="isNameInvalid()" class="validation-errors">
        <div *ngIf="isNameHasError('required')">Theme name is required</div>
        <div *ngIf="isNameHasError('unique')">Theme with that name already exists.</div>
      </div>
      <div class="button-container">
        <button type="reset" triButton ghost class="basic" size="small" [disabled]="loading" (click)="cancel()">
          CANCEL
        </button>
        <button class="submit-button" triButton color="success" size="small" [disabled]="loading">
          <ng-container *ngIf="!loading">RENAME</ng-container>
          <tri-icon *ngIf="loading" svgIcon="outline:loader"></tri-icon>
        </button>
      </div>
    </form>
  `
})
export class RenameThemeComponent {
  @Input() set theme(theme: Theme) {
    this.theme_ = theme;
    this.themeForm.patchValue({ name: theme.name });
  }

  @ViewChild('formElement', { static: true }) formElement: FormGroupDirective;

  themeForm: UntypedFormGroup = this.fb.group({
    name: ['', [Validators.required], [this.uniqueNameValidator]]
  });

  loading: boolean;
  private theme_: Theme;

  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: TriDialogRef<RenameThemeComponent>,
    private uniqueNameValidator: UniqueThemeNameValidator,
    private themeService: ThemeService,
    private toastrService: TriNotificationService,
    private changeDetectionRef: ChangeDetectorRef
  ) {
  }

  onSubmit() {
    if (!this.themeForm.valid) {
      return;
    }
    this.loading = true;
    this.themeForm.disable();
    this.themeService.renameTheme({ newName: this.themeForm.value.name, id: this.theme_.id }).subscribe(
      () => {
        this.dialogRef.close(this.themeForm.value.name);
      },
      () => {
        this.loading = false;
        this.themeForm.enable();
        this.toastrService.error('Please try again', 'Error occurred during theme renaming');
        this.changeDetectionRef.markForCheck();
      }
    );
  }

  cancel() {
    this.dialogRef.close();
  }

  isNameInvalid(): boolean {
    return this.formElement.submitted && this.themeForm.controls.name.invalid;
  }

  isNameHasError(errorName: string): boolean {
    return this.themeForm.controls.name.errors[errorName];
  }
}
