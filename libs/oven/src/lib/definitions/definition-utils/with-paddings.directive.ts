import { Directive, HostBinding, Input } from '@angular/core';

import { ComponentPaddings, SpacingService } from '@common';

@Directive({ selector: '[ovenWithPaddings]' })
export class WithPaddingsDirective {
  private paddings: ComponentPaddings;

  @Input() set ovenWithPaddings(paddings: ComponentPaddings) {
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
