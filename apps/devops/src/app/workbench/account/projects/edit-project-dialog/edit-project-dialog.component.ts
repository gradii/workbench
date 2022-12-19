import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input
} from '@angular/core';
import {
  UntypedFormControl,
  Validators
} from '@angular/forms';
import {
  containsAtLeastNChars,
  containsNoMoreNChars,
  getConfigValue,
  noWhitespaceValidator
} from '@common';
import {
  TRI_DIALOG_DATA,
  TriDialogRef
} from '@gradii/triangle/dialog';

import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { Observable } from 'rxjs';
import {
  filter,
  take
} from 'rxjs/operators';
import { ProjectNameValidator } from '../project-name-validator';

@Component({
  selector       : 'len-edit-project',
  styleUrls      : ['./edit-project-dialog.component.scss'],
  templateUrl    : './edit-project-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers      : [ProjectNameValidator]
})
export class EditProjectDialogComponent {
  @Input() set project(project: ProjectBrief) {
    this.name.setValue(project.name);
    this._project = project;
  }

  name: UntypedFormControl = new UntypedFormControl(
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
    private dialogRef: TriDialogRef<EditProjectDialogComponent>,
    private projectNameValidator: ProjectNameValidator,
    private projectBriefFacade: ProjectBriefFacade,
    @Inject(TRI_DIALOG_DATA) private dialogData: any
  ) {
    this.project = dialogData?.project;
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
