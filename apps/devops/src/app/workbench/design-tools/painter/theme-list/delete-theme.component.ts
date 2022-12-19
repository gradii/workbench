import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Theme } from '@common';
import { TriDialogRef } from '@gradii/triangle/dialog';
import { TriNotificationService } from '@gradii/triangle/notification';

import { ThemeService } from '@tools-state/theme/theme.service';

@Component({
  selector       : 'len-delete-theme',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./theme-form.scss'],
  template       : `
    <div class="form">
      <span class="form-title">Are you sure to delete {{ theme.name }}?</span>
      <div class="button-container">
        <button type="reset" triButton ghost class="basic" size="small" [disabled]="loading" (click)="cancel()">
          CANCEL
        </button>
        <button class="submit-button" triButton color="success" size="small" [disabled]="loading" (click)="submit()">
          <ng-container *ngIf="!loading">CONFIRM</ng-container>
          <nb-icon *ngIf="loading" icon="loader-outline"></nb-icon>
        </button>
      </div>
    </div>
  `
})
export class DeleteThemeComponent {
  @Input() theme: Theme;

  loading: boolean;

  constructor(
    private dialogRef: TriDialogRef<DeleteThemeComponent>,
    private themeService: ThemeService,
    private toastrService: TriNotificationService,
    private changeDetectionRef: ChangeDetectorRef
  ) {
  }

  submit() {
    this.loading = true;
    this.themeService.deleteTheme(this.theme.id).subscribe(
      () => {
        this.dialogRef.close(true);
      },
      () => {
        this.loading = false;
        this.toastrService.error('Please try again', 'Error occurred during theme renaming');
        this.changeDetectionRef.markForCheck();
      }
    );
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
