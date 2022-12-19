import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: '[kitchenWithTextStyles]' })
export class WithTextStylesDirective {

  @Input()
  set kitchenWithTextStyles(bindings: { [key: string]: any }) {
    if (bindings) {
      this.bindings = bindings;
    }
  }

  private bindings: { [key: string]: any };

  @HostBinding('class')
  get classes() {
    if (!this.bindings) {
      return '';
    }
    let classString = this.bindings.type ? `${this.bindings.type} ` : '';

    classString = classString + (this.bindings.italic ? ' text-italic' : '');
    classString = classString + (this.bindings.bold ? ' text-bold' : '');
    classString = classString + ` text-${this.bindings.color}`;
    classString = classString + (this.bindings.alignment ? ` text-alignment-${this.bindings.alignment}` : '');
    classString = classString + (this.bindings.transform ? ` text-transform-${this.bindings.transform}` : '');
    classString = classString + (this.bindings.decoration ? ` text-decoration-${this.bindings.decoration}` : '');
    return classString;
  }
}
