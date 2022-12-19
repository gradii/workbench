import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkflowLogExtended, WorkflowLogLevel } from '@common';
import { WorkflowLoggerService } from '@tools-state/data/workflow/workflow-logger.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector       : 'len-data-notification',
  styleUrls      : ['./data-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-badge [count]="(info$ | async).length">
      <button
        class="notification-button"
        triButton
        variant="text"
        ghost
        color="success"
        size="small"
        [triPopover]="notificationSuccessPopover"
        triPopoverClass="notification"
        triPopoverPosition="bottom"
      >
        <tri-icon svgIcon="fill:check-circle"></tri-icon>
      </button>
    </tri-badge>
    <tri-badge [count]="(error$ | async).length">
      <button
        class="notification-button"
        triButton
        variant="text"
        ghost
        color="danger"
        size="small"
        [triPopover]="notificationErrorPopover"
        triPopoverClass="notification"
        triPopoverPosition="bottom"
      >
        <tri-icon svgIcon="fill:exclamation-circle"></tri-icon>
      </button>
    </tri-badge>
    <ng-template #notificationErrorPopover>
      <len-data-notification-list
        level="ERROR"
        [logs]="error$ | async"
        [showWorkflow]="true"
        [showStep]="true"
        (clear)="clear('ERROR')"
      ></len-data-notification-list>
    </ng-template>

    <ng-template #notificationSuccessPopover>
      <len-data-notification-list
        level="INFO"
        [logs]="info$ | async"
        [showWorkflow]="true"
        [showStep]="true"
        (clear)="clear('INFO')"
      ></len-data-notification-list>
    </ng-template>
  `
})
export class DataNotificationComponent {
  info$: Observable<WorkflowLogExtended[]>  = this.workflowLogService.workflowLogs$.pipe(
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
