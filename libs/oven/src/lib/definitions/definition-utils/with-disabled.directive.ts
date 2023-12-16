import { Directive, ElementRef, HostBinding, Input, Renderer2 } from '@angular/core';

@Directive({ selector: '[ovenWithDisabled]' })
export class WithDisabledDirective {
  @HostBinding('class.oven-disabled') disabled: boolean;

  @Input() set ovenWithDisabled(disabled: boolean) {
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
