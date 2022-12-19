import { Directive, HostBinding, Input } from '@angular/core';

import { FormFieldWidth, FormFieldWidthType } from '@common/public-api';

@Directive({ selector: '[kitchenWithFormFieldWidth]' })
export class WithFormFieldWidthDirective {
  private width: FormFieldWidth;

  @Input() set kitchenWithFormFieldWidth(width: FormFieldWidth) {
    if (width) {
      this.width = width;
    }
  }

  @Input() headerExists: boolean;

  @HostBinding('style.width') get heightStyle(): string {
    if (!this.width || this.width.type !== FormFieldWidthType.CUSTOM) {
      return;
    }
    return this.width.customValue + this.width.customUnit;
  }
}
