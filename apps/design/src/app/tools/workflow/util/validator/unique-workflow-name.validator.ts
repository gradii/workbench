import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { camelize } from '@angular-devkit/core/src/utils/strings';
import { Workflow } from '@common';

import { WorkflowFacade } from '@tools-state/data/workflow/workflow-facade.service';

@Injectable()
export class UniqueWorkflowNameValidator implements AsyncValidator {
  private originalName: string;

  constructor(private workflowFacade: WorkflowFacade) {
  }

  setOriginalName(name: string) {
    this.originalName = camelize(name);
  }

  validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    const value = camelize(ctrl.value);
    return this.workflowFacade.workflowList$.pipe(
      take(1),
      map((workflowList: Workflow[]) => {
        if (value === this.originalName) {
          return null;
        }
        const notUnique = workflowList.some((workflow: Workflow) => camelize(workflow.name) === value);
        return notUnique ? { unique: true } : null;
      })
    );
  }
}
