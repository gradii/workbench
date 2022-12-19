import { Directive, ElementRef, HostBinding, Input, Renderer2 } from '@angular/core';

@Directive({ selector: '[kitchenWithDisabled]' })
export class WithDisabledDirective {
  @HostBinding('class.kitchen-disabled') disabled: boolean;

  @Input() set kitchenWithDisabled(disabled: boolean) {
    this.disabled = disabled;
    if (disabled) {
      this.renderer.setAttribute(this.el.nativeElement, 'readonly', 'readonly');
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'readonly');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }
}
