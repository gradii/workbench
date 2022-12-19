import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ɵdetectChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AnalyticsService, onlyLatestFrom, Workflow, WorkflowInfo } from '@common/public-api';
import { TriDialogRef } from '@gradii/triangle/dialog';

import { WorkflowFacade } from '@tools-state/data/workflow/workflow-facade.service';
import { WorkflowUtilsService } from '@tools-state/data/workflow/workflow-utils.service';
import { WorkflowDialogService } from '@workflow-common/dialog/workflow-dialog.service';
import { WorkflowSourceService } from '@workflow-common/workflow-source.service';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

@Component({
  selector       : 'len-workflow-tool',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./workflow-frontend-tool.component.scss'],
  template       : `
    <tri-card>
      <tri-card-header>
        Data Action Flow
        <tri-card-header-extra>
          <tri-icon tri-dialog-close svgIcon="outline:close"></tri-icon>
        </tri-card-header-extra>
      </tri-card-header>
      <tri-card-body>
        <div style="display: flex; flex-direction: row; min-height:500px; max-height: 75vh; overflow: auto">
          <ub-workflow-list
            (deleteWorkflow)='deleteWorkflow($event)'
            (duplicateWorkflow)='duplicateWorkflow($event)'
            (createWorkflow)='createWorkflow()'
          ></ub-workflow-list>

          <ub-workflow-settings
            *ngIf='showWorkflowSettings$ | async; else emptyWorkflow'
            (deleteWorkflow)='deleteWorkflow($event)'
            (duplicateWorkflow)='duplicateWorkflow($event)'
          ></ub-workflow-settings>
        </div>
      </tri-card-body>
    </tri-card>
    <ng-template #emptyWorkflow>
      <div class='empty-settings'>
        <span class='content'>
          <p *ngFor='let text of emptySettingsText$ | async'>{{ text }}</p>
        </span>
      </div>
    </ng-template>
  `
})
export class WorkflowFrontendToolComponent implements OnDestroy, AfterViewInit {
  assignCmpConfig: { cmpId: string; trigger: string };

  workflowList$: Observable<WorkflowInfo[]>  = this.workflowFacade.workflowInfoList$;
  showWorkflowSettings$: Observable<boolean> = combineLatest([
    this.workflowFacade.activeWorkflowId$,
    this.workflowSourceService.currentWorkflow$
  ]).pipe(map(([id, currentWorkflow]) => id !== 'toggleSidebar' && !!currentWorkflow));

  emptySettingsText$: Observable<string[]> = this.workflowList$.pipe(
    map(list => {
      if (list.length === 1) {
        return ['You have no actions.', 'Click “Add New“ to create an action.'];
      }
      return [
        'You haven\'t chosen an action.',
        'Choose an action from the list or click “Add New“ to create an action.'
      ];
    })
  );

  private destroyed$: Subject<void> = new Subject();

  constructor(
    private workflowUtilService: WorkflowUtilsService,
    private workflowSourceService: WorkflowSourceService,
    private workflowFacade: WorkflowFacade,
    private activatedRoute: ActivatedRoute,
    private workflowDialogService: WorkflowDialogService,

    private dialogRef: TriDialogRef<any>,
    private analytics: AnalyticsService
  ) {
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((queryParams: Params) => {
      if (queryParams['newAction']) {
        this.handleActionCreationParams(queryParams);
      }
      if (queryParams['workflowId']) {
        this.handleWorkflowSelectParams(queryParams);
      }
      ɵdetectChanges(this);
    });
  }

  deleteWorkflow(workflow: Workflow) {
    this.workflowDialogService
      .openDeleteWorkflowModal()
      .afterClosed().pipe(
      filter(status => !!status),
      onlyLatestFrom(this.workflowFacade.workflowList$),
      map((list: Workflow[]) => this.workflowUtilService.findNextSelectedWorkflow(list, workflow.id)),
      take(1)
    )
      .subscribe(nextWorkflow => {
        this.selectWorkflow(nextWorkflow);
        this.workflowFacade.deleteWorkflow(workflow);
      });
  }

  duplicateWorkflow(workflow: Workflow) {
    this.workflowUtilService
      .duplicateWorkflow(workflow)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(newWorkflow => {
        this.analytics.logActionClone(newWorkflow.id, newWorkflow.name, newWorkflow.steps.length);
        this.selectWorkflow(newWorkflow);
      });
  }

  selectWorkflow(workflow: Workflow) {
    this.workflowSourceService.selectWorkflow(workflow);
  }

  createWorkflow() {
    this.workflowUtilService
      .createWorkflow(this.assignCmpConfig)
      .subscribe(workflow => this.workflowSourceService.selectWorkflow(workflow));
  }

  private handleActionCreationParams(queryParams: Params) {
    if (queryParams['componentId']) {
      this.assignCmpConfig = {
        cmpId  : queryParams['componentId'],
        trigger: queryParams['trigger']
      };
    }
    this.createWorkflow();
  }

  private handleWorkflowSelectParams(queryParams: Params) {
    this.workflowSourceService.selectWorkflowById(queryParams['workflowId']);
    if (queryParams['stepId']) {
      this.workflowSourceService.selectStepById(queryParams['stepId']);
    } else {
      this.workflowSourceService.selectFirstStep();
    }
  }
}
