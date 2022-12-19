import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: '[kitchenWithVisible]' })
export class WithVisibleDirective {
  @HostBinding('style.display') display: string;

  @Input() set kitchenWithVisible(visible: boolean) {
    this.display = visible ? null : 'none';
  }
}
