import { Component, ElementRef, EventEmitter, HostBinding, Input, Output } from '@angular/core';

import { ScrollService, StoreItem } from '@common/public-api';

const TOP_GAP = 16;

@Component({
  selector   : 'pf-state-manager-list-item',
  templateUrl: './state-manager-list-item.component.html',
  host:{
    '[class.selected]': 'selected'
  },
  styleUrls  : ['./state-manager-list-item.component.scss']
})
export class StateManagerListItemComponent {
  @Input() createMode = false;
  @Input() storeItem: StoreItem;

  @Input()
  get selected() {
    return this._selected;
  }

  set selected(selected: boolean) {
    this._selected = selected;
    if (selected) {
      this.scrollService.scrollIfNeed(this.ref, TOP_GAP);
    }
  }

  @Output() delete: EventEmitter<void>    = new EventEmitter<void>();
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
