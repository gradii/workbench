import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Theme } from '@common';
import { NbDialogRef, NbToastrService } from '@nebular/theme';

import { ThemeService } from '@tools-state/theme/theme.service';
import { UniqueThemeNameValidator } from './theme.validators';

@Component({
  selector: 'ub-rename-theme',
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
        <button type="reset" nbButton ghost class="basic" size="small" [disabled]="loading" (click)="cancel()">
          CANCEL
        </button>
        <button class="submit-button" nbButton status="success" size="small" [disabled]="loading">
          <ng-container *ngIf="!loading">RENAME</ng-container>
          <nb-icon *ngIf="loading" icon="loader-outline"></nb-icon>
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

  themeForm: FormGroup = this.fb.group({
    name: ['', [Validators.required], [this.uniqueNameValidator]]
  });

  loading: boolean;
  private theme_: Theme;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NbDialogRef<RenameThemeComponent>,
    private uniqueNameValidator: UniqueThemeNameValidator,
    private themeService: ThemeService,
    private toastrService: NbToastrService,
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
        this.toastrService.danger('Please try again', 'Error occurred during theme renaming');
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
