import { Injectable } from '@angular/core';
import { AnalyticsService, nextId, TriggeredAction, Workflow, WorkflowInfo } from '@common/public-api';
import { dispatch } from '@ngneat/effects';
import { Action } from '@ngneat/effects/lib/actions.types';
import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponent } from '@tools-state/component/component.model';

import { getComponentById, getComponentList } from '@tools-state/component/component.selectors';
import { WorkflowActions } from '@tools-state/data/workflow/workflow.actions';
import {
  getActiveStepId, getActiveWorkflow, getActiveWorkflowId, getWorkflowInfoList, getWorkflowList
} from '@tools-state/data/workflow/workflow.selectors';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WorkflowFacade {
  readonly workflowList$: Observable<Workflow[]>         = getWorkflowList;
  readonly workflowInfoList$: Observable<WorkflowInfo[]> = getWorkflowInfoList;

  readonly activeWorkflowId$: Observable<string> = getActiveWorkflowId;
  readonly activeWorkflow$: Observable<Workflow> = getActiveWorkflow;
  readonly activeStepId$: Observable<string>     = getActiveStepId;

  constructor(private analytics: AnalyticsService) {
  }

  setActiveWorkflowId(id: string) {
    dispatch(WorkflowActions.SelectWorkflow(id));
  }

  setActiveStepId(id: string) {
    dispatch(WorkflowActions.SelectStep(id));
  }

  setActiveWorkflowAndStepId(workflowId: string, id: string) {
    dispatch(WorkflowActions.SelectWorkflowAndStep(workflowId, id));
  }

  createWorkflow(workflow: Workflow, assignCmpConfig?: { cmpId: string; trigger: string }): Observable<Workflow> {
    workflow = { ...workflow, id: nextId() };
    if (assignCmpConfig) {
      return getComponentById(assignCmpConfig.cmpId).pipe(
        take(1),
        map((component: PuffComponent) => {
          const componentUpdate: Action = this.getStoreActionForActionUpdate(component, assignCmpConfig, workflow.id);
          return this.saveWorkflow(workflow, componentUpdate);
        })
      );
    } else {
      return of(this.saveWorkflow(workflow));
    }
  }

  deleteWorkflow(workflow: Workflow) {
    this.unpairDeletedWorkflow(workflow.id).subscribe((updateComponents: Partial<PuffComponent>[]) => {
      dispatch(ComponentActions.UpdateComponentList(updateComponents));
      dispatch(WorkflowActions.DeleteWorkflow(workflow.id));
      dispatch(WorkingAreaActions.SyncState());
      dispatch(ProjectActions.UpdateProject());
      dispatch(HistoryActions.Persist());
      this.analytics.logActionDelete(workflow.id, workflow.name, workflow.steps.length);
    });
  }

  saveWorkflow(workflow: Workflow, updateComponentAction?: Action): Workflow {
    if (updateComponentAction) {
      dispatch(updateComponentAction);
    }
    dispatch(WorkflowActions.UpsertWorkflow(workflow));
    dispatch(WorkingAreaActions.SyncState());
    dispatch(ProjectActions.UpdateProject());
    dispatch(HistoryActions.Persist());

    this.analytics.logActionSave(workflow.id, workflow.name, workflow.steps.length);

    return workflow;
  }

  private unpairDeletedWorkflow(workflowId: string): Observable<Partial<PuffComponent>[]> {
    return getComponentList.pipe(
      take(1),
      map((componentList: PuffComponent[]) => {
        const updates: Partial<PuffComponent>[] = [];
        for (const component of componentList) {
          if (!component.actions) {
            continue;
          }
          for (const trigger of Object.keys(component.actions)) {
            const filteredActions = component.actions[trigger].filter(
              (action: TriggeredAction) => action.action !== workflowId
            );
            if (filteredActions.length === component.actions[trigger].length) {
              continue;
            }
            updates.push({
              actions: { ...component.actions, [trigger]: filteredActions },
              id     : component.id
            });
          }
        }
        return updates;
      })
    );
  }

  private getStoreActionForActionUpdate(
    cmp: PuffComponent,
    assignCmpConfig: { cmpId: string; trigger: string },
    workflowId: string
  ) {
    return ComponentActions.UpdateComponent({
      actions: {
        ...cmp.actions,
        [assignCmpConfig.trigger]: [{ action: workflowId, paramCode: '' }]
      },
      id     : assignCmpConfig.cmpId
    });
  }
}
