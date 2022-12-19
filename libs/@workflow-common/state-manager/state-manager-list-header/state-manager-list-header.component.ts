import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'pf-state-manager-list-header',
  templateUrl: './state-manager-list-header.component.html',
  styleUrls: ['./state-manager-list-header.component.scss']
})
export class StateManagerListHeaderComponent {
  @Output() create: EventEmitter<void> = new EventEmitter<void>();
  @Output() filterByName: EventEmitter<string> = new EventEmitter<string>();
}
