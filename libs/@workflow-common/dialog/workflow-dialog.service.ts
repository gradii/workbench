import { Injectable } from '@angular/core';
import { TriDialogRef, TriDialogService } from '@gradii/triangle/dialog';

import {
  WorkflowModalContent, WorkflowModalContext, WorkflowModalControl, WorkflowModalControlType
} from './dialog.model';
import { WorkflowCommonDialogComponent } from './workflow-common-dialog/workflow-common-dialog.component';

@Injectable()
export class WorkflowDialogService {
  constructor(private dialogService: TriDialogService) {
  }

  openDeleteStepModal(): TriDialogRef<WorkflowCommonDialogComponent> {
    const context: WorkflowModalContext = {
      content: stepDeleteContent
    };
    return this.open(context);
  }

  openDeleteWorkflowModal(): TriDialogRef<WorkflowCommonDialogComponent> {
    const context: WorkflowModalContext = {
      content: workflowDeleteContent
    };
    return this.open(context);
  }

  openConfirmUnsavedChangesModal(): TriDialogRef<WorkflowCommonDialogComponent> {
    const context: WorkflowModalContext = {
      content: confirmUnsavedChangesContent
    };
    return this.open(context);
  }

  openDeleteStoreItemModal() {
    const context: WorkflowModalContext = {
      content: storeItemDeleteContent
    };
    return this.open(context);
  }

  private open(context: WorkflowModalContext) {
    const dialogConfig = {
      closeOnBackdropClick: false,
      context
    };
    return this.dialogService.open(WorkflowCommonDialogComponent, dialogConfig);
  }
}

const cancelControl: WorkflowModalControl = {
  type: WorkflowModalControlType.CANCEL,
  appearance: 'ghost',
  text: 'Cancel'
};

const stepDeleteContent: WorkflowModalContent = {
  headerText: 'Do you really want to delete this Action step?',
  bodyText: 'If you delete this Action some action steps can lost there connection.',
  controls: [
    cancelControl,
    {
      type : WorkflowModalControlType.SUBMIT,
      color: 'danger',
      text : 'Delete step'
    }
  ]
};

const workflowDeleteContent: WorkflowModalContent = {
  headerText: 'Do you really want to delete this Action?',
  bodyText: 'If you delete this Action something can be lost in your app.',
  controls: [
    cancelControl,
    {
      type : WorkflowModalControlType.SUBMIT,
      color: 'danger',
      text : 'Delete action'
    }
  ]
};

const storeItemDeleteContent: WorkflowModalContent = {
  headerText: 'Do you really want to delete this variable?',
  bodyText: 'If you delete this variable something can be lost in your app.',
  controls: [
    cancelControl,
    {
      type : WorkflowModalControlType.SUBMIT,
      color: 'danger',
      text : 'Delete variable'
    }
  ]
};

const confirmUnsavedChangesContent: WorkflowModalContent = {
  headerText: 'Confirm discard changes',
  bodyText: 'Changes you made will not be saved.',
  controls: [
    {
      type : WorkflowModalControlType.CANCEL,
      color: 'primary',
      text : 'Cancel'
    },
    {
      type: WorkflowModalControlType.SUBMIT,
      appearance: 'ghost',
      text: 'Discard'
    }
  ]
};
