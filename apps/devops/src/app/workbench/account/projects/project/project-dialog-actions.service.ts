import { Injectable } from '@angular/core';
import { TriDialogConfig, TriDialogRef, TriDialogService } from '@gradii/triangle/dialog';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { DeleteProjectDialogComponent } from '../delete-project-dialog/delete-project-dialog.component';
import { EditProjectDialogComponent } from '../edit-project-dialog/edit-project-dialog.component';

@Injectable()
export class ProjectDialogActionsService {
  constructor(private dialogService: TriDialogService) {
  }

  edit(project: ProjectBrief): TriDialogRef<EditProjectDialogComponent> {
    return this.dialogService.open(EditProjectDialogComponent, this._getDialogConfig(project));
  }

  delete(project: ProjectBrief): TriDialogRef<DeleteProjectDialogComponent> {
    return this.dialogService.open(DeleteProjectDialogComponent, this._getDialogConfig(project));
  }

  private _getDialogConfig(project: ProjectBrief): TriDialogConfig {
    return {
      disableClose: true,
      data: { project: project }
    };
  }
}
