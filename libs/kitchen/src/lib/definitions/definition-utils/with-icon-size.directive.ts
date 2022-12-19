import { Directive, ElementRef, HostBinding, Input, Renderer2 } from '@angular/core';

import { IconSize } from '@common/public-api';

@Directive({ selector: '[kitchenWithIconSize]' })
export class WithIconSizeDirective {
  private size: IconSize;

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  @Input() set kitchenWithIconSize(size: IconSize) {
    if (this.size && !this.size.custom && this.size.predefinedValue) {
      this.renderer.removeClass(this.el.nativeElement, this.size.predefinedValue);
    }
    if (size && !size.custom && size.predefinedValue) {
      this.renderer.addClass(this.el.nativeElement, size.predefinedValue);
    }
    if (size) {
      this.size = size;
    }
  }

  @HostBinding('style.font-size') get heightStyle(): string {
    if (!this.size || !this.size.custom) {
      return;
    }
    return this.size.customValue + this.size.customUnit;
  }
}
