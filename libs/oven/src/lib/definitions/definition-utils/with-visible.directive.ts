import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: '[ovenWithVisible]' })
export class WithVisibleDirective {
  @HostBinding('style.display') display: string;

  @Input() set ovenWithVisible(visible: boolean) {
    this.display = visible ? null : 'none';
  }
}
