import { Directive, HostBinding, Input } from '@angular/core';

import { ComponentMargins, SpacingService } from '@common/public-api';

@Directive({ selector: '[kitchenWithMargins]' })
export class WithMarginsDirective {
  private margins: ComponentMargins;

  @Input() set kitchenWithMargins(margins: ComponentMargins) {
    if (margins) {
      this.margins = margins;
    }
  }

  @HostBinding('style.margin')
  get margin(): string {
    return this.spacingService.getMarginCssValue(this.margins);
  }

  constructor(private spacingService: SpacingService) {
  }
}
