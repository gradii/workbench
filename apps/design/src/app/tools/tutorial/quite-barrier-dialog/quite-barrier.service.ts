import { Injectable } from '@angular/core';

import { DialogService } from '@shared/dialog/dialog.service';
import { QuiteBarrierDialogComponent } from './quite-barrier-dialog.component';

@Injectable()
export class QuiteBarrierService {
  constructor(private dialogService: DialogService) {
  }

  open() {
    this.dialogService.open(QuiteBarrierDialogComponent, {
      closeOnEsc: false,
      closeOnBackdropClick: false
    });
  }
}
