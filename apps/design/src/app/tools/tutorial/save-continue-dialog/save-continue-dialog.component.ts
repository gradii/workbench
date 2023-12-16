import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  AnalyticsService,
  containsAtLeastNChars,
  containsNoMoreNChars,
  getConfigValue,
  noWhitespaceValidator
} from '@common';
import { takeUntil } from 'rxjs/operators';

import { ProjectNameValidator } from '../../../account/projects/project-name-validator';
import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { DialogRef } from '@shared/dialog/dialog-ref';

@Component({
  selector: 'ub-save-continue-dialog',
  styleUrls: ['./save-continue-dialog.component.scss'],
  templateUrl: './save-continue-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectNameValidator]
})
export class SaveContinueDialogComponent implements OnDestroy {
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
    private analytics: AnalyticsService,
    private dialogRef: DialogRef<SaveContinueDialogComponent>,
    private projectNameValidator: ProjectNameValidator,
    private projectFacade: ProjectFacade,
    private fb: FormBuilder
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }

  create(): void {
    const projectName = this.project.value.name;
    const props = { type: this.project.value.type, description: this.project.value.description };

    this.projectFacade
      .createFromTutorial(projectName, props)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (viewId: string) => {
          this.analytics.logCreateNewProject('tutorial', props, null, 'tutorial');
          // tutorial: true query param is used to create a unique url for tutorials.
          const extras: NavigationExtras = { queryParams: { tutorial: true }, queryParamsHandling: 'merge' };
          this.router.navigate(['/tools', viewId, 'builder'], extras);
          this.dialogRef.close();
        },
        error: error => this.analytics.logCreateNewProject('tutorial', props, error, 'tutorial')
      });
  }

  get name(): AbstractControl {
    return this.project && this.project.controls['name'];
  }

  get description(): AbstractControl {
    return this.project && this.project.controls['description'];
  }
}
