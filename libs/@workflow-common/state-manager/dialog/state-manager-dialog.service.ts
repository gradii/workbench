import { Injectable } from '@angular/core';
import { TriDialogService } from '@gradii/triangle/dialog';

import { StateManagerComponent } from '../state-manager.component';

interface StateManagerModalConfig {
  createMode: boolean;
  closeOnCreate: boolean;
}

@Injectable()
export class StateManagerDialogService {
  constructor(private dialogService: TriDialogService) {
  }

  open(createMode?: boolean, closeOnCreate?: boolean) {
    const context: StateManagerModalConfig = {
      createMode: !!createMode,
      closeOnCreate: !!closeOnCreate
    };
    const dialogConfig = { context };
    return this.dialogService.open(StateManagerComponent, dialogConfig);
  }
}
