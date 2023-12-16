import { Injectable } from '@angular/core';

import { DialogService } from '@shared/dialog/dialog.service';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { DialogRef } from '@shared/dialog/dialog-ref';
import { DeleteProjectDialogComponent } from '../delete-project-dialog/delete-project-dialog.component';
import { EditProjectDialogComponent } from '../edit-project-dialog/edit-project-dialog.component';

@Injectable()
export class ProjectDialogActionsService {
  constructor(private dialogService: DialogService) {
  }

  edit(project: ProjectBrief): DialogRef<EditProjectDialogComponent> {
    return this.dialogService.open(EditProjectDialogComponent, this.getDialogConfig(project));
  }

  delete(project: ProjectBrief): DialogRef<DeleteProjectDialogComponent> {
    return this.dialogService.open(DeleteProjectDialogComponent, this.getDialogConfig(project));
  }

  private getDialogConfig(project: ProjectBrief) {
    return {
      closeOnBackdropClick: false,
      context: { project: project }
    };
  }
}
