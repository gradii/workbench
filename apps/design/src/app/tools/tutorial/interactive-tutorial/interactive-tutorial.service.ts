import { Injectable } from '@angular/core';

import { InteractiveTutorialDialogComponent } from './interactive-tutorial-dialog.component';
import { DialogService } from '@shared/dialog/dialog.service';

@Injectable()
export class InteractiveTutorialService {
  constructor(private dialogService: DialogService) {
  }

  open() {
    this.dialogService.open(InteractiveTutorialDialogComponent);
  }
}
