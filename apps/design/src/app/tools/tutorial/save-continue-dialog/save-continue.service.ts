import { Injectable } from '@angular/core';

import { DialogService } from '@shared/dialog/dialog.service';
import { SaveContinueDialogComponent } from './save-continue-dialog.component';

@Injectable()
export class SaveContinueService {
  constructor(private dialogService: DialogService) {
  }

  open() {
    this.dialogService.open(SaveContinueDialogComponent, {
      closeOnEsc: false,
      closeOnBackdropClick: false
    });
  }
}
