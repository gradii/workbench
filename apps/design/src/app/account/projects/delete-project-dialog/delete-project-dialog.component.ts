import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { DialogRef } from '@shared/dialog/dialog-ref';

@Component({
  selector: 'ub-delete-project',
  styleUrls: ['./delete-project-dialog.component.scss'],
  templateUrl: './delete-project-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteProjectDialogComponent {
  @Input() project: ProjectBrief;

  name = '';

  deleteLoading$: Observable<boolean> = this.projectBriefFacade.deleteProjectLoading$;

  constructor(
    private dialogRef: DialogRef<DeleteProjectDialogComponent>,
    private projectBriefFacade: ProjectBriefFacade
  ) {
  }

  cancel() {
    this.close();
  }

  delete() {
    if (this.validNameEntered()) {
      this.projectBriefFacade.delete(this.project.viewId);
      this.closeOnLoadingFinish();
    }
  }

  validNameEntered(): boolean {
    return this.name.toLowerCase() === this.project.name.toLowerCase();
  }

  private close() {
    this.dialogRef.close();
  }

  private closeOnLoadingFinish() {
    this.deleteLoading$
      .pipe(
        filter((loading: boolean) => !loading),
        take(1)
      )
      .subscribe(() => this.close());
  }
}
