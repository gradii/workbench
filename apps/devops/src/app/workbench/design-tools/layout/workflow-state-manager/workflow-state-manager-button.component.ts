import { Component } from '@angular/core';

import { StateManagerDialogService } from '@workflow-common/state-manager/dialog/state-manager-dialog.service';

@Component({
  selector: 'len-workflow-state-manager-button',
  styleUrls: ['./workflow-state-manager-button.component.scss'],
  template: `
    <button class="bakery-button icon-padding" nbButton ghost (click)="openStateManagerModal()">
      <tri-icon svgIcon="workbench:workflow-state-management"></tri-icon>
      <span class="text">App State Manager</span>
    </button>
  `
})
export class WorkflowStateManagerButtonComponent {
  constructor(private stateManagerDialogService: StateManagerDialogService) {
  }

  openStateManagerModal() {
    this.stateManagerDialogService.open();
  }
}
