import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkflowLogExtended, WorkflowLogLevel } from '@common';
import { WorkflowLoggerService } from '@tools-state/data/workflow/workflow-logger.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ub-data-notification',
  styleUrls: ['./data-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="notification-button"
      nbButton
      ghost
      status="success"
      size="small"
      [nbPopover]="notificationSuccessPopover"
      nbPopoverClass="notification"
      nbPopoverOffset="16"
      nbPopoverPlacement="bottom"
    >
      <nb-icon icon="checkmark-circle-outline"></nb-icon>
      <span class="count-text">{{ (info$ | async).length }}</span>
    </button>
    <button
      class="notification-button"
      nbButton
      ghost
      status="danger"
      size="small"
      [nbPopover]="notificationErrorPopover"
      nbPopoverClass="notification"
      nbPopoverOffset="16"
      nbPopoverPlacement="bottom"
    >
      <nb-icon icon="alert-circle"></nb-icon>
      <span class="count-text">{{ (error$ | async).length }}</span>
    </button>

    <ng-template #notificationErrorPopover>
      <ub-data-notification-list
        level="ERROR"
        [logs]="error$ | async"
        [showWorkflow]="true"
        [showStep]="true"
        (clear)="clear('ERROR')"
      ></ub-data-notification-list>
    </ng-template>

    <ng-template #notificationSuccessPopover>
      <ub-data-notification-list
        level="INFO"
        [logs]="info$ | async"
        [showWorkflow]="true"
        [showStep]="true"
        (clear)="clear('INFO')"
      ></ub-data-notification-list>
    </ng-template>
  `
})
export class DataNotificationComponent {
  info$: Observable<WorkflowLogExtended[]> = this.workflowLogService.workflowLogs$.pipe(
    map((list: WorkflowLogExtended[]) =>
      list.filter((log: WorkflowLogExtended) => log.level === WorkflowLogLevel.INFO)
    )
  );
  error$: Observable<WorkflowLogExtended[]> = this.workflowLogService.workflowLogs$.pipe(
    map((list: WorkflowLogExtended[]) =>
      list.filter((log: WorkflowLogExtended) => log.level === WorkflowLogLevel.ERROR)
    )
  );

  constructor(private workflowLogService: WorkflowLoggerService) {
  }

  clear(level: string) {
    this.workflowLogService.clearAll(level as WorkflowLogLevel);
  }
}
