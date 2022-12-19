import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
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
import { Subject } from 'rxjs';

import { ProjectNameValidator } from '../project-name-validator';

export const enum ProjectType {
  Frontend = 'frontend',
  Backend  = 'backend'
}

@Component({
  selector       : 'len-create-project',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl    : './create-project-dialog.component.html',
  styleUrls      : ['./create-project-dialog.component.scss'],
  providers      : [ProjectNameValidator]
})
export class CreateProjectDialogComponent implements OnDestroy {
  project: UntypedFormGroup = this.fb.group({
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
    // type: ['', Validators.required],
    description: ['', containsNoMoreNChars(getConfigValue('project.description.maxLength'))]
  });

  private destroyed$ = new Subject<void>();

  @Input()
  projectType = ProjectType.Frontend;

  constructor(
    private router: Router,
    private dialogRef: TriDialogRef<CreateProjectDialogComponent>,
    private projectNameValidator: ProjectNameValidator,
    private fb: UntypedFormBuilder,
    @Inject(TRI_DIALOG_DATA) private dialogData: any
  ) {
    this.projectType = dialogData.projectType;
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
      name       : this.project.value.name,
      type       : this.project.value.type,
      description: this.project.value.description,
      projectType: this.projectType
    };

    this.router.navigate(['./workbench/projects/create'], {
      queryParams: projectParams,
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
