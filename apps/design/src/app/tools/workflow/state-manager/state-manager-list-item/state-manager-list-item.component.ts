import { Component, ElementRef, EventEmitter, HostBinding, Input, Output } from '@angular/core';

import { StoreItem, ScrollService } from '@common';

const TOP_GAP = 16;

@Component({
  selector: 'ub-state-manager-list-item',
  templateUrl: './state-manager-list-item.component.html',
  styleUrls: ['./state-manager-list-item.component.scss']
})
export class StateManagerListItemComponent {
  @Input() createMode = false;
  @Input() storeItem: StoreItem;

  @HostBinding('class.selected') @Input() set selected(selected: boolean) {
    this._selected = selected;
    if (selected) {
      this.scrollService.scrollIfNeed(this.ref, TOP_GAP);
    }
  }

  get selected() {
    return this._selected;
  }

  @Output() delete: EventEmitter<void> = new EventEmitter<void>();
  @Output() duplicate: EventEmitter<void> = new EventEmitter<void>();

  private _selected: boolean;

  constructor(private ref: ElementRef<HTMLElement>, private scrollService: ScrollService) {
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
}
