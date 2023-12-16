import { Directive, HostBinding, Input } from '@angular/core';

import { ComponentMargins, SpacingService } from '@common';

@Directive({ selector: '[ovenWithMargins]' })
export class WithMarginsDirective {
  private margins: ComponentMargins;

  @Input() set ovenWithMargins(margins: ComponentMargins) {
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
