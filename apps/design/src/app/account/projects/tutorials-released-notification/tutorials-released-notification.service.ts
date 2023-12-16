import { Injectable } from '@angular/core';
import { NbDialogConfig } from '@nebular/theme';

import { TutorialsReleasedNotificationComponent } from './tutorials-released-notification.component';
import { DialogService } from '@shared/dialog/dialog.service';

@Injectable()
export class TutorialsReleasedNotificationService {
  constructor(private dialogService: DialogService) {
  }

  showTutorialReleasedModal(): void {
    const config: Partial<NbDialogConfig> = this.createDialogConfig();
    this.dialogService.open(TutorialsReleasedNotificationComponent, config);
  }

  private createDialogConfig(): Partial<NbDialogConfig> {
    return {
      closeOnBackdropClick: false,
      // @ts-ignore
      backdropClass: ['overlay-backdrop', 'z-index-999']
    };
  }
}
