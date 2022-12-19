import { Injectable } from '@angular/core';
import { TriDialogService } from '@gradii/triangle/dialog';
import { WorkflowFrontendToolComponent } from '../workflow-frontend-tool.component';


@Injectable()
export class WorkflowFrontendDialogService {
  constructor(private dialogService: TriDialogService) {
  }

  open(createMode?: boolean, closeOnCreate?: boolean) {
    return this.dialogService.open(WorkflowFrontendToolComponent);
  }
}