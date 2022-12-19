import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { WorkflowLogExtended, WorkflowLogLevel } from '@common/public-api';
import { take } from 'rxjs/operators';

import { ProjectFacade } from '@tools-state/project/project-facade.service';

@Component({
  selector: 'ub-data-notification-list',
  styleUrls: ['./data-notification-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="header">
      <div class="title">
        <tri-icon [svgIcon]="icon"></tri-icon>
        <span>{{ label }}</span>
      </div>
      <button *ngIf="logs.length" triButton ghost size="tiny" status="basic" (click)="clearAll()">
        Clear
      </button>
    </div>
    <div *ngFor="let log of logs; trackBy: trackById" class="item" (click)="navigateToWorkflow(log)">
      <div class="item-info">
        <div *ngIf="showWorkflow" class="row">
          <span class="info-label">Action:</span>
          <span class="info-text">{{ log.workflowName }}</span>
        </div>
        <div *ngIf="showStep && log.stepId" class="row">
          <span class="info-label">Step:</span>
          <span class="info-text">{{ log.stepName }}</span>
        </div>
        <div *ngIf="log.message" class="row message-row">
          <span class="info-label">Message:</span>
          <span class="info-text">{{ log.message }}</span>
        </div>
      </div>
      <tri-icon class="open-icon" svgIcon="outline:right"></tri-icon>
    </div>
  `
})
export class DataNotificationListComponent {
  @Input() level: WorkflowLogLevel;
  @Input() logs: WorkflowLogExtended[];
  @Input() showWorkflow: boolean;
  @Input() showStep: boolean;

  @HostBinding('class.alternate') @Input() alternate: boolean;

  @HostBinding('class.danger') get dangerClass() {
    return this.level === WorkflowLogLevel.ERROR;
  }

  @HostBinding('class.success') get successClass() {
    return this.level === WorkflowLogLevel.INFO;
  }

  @Output() clear: EventEmitter<void> = new EventEmitter<void>();

  get icon(): string {
    return this.level === WorkflowLogLevel.ERROR ? 'alert-circle' : 'checkmark-circle-outline';
  }

  get label(): string {
    const label = this.level === WorkflowLogLevel.ERROR ? 'Error' : 'Execution';
    const plural = this.logs.length > 1 || !this.logs.length ? 's' : '';
    const count = this.logs.length || 'No';
    return `${count} ${label}${plural}`;
  }

  constructor(private router: Router, private projectFacade: ProjectFacade) {
  }

  trackById(index, item) {
    return item.id;
  }

  clearAll() {
    this.clear.emit();
  }

  navigateToWorkflow(log: WorkflowLogExtended) {
    // we need to calculate url manually for independence from module that uses DataNotificationListComponent
    this.projectFacade.activeProjectId$.pipe(take(1)).subscribe((projectId: string) => {
      const urlTree: UrlTree = this.router.createUrlTree([`tools/${projectId}/data`], {
        queryParams: {
          workflowId: log.workflowId,
          stepId: log.stepId,
          refresh: Date.now()
        }
      });
      this.router.navigateByUrl(urlTree);
    });
  }
}
