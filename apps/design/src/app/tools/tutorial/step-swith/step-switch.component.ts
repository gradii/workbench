import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { StepAction } from '@tools-state/tutorial-brief/tutorial-brief.model';

@Component({
  selector: 'ub-step-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./step-switch.component.scss'],
  template: `
    <ng-container *ngFor="let action of actions">
      <ng-container [ngSwitch]="action.action">
        <button
          *ngSwitchCase="'prev'"
          class="prev"
          nbButton
          size="small"
          appearance="ghost"
          (click)="performAction.emit(action)"
        >
          {{ action?.content || 'Prev' }}
        </button>

        <button *ngSwitchCase="'next'" nbButton size="small" status="success" (click)="performAction.emit(action)">
          {{ action?.content || 'NEXT' }}
        </button>

        <button
          *ngSwitchCase="'create-new-project'"
          nbButton
          size="small"
          appearance="filled"
          status="info"
          (click)="performAction.emit(action)"
        >
          create your first project
        </button>

        <button
          *ngSwitchCase="'continue-editing'"
          nbButton
          size="small"
          appearance="ghost"
          (click)="performAction.emit(action)"
        >
          save and continue
        </button>

        <button
          *ngSwitchCase="'goto-projects'"
          nbButton
          size="small"
          appearance="filled"
          status="info"
          (click)="performAction.emit(action)"
        >
          go to projects
        </button>
      </ng-container>
    </ng-container>
  `
})
export class StepSwitchComponent {
  @Input() actions: StepAction[] = [];

  @Output() performAction = new EventEmitter<StepAction>();
}
