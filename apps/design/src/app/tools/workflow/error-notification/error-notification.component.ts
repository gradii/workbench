import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { WorkflowLogExtended, WorkflowLogLevel } from '@common';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';

import { WorkflowLoggerService } from '@tools-state/data/workflow/workflow-logger.service';

@Component({
  selector: 'ub-error-notification',
  styleUrls: ['./error-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-icon
      [class.empty]="!(errors$ | async)?.length"
      class="error-icon"
      icon="alert-circle"
      [nbPopover]="notificationErrorPopover"
      nbPopoverTrigger="hover"
      nbPopoverClass="notification"
      nbPopoverOffset="16"
      nbPopoverPlacement="bottom"
    ></nb-icon>

    <ng-template #notificationErrorPopover>
      <ub-data-notification-list
        level="ERROR"
        [logs]="errors$ | async"
        [showWorkflow]="!_workflowId.value"
        [showStep]="!_stepId.value"
        (clear)="clear()"
      ></ub-data-notification-list>
    </ng-template>
  `
})
export class ErrorNotificationComponent {
  @Input() set workflowId(id: string) {
    this._workflowId.next(id);
  }

  @Input() set stepId(id: string) {
    this._stepId.next(id);
  }

  @HostBinding('class.selected') @Input() selected: boolean;

  @Output() hasError = new EventEmitter<boolean>();

  readonly _workflowId = new BehaviorSubject<string>(null);
  readonly _stepId = new BehaviorSubject<string>(null);

  errors$: Observable<WorkflowLogExtended[]> = combineLatest([
    this._workflowId.asObservable(),
    this._stepId.asObservable()
  ]).pipe(
    switchMap(([workflowId, stepId]: [string, string]) =>
      this.workflowLogService.getLogsForWorkflow(workflowId, stepId)
    ),
    tap((logs: WorkflowLogExtended[]) => this.hasError.emit(!!logs.length)),
    shareReplay(1)
  );

  constructor(private workflowLogService: WorkflowLoggerService) {
  }

  clear() {
    this.workflowLogService.clearAll(WorkflowLogLevel.ERROR, this._workflowId.value, this._stepId.value);
  }
}
