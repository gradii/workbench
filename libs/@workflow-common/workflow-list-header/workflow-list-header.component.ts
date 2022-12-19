import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ub-workflow-list-header',
  templateUrl: './workflow-list-header.component.html',
  styleUrls: ['./workflow-list-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowListHeaderComponent {
  @Output() create: EventEmitter<void> = new EventEmitter<void>();
  @Output() filterByName: EventEmitter<string> = new EventEmitter<string>();
}
