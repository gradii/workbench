import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[kitchenSlotPlaceholder]' })
export class SlotPlaceholderDirective {
  constructor(readonly viewContainerRef: ViewContainerRef) {
  }
}
