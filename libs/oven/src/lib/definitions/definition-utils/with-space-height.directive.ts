import { Directive, HostBinding, Input } from '@angular/core';
import { SpaceHeight, SpaceHeightType } from '@common';

@Directive({ selector: '[ovenWithSpaceHeight]' })
export class WithSpaceHeightDirective {
  private height: SpaceHeight;

  @Input() set ovenWithSpaceHeight(height: SpaceHeight) {
    if (height) {
      this.height = height;
    }
  }

  @HostBinding('style.height') get heightStyle(): string {
    if (!this.height || this.height.type === SpaceHeightType.AUTO) {
      return 'auto';
    }
    if (this.height.type === SpaceHeightType.CUSTOM) {
      return this.height.customValue + this.height.customUnit;
    }
  }

  @HostBinding('style.minHeight') get minHeightStyle(): string {
    if (!this.height || this.height.type === SpaceHeightType.AUTO) {
      return '2rem';
    }
  }
}
