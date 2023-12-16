import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { containsAtLeastNChars, noWhitespaceValidator, containsNoMoreNChars, getConfigValue } from '@common';

import { ProjectNameValidator } from '../project-name-validator';
import { DialogRef } from '@shared/dialog/dialog-ref';

@Component({
  selector: 'ub-create-project',
  styleUrls: ['./create-project-dialog.component.scss'],
  templateUrl: './create-project-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectNameValidator]
})
export class CreateProjectDialogComponent implements OnDestroy {
  project: FormGroup = this.fb.group({
    name: [
      '',
      [
        noWhitespaceValidator,
        Validators.required,
        containsAtLeastNChars(getConfigValue('project.name.minLength')),
        containsNoMoreNChars(getConfigValue('project.name.maxLength'))
      ],
      this.projectNameValidator.taken.bind(this.projectNameValidator)
    ],
    type: ['', Validators.required],
    description: ['', containsNoMoreNChars(getConfigValue('project.description.maxLength'))]
  });

  private destroyed$ = new Subject();

  constructor(
    private router: Router,
    private dialogRef: DialogRef<CreateProjectDialogComponent>,
    private projectNameValidator: ProjectNameValidator,
    private fb: FormBuilder
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  cancel() {
    this.close();
  }

  create() {
    const projectParams = {
      type: this.project.value.type,
      description: this.project.value.description
    };

    this.router.navigate(['./projects/create'], {
      queryParams: { name: this.project.value.name },
      state: projectParams
    });
    this.close();
  }

  private close() {
    this.dialogRef.close();
  }

  get name(): AbstractControl {
    return this.project && this.project.controls['name'];
  }

  get description(): AbstractControl {
    return this.project && this.project.controls['description'];
  }
}
