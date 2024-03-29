import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ub-state-manager-list-filter',
  templateUrl: './state-manager-list-filter.component.html',
  styleUrls: ['./state-manager-list-filter.component.scss']
})
export class StateManagerListFilterComponent {
  @Output() filterByName: EventEmitter<string> = new EventEmitter<string>();

  search(event: Event) {
    const target: HTMLInputElement = <HTMLInputElement>event.target;
    const searchValue = target.value;
    this.filterByName.emit(searchValue);
  }
}
