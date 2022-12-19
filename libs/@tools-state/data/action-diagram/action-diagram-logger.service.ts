import { Injectable, OnDestroy } from '@angular/core';
import { Workflow, WorkflowLog, WorkflowLogExtended, WorkflowLogLevel } from '@common/public-api';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

import { CommunicationService } from '@shared/communication/communication.service';
import { WorkflowFacade } from '@tools-state/data/workflow/workflow-facade.service';
import { stepInfo } from '@workflow-common/workflow-settings/workflow-info.model';
import { ActionDiagramUtilsService } from './workflow-utils.service';

@Injectable({ providedIn: 'root' })
export class ActionDiagramLoggerService implements OnDestroy {
  private workflowLogs: BehaviorSubject<WorkflowLog[]> = new BehaviorSubject<WorkflowLog[]>([]);

  readonly workflowLogs$: Observable<WorkflowLogExtended[]> = combineLatest([
    this.workflowLogs.asObservable(),
    this.workflowFacade.workflowList$
  ]).pipe(
    map(([logs, workflowList]: [WorkflowLog[], Workflow[]]) => this.computeExtendedInfo(logs, workflowList)),
    shareReplay(1)
  );

  readonly precomputedWorkflowErrors$: Observable<{
    [workflowId: string]: WorkflowLogExtended[];
  }> = this.workflowLogs$.pipe(
    map((logs: WorkflowLogExtended[]) => this.computeWorkflowErrors(logs)),
    shareReplay(1)
  );

  private destroyed = new Subject<void>();

  constructor(
    private communication: CommunicationService,
    private workflowUtilService: ActionDiagramUtilsService,
    private workflowFacade: WorkflowFacade
  ) {
    this.communication.workflowLog$.pipe(takeUntil(this.destroyed)).subscribe((log: WorkflowLog) => {
      if (log.stepId && log.workflowId && log.level === WorkflowLogLevel.INFO) {
        this.clearAll(WorkflowLogLevel.ERROR, log.workflowId, log.stepId);
      } else {
        this.workflowLogs.next([log, ...this.workflowLogs.value]);
      }
    });
  }

  clearAll(level: WorkflowLogLevel, workflowId?: string, stepId?: string) {
    const newLogs = this.workflowLogs.value.filter((log: WorkflowLog) => {
      const sameLevel = log.level === level;
      const sameWorkflow = workflowId ? workflowId === log.workflowId : true;
      const sameStep = stepId ? stepId === log.stepId : true;
      return !(sameLevel && sameStep && sameWorkflow);
    });
    this.workflowLogs.next(newLogs);
  }

  getLogsForWorkflow(workflowId: string, stepId: string): Observable<WorkflowLogExtended[]> {
    return this.precomputedWorkflowErrors$.pipe(
      map((logs: { [workflowId: string]: WorkflowLogExtended[] }) => {
        if (!logs[workflowId]) {
          return [];
        }
        return logs[workflowId].filter((log: WorkflowLogExtended) => {
          if (log.level !== WorkflowLogLevel.ERROR) {
            return false;
          }
          if (stepId && stepId !== log.stepId) {
            return false;
          }
          return true;
        });
      })
    );
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  private computeWorkflowErrors(logs: WorkflowLogExtended[]) {
    const perWorkflowMap = {};
    for (const log of logs) {
      if (perWorkflowMap[log.workflowId]) {
        perWorkflowMap[log.workflowId].push(log);
      } else {
        perWorkflowMap[log.workflowId] = [log];
      }
    }
    return perWorkflowMap;
  }

  private computeExtendedInfo(logs: WorkflowLog[], workflowList: Workflow[]): WorkflowLogExtended[] {
    const extendedLogs: WorkflowLogExtended[] = [];
    for (const log of logs) {
      const workflow = workflowList.find((w: Workflow) => w.id === log.workflowId);
      if (!workflow) {
        continue;
      }
      const extendedLog = {
        ...log,
        workflowName: workflow.name,
        stepName: this.findStepName(log, workflow)
      };
      // if that step still exists
      if ((log.stepId && extendedLog.stepName) || !log.stepId) {
        extendedLogs.push(extendedLog);
      }
    }
    return extendedLogs;
  }

  private findStepName(log: WorkflowLog, workflow: Workflow): string {
    const step = this.workflowUtilService.getStepById(workflow.steps, log.stepId);
    return step ? stepInfo[step.type].nameLabel : null;
  }
}
