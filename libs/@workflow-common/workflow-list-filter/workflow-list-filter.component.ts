import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ub-workflow-list-filter',
  templateUrl: './workflow-list-filter.component.html',
  styleUrls: ['./workflow-list-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowListFilterComponent {
  @Output() filterByName: EventEmitter<string> = new EventEmitter<string>();

  search(event: Event) {
    const target: HTMLInputElement = <HTMLInputElement>event.target;
    const searchValue = target.value;
    this.filterByName.emit(searchValue);
  }
}
