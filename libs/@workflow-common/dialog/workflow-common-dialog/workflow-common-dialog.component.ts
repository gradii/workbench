import { Component, Input } from '@angular/core';
import { TriDialogRef } from '@gradii/triangle/dialog';

import { WorkflowModalContent, WorkflowModalControlType } from '../dialog.model';

/**
 * Component for generating dynamic modal with predefined structure (`WorkflowModalContent`)
 * and emitting predefined value (`emitOnSubmit`)
 */
@Component({
  selector: 'ub-workflow-common-dialog',
  templateUrl: './workflow-common-dialog.component.html',
  styleUrls: ['./workflow-common-dialog.component.scss']
})
export class WorkflowCommonDialogComponent {
  @Input() content: WorkflowModalContent;

  constructor(private dialogRef: TriDialogRef<WorkflowCommonDialogComponent>) {
  }

  submit(type: WorkflowModalControlType) {
    this.dialogRef.close(type === WorkflowModalControlType.SUBMIT);
  }
}
