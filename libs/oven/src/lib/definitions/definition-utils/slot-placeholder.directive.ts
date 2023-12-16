import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[ovenSlotPlaceholder]' })
export class SlotPlaceholderDirective {
  constructor(readonly viewContainerRef: ViewContainerRef) {
  }
}
