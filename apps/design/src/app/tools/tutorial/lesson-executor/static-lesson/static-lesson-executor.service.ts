import { Injectable } from '@angular/core';
import { NbDialogConfig } from '@nebular/theme';

import { StaticLessonComponent } from './static-lesson.component';
import { LessonExecutor } from '../lesson-executor';
import { DialogService } from '@shared/dialog/dialog.service';
import { DialogRef } from '@shared/dialog/dialog-ref';

@Injectable()
export class StaticLessonExecutorService implements LessonExecutor {
  private dialogRef: DialogRef<StaticLessonComponent>;

  constructor(private dialogService: DialogService) {
  }

  startLesson(): void {
    const config: Partial<NbDialogConfig> = this.createDialogConfig();
    this.dialogRef = this.dialogService.open(StaticLessonComponent, config);
  }

  forceComplete(): void {
    this.dialogRef.close();
  }

  private createDialogConfig(): Partial<NbDialogConfig> {
    return {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      // @ts-ignore
      backdropClass: ['overlay-backdrop', 'z-index-999']
    };
  }
}
