import { Directive, HostBinding, Input } from '@angular/core';

import { ComponentPaddings, SpacingService } from '@common/public-api';

@Directive({ selector: '[kitchenWithPaddings]' })
export class WithPaddingsDirective {
  private paddings: ComponentPaddings;

  @Input() set kitchenWithPaddings(paddings: ComponentPaddings) {
    if (paddings) {
      this.paddings = paddings;
    }
  }

  @HostBinding('style.padding')
  get padding(): string {
    return this.spacingService.getPaddingCssValue(this.paddings);
  }

  constructor(private spacingService: SpacingService) {
  }
}
