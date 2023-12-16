import { Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { delay, take, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';

import { AnalyticsService } from '@common';
import { VideoTutorialDialogComponent } from './video-tutorial-dialog.component';

@Injectable()
export class VideoTutorialService {
  constructor(private dialogService: NbDialogService, private analyticsService: AnalyticsService) {
  }

  open(initialVideoId: string = '') {
    this.analyticsService.logOpenVideoTutorial();
    const dialogRef = this.dialogService.open(VideoTutorialDialogComponent);
    dialogRef.componentRef.instance.initialVideoId = initialVideoId;
    dialogRef.onClose.pipe(take(1)).subscribe(() => this.analyticsService.logCloseVideoTutorial());

    of(null)
      .pipe(delay(15000), takeUntil(dialogRef.onClose))
      .subscribe(() => this.analyticsService.logVideoTutorialWatched15());

    return dialogRef;
  }
}
