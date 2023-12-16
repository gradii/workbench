import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Theme } from '@common';
import { NbDialogRef, NbToastrService } from '@nebular/theme';

import { ThemeService } from '@tools-state/theme/theme.service';

@Component({
  selector: 'ub-delete-theme',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./theme-form.scss'],
  template: `
    <div class="form">
      <span class="form-title">Are you sure to delete {{ theme.name }}?</span>
      <div class="button-container">
        <button type="reset" nbButton ghost class="basic" size="small" [disabled]="loading" (click)="cancel()">
          CANCEL
        </button>
        <button class="submit-button" nbButton status="success" size="small" [disabled]="loading" (click)="submit()">
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
    private dialogRef: NbDialogRef<DeleteThemeComponent>,
    private themeService: ThemeService,
    private toastrService: NbToastrService,
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
        this.toastrService.danger('Please try again', 'Error occurred during theme renaming');
        this.changeDetectionRef.markForCheck();
      }
    );
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
