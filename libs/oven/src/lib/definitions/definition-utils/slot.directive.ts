import { ChangeDetectorRef, ContentChild, Directive, HostBinding, ViewContainerRef } from '@angular/core';

import { SlotBindings } from '@common';
import { SlotPlaceholderDirective } from './slot-placeholder.directive';

export abstract class Slot {
  protected bindings: SlotBindings = {};
  public viewContainerRef: ViewContainerRef;
}

@Directive({ selector: '[ovenSlot]' })
export class SlotDirective extends Slot {
  @ContentChild(SlotPlaceholderDirective) set placeholder(placeholder: SlotPlaceholderDirective) {
    this.viewContainerRef = placeholder.viewContainerRef;
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  setBindings(bindings: SlotBindings) {
    this.bindings = bindings;
    this.changeDetectorRef.detectChanges();
  }
}
