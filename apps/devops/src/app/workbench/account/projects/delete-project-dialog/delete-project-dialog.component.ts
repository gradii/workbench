import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input
} from '@angular/core';
import { TriDialogRef, TRI_DIALOG_DATA } from '@gradii/triangle/dialog';

import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { Observable } from 'rxjs';
import {
  filter,
  take
} from 'rxjs/operators';

@Component({
  selector: 'len-delete-project',
  styleUrls: ['./delete-project-dialog.component.scss'],
  templateUrl: './delete-project-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteProjectDialogComponent {
  @Input() project: ProjectBrief;

  name = '';

  deleteLoading$: Observable<boolean> = this.projectBriefFacade.deleteProjectLoading$;

  constructor(
    private dialogRef: TriDialogRef<DeleteProjectDialogComponent>,
    private projectBriefFacade: ProjectBriefFacade,
    @Inject(TRI_DIALOG_DATA) private dialogData: any
  ) {
    this.project = dialogData?.project;
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
