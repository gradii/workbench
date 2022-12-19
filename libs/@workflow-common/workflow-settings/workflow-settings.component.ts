import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Output } from '@angular/core';
import { Workflow } from '@common/public-api';
import { Observable } from 'rxjs';

import { WorkflowFacade } from '@tools-state/data/workflow/workflow-facade.service';
import { WorkflowSourceService } from '../workflow-source.service';

@Component({
  selector: 'ub-workflow-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./workflow-settings.component.scss'],
  template: `
    <ub-workflow-settings-header
      [workflow]="workflow$ | async"
      (workflowChange)="updateWorkflow($event)"
      (duplicate)="duplicateWorkflow.emit($event)"
      (delete)="deleteWorkflow.emit($event)"
    ></ub-workflow-settings-header>
    <div class="workflow-settings-body">
      <div class="workflow-properties">
        <div class="wrap-for-border">
          <ub-step-list-group
            [steps]="(workflow$ | async).steps"
            [activeStepId]="activeStepId$ | async"
            [workflowId]="activeWorkflowId$ | async"
          ></ub-step-list-group>
        </div>
      </div>

      <ub-step-properties
        class="step-properties"
        [workflow]="workflow$ | async"
        [activeStepId]="activeStepId$ | async"
        (workflowChange)="updateWorkflow($event)"
      ></ub-step-properties>
    </div>
  `
})
export class WorkflowSettingsComponent {
  workflow$: Observable<Workflow> = this.workflowSourceService.currentWorkflow$;
  activeStepId$ = this.workflowFacade.activeStepId$;
  activeWorkflowId$ = this.workflowFacade.activeWorkflowId$;

  @HostBinding('class.nebular-scroll') nebularScroll = true;

  @Output() deleteWorkflow: EventEmitter<Workflow> = new EventEmitter<Workflow>();
  @Output() duplicateWorkflow: EventEmitter<Workflow> = new EventEmitter<Workflow>();

  constructor(private workflowFacade: WorkflowFacade, private workflowSourceService: WorkflowSourceService) {
  }

  updateWorkflow(workflow: Workflow) {
    this.workflowSourceService.updateCurrentWorkflow(workflow);
  }
}
