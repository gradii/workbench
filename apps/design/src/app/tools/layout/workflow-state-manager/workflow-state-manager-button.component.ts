import { Component } from '@angular/core';

import { StateManagerDialogService } from '../../workflow/state-manager/dialog/state-manager-dialog.service';

@Component({
  selector: 'ub-workflow-state-manager-button',
  styleUrls: ['./workflow-state-manager-button.component.scss'],
  template: `
    <button class="bakery-button icon-padding" nbButton ghost (click)="openStateManagerModal()">
      <nb-icon icon="workflow-state-management" pack="bakery"></nb-icon>
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
