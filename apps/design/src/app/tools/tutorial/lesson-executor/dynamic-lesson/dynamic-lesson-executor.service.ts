import { Injectable } from '@angular/core';
import { NbDialogConfig } from '@nebular/theme';

import { DynamicLessonComponent } from './dynamic-lesson.component';
import { LessonExecutor } from '../lesson-executor';
import { DialogService } from '@shared/dialog/dialog.service';
import { DialogRef } from '@shared/dialog/dialog-ref';

@Injectable()
export class DynamicLessonExecutorService implements LessonExecutor {
  private dialogRef: DialogRef<DynamicLessonComponent>;

  constructor(private dialogService: DialogService) {
  }

  startLesson(): void {
    const config: Partial<NbDialogConfig> = this.createDialogConfig();
    this.dialogRef = this.dialogService.open(DynamicLessonComponent, config);
    this.disablePointerEvents();
  }

  forceComplete(): void {
    this.dialogRef.close();
  }

  private createDialogConfig(): Partial<NbDialogConfig> {
    return {
      hasBackdrop: false,
      closeOnEsc: false,
      backdropClass: 'z-index-999'
    };
  }

  private disablePointerEvents(): void {
    const overlayRef = (this.dialogRef as any).overlayRef;
    overlayRef._togglePointerEvents();
  }
}
