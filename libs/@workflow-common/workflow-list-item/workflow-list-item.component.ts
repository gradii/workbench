import {
  ChangeDetectionStrategy,
  ɵmarkDirty,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ɵdetectChanges
} from '@angular/core';
import { Workflow } from '@common/public-api';

@Component({
  selector: 'ub-workflow-list-item',
  templateUrl: './workflow-list-item.component.html',
  styleUrls: ['./workflow-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowListItemComponent {
  @Input() workflow: Workflow;
  @Input() assigned: boolean;
  @HostBinding('class.selected') @Input() selected: boolean;
  @Output() delete: EventEmitter<void> = new EventEmitter<void>();
  @Output() duplicate: EventEmitter<void> = new EventEmitter<void>();

  error: boolean;

  get canBeDeleted(): boolean {
    // system action cannot be deleted
    return this.workflow.id !== 'toggleSidebar';
  }

  constructor() {
  }

  deleteWithoutPropagation($event: Event) {
    // do not propagate to not fire workflow selection
    $event.stopPropagation();
    this.delete.emit();
  }

  duplicateWithoutPropagation($event: Event) {
    // do not propagate to not fire workflow selection
    $event.stopPropagation();
    this.duplicate.emit();
  }

  onChangeStatus(error: boolean) {
    this.error = error;
    ɵdetectChanges(this);
  }
}
