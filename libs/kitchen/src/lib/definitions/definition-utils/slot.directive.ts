import { ContentChild, Directive, ViewContainerRef, ɵmarkDirty } from '@angular/core';

import { SlotBindings } from '@common/public-api';
import { SlotPlaceholderDirective } from './slot-placeholder.directive';

export abstract class Slot {
  protected bindings: SlotBindings = {};
  public viewContainerRef: ViewContainerRef;
}

@Directive({ selector: '[kitchenSlot]' })
export class SlotDirective extends Slot {

  @ContentChild(SlotPlaceholderDirective)
  set placeholder(placeholder: SlotPlaceholderDirective) {
    this.viewContainerRef = placeholder.viewContainerRef;
  }

  constructor() {
    super();
  }

  setBindings(bindings: SlotBindings) {
    this.bindings = bindings;
    ɵmarkDirty(this);
  }
}
