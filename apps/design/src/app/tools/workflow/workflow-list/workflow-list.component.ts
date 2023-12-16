import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { AnalyticsService, Workflow, WorkflowInfo } from '@common';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { WorkflowFacade } from '@tools-state/data/workflow/workflow-facade.service';
import { WorkflowSourceService } from '../workflow-source.service';
import { WorkflowUtilsService } from '@tools-state/data/workflow/workflow-utils.service';

interface RenderWorkflowInfo extends WorkflowInfo {
  selected: boolean;
}

@Component({
  selector: 'ub-workflow-list',
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowListComponent implements OnDestroy {
  activeWorkflowId$ = this.workflowFacade.activeWorkflowId$;
  activeWorkflow$: Observable<Workflow> = this.workflowSourceService.currentWorkflow$;

  nameFilter = new BehaviorSubject<string>('');

  filteredWorkflowList$: Observable<RenderWorkflowInfo[]> = combineLatest([
    this.workflowFacade.workflowInfoList$,
    this.nameFilter,
    this.activeWorkflowId$
  ]).pipe(map(([workflowList, nameFilter, workflowId]) => this.filterByName(workflowList, nameFilter, workflowId)));

  @Output() deleteWorkflow = new EventEmitter<Workflow>();
  @Output() duplicateWorkflow = new EventEmitter<Workflow>();
  @Output() createWorkflow = new EventEmitter<void>();

  private destroyed$ = new Subject<void>();

  constructor(
    private workflowFacade: WorkflowFacade,
    private workflowSourceService: WorkflowSourceService,
    private workflowUtilsService: WorkflowUtilsService,
    private analytics: AnalyticsService
  ) {
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  trackById(i: number, workflow: RenderWorkflowInfo) {
    return workflow.id;
  }

  selectWorkflow(workflow: Workflow) {
    this.analytics.logActionOpen(workflow.id, workflow.name, workflow.steps.length);
    this.workflowSourceService.selectWorkflow(workflow);
  }

  private filterByName(
    workflowList: WorkflowInfo[],
    searchValue: string,
    activeWorkflowId: string
  ): RenderWorkflowInfo[] {
    let filteredWorkflowList: WorkflowInfo[] = workflowList;
    filteredWorkflowList = filteredWorkflowList.filter(workflow => {
      if (workflow.id === 'toggleSidebar') {
        return false;
      }
      if ((activeWorkflowId && workflow.id === activeWorkflowId) || !searchValue) {
        return true;
      }
      return workflow.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    });

    return filteredWorkflowList.map(workflow => ({
      ...workflow,
      selected: workflow.id === activeWorkflowId
    }));
  }
}
