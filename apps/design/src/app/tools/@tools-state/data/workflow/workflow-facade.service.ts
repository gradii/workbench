import { Injectable } from '@angular/core';
import { AnalyticsService, nextId, TriggeredAction, Workflow, WorkflowInfo } from '@common';
import { Update } from '@ngrx/entity';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { getComponentById, getComponentList } from '@tools-state/component/component.selectors';
import { ComponentActions } from '@tools-state/component/component.actions';
import { BakeryComponent } from '@tools-state/component/component.model';
import { WorkflowActions } from '@tools-state/data/workflow/workflow.actions';
import {
  getActiveStepId,
  getActiveWorkflowId,
  getWorkflowInfoList,
  getWorkflowList,
  getActiveWorkflow
} from '@tools-state/data/workflow/workflow.selectors';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { fromTools } from '@tools-state/tools.reducer';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';

@Injectable({ providedIn: 'root' })
export class WorkflowFacade {
  readonly workflowList$: Observable<Workflow[]> = this.store.pipe(select(getWorkflowList));
  readonly workflowInfoList$: Observable<WorkflowInfo[]> = this.store.pipe(select(getWorkflowInfoList));

  readonly activeWorkflowId$: Observable<string> = this.store.pipe(select(getActiveWorkflowId));
  readonly activeWorkflow$: Observable<Workflow> = this.store.pipe(select(getActiveWorkflow));
  readonly activeStepId$: Observable<string> = this.store.pipe(select(getActiveStepId));

  constructor(private store: Store<fromTools.State>, private analytics: AnalyticsService) {
  }

  setActiveWorkflowId(id: string) {
    this.store.dispatch(WorkflowActions.selectWorkflow({ id }));
  }

  setActiveStepId(id: string) {
    this.store.dispatch(WorkflowActions.selectStep({ id }));
  }

  setActiveWorkflowAndStepId(workflowId: string, id: string) {
    this.store.dispatch(WorkflowActions.selectWorkflowAndStep({ workflowId, id }));
  }

  createWorkflow(workflow: Workflow, assignCmpConfig?: { cmpId: string; trigger: string }): Observable<Workflow> {
    workflow = { ...workflow, id: nextId() };
    if (assignCmpConfig) {
      return this.store.pipe(
        select(getComponentById, assignCmpConfig.cmpId),
        take(1),
        map((component: BakeryComponent) => {
          const componentUpdate: Action = this.getStoreActionForActionUpdate(component, assignCmpConfig, workflow.id);
          return this.saveWorkflow(workflow, componentUpdate);
        })
      );
    } else {
      return of(this.saveWorkflow(workflow));
    }
  }

  deleteWorkflow(workflow: Workflow) {
    this.unpairDeletedWorkflow(workflow.id).subscribe((updateComponents: Update<BakeryComponent>[]) => {
      this.store.dispatch(new ComponentActions.UpdateComponentList(updateComponents));
      this.store.dispatch(WorkflowActions.deleteWorkflow({ id: workflow.id }));
      this.store.dispatch(new WorkingAreaActions.SyncState());
      this.store.dispatch(new ProjectActions.UpdateProject());
      this.store.dispatch(new HistoryActions.Persist());
      this.analytics.logActionDelete(workflow.id, workflow.name, workflow.steps.length);
    });
  }

  saveWorkflow(workflow: Workflow, updateComponentAction?: Action): Workflow {
    if (updateComponentAction) {
      this.store.dispatch(updateComponentAction);
    }
    this.store.dispatch(WorkflowActions.upsertWorkflow({ workflow }));
    this.store.dispatch(new WorkingAreaActions.SyncState());
    this.store.dispatch(new ProjectActions.UpdateProject());
    this.store.dispatch(new HistoryActions.Persist());

    this.analytics.logActionSave(workflow.id, workflow.name, workflow.steps.length);

    return workflow;
  }

  private unpairDeletedWorkflow(workflowId: string): Observable<Update<BakeryComponent>[]> {
    return this.store.pipe(
      select(getComponentList),
      take(1),
      map((componentList: BakeryComponent[]) => {
        const updates: Update<BakeryComponent>[] = [];
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
              id: component.id,
              changes: { actions: { ...component.actions, [trigger]: filteredActions } }
            });
          }
        }
        return updates;
      })
    );
  }

  private getStoreActionForActionUpdate(
    cmp: BakeryComponent,
    assignCmpConfig: { cmpId: string; trigger: string },
    workflowId: string
  ) {
    return new ComponentActions.UpdateComponent({
      id: assignCmpConfig.cmpId,
      changes: {
        actions: {
          ...cmp.actions,
          [assignCmpConfig.trigger]: [{ action: workflowId, paramCode: '' }]
        }
      }
    });
  }
}
