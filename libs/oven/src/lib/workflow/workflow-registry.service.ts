import { Injectable } from '@angular/core';
import { Workflow } from '@common';
import { Observable } from 'rxjs';
import { filter, map, pluck, take } from 'rxjs/operators';

import { RenderState } from '../state/render-state.service';

@Injectable()
export class WorkflowRegistryService {
  workflowList$ = this.renderState.app$.pipe(pluck('workflowList'));

  constructor(private renderState: RenderState) {
  }

  getWorkflow(id: string): Observable<Workflow> {
    return this.workflowList$.pipe(
      take(1),
      map((workflowList: Workflow[]) => workflowList.find(w => w.id === id)),
      filter(workflow => {
        if (!workflow) {
          // TODO log to sentry
          console.error(`Unknown workflow: ${id}`);
        }
        return !!workflow;
      })
    );
  }
}
