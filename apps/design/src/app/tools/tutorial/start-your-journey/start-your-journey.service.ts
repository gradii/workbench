import { Injectable } from '@angular/core';
import { NbDialogConfig, NbDialogRef } from '@nebular/theme';

import { DialogService } from '@shared/dialog/dialog.service';
import { StartYourJourneyComponent } from './start-your-journey.component';

@Injectable()
export class StartYourJourneyService {
  constructor(private dialogService: DialogService) {
  }

  showStartYourJourneyModal(tutorialProgressId: string): void {
    const config: Partial<NbDialogConfig> = this.createDialogConfig();
    const ref: NbDialogRef<StartYourJourneyComponent> = this.dialogService.open(StartYourJourneyComponent, config);
    ref.componentRef.instance.tutorialProgressId = tutorialProgressId;
    ref.componentRef.changeDetectorRef.detectChanges();
  }

  private createDialogConfig(): Partial<NbDialogConfig> {
    return {
      closeOnBackdropClick: false,
      // @ts-ignore
      backdropClass: ['overlay-backdrop', 'z-index-999']
    };
  }
}
