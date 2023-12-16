import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { containsAtLeastNChars, noWhitespaceValidator, containsNoMoreNChars, getConfigValue } from '@common';

import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { DialogRef } from '@shared/dialog/dialog-ref';
import { ProjectNameValidator } from '../project-name-validator';

@Component({
  selector: 'ub-edit-project',
  styleUrls: ['./edit-project-dialog.component.scss'],
  templateUrl: './edit-project-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectNameValidator]
})
export class EditProjectDialogComponent {
  @Input() set project(project: ProjectBrief) {
    this.name.setValue(project.name);
    this._project = project;
  }

  name: FormControl = new FormControl(
    '',
    [
      Validators.required,
      noWhitespaceValidator,
      containsAtLeastNChars(getConfigValue('project.name.minLength')),
      containsNoMoreNChars(getConfigValue('project.name.maxLength'))
    ],
    this.projectNameValidator.taken.bind(this.projectNameValidator)
  );

  updateLoading$: Observable<boolean> = this.projectBriefFacade.deleteProjectLoading$;

  private _project: ProjectBrief;

  constructor(
    private dialogRef: DialogRef<EditProjectDialogComponent>,
    private projectNameValidator: ProjectNameValidator,
    private projectBriefFacade: ProjectBriefFacade
  ) {
  }

  cancel() {
    this.close();
  }

  update() {
    this._project = { ...this._project, name: this.name.value };
    this.projectBriefFacade.update(this._project);
    this.closeOnLoadingFinish();
  }

  private close() {
    this.dialogRef.close();
  }

  private closeOnLoadingFinish() {
    this.updateLoading$
      .pipe(
        filter((loading: boolean) => !loading),
        take(1)
      )
      .subscribe(() => this.close());
  }
}
