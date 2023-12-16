import { Directive, HostBinding, Input } from '@angular/core';
import { SpaceWidth, SpaceWidthType } from '@common';

@Directive({ selector: '[ovenWithSpaceWidth]' })
export class WithSpaceWidthDirective {
  private width: SpaceWidth;

  @Input() set ovenWithSpaceWidth(width: SpaceWidth) {
    if (width) {
      this.width = width;
    }
  }

  @HostBinding('style.flex-basis') get flexBasis(): string {
    if (this.width && this.width.type === SpaceWidthType.AUTO) {
      return '0';
    }

    return null;
  }

  @HostBinding('style.width') get widthStyle(): string {
    if (!this.width) {
      return;
    }

    if (this.width.type !== SpaceWidthType.CUSTOM) {
      return;
    }

    // TODO implement column width as a 'col-md-*' classes
    if (this.width.customUnit === 'col') {
      return (this.width.customValue * 100) / 12 + '%';
    }
    return this.width.customValue + this.width.customUnit;
  }

  @HostBinding('style.flex-grow') get flexGrowStyle(): number {
    if (!this.width || this.width.type === SpaceWidthType.AUTO) {
      return 1;
    }

    return 0;
  }

  @HostBinding('style.minWidth') get minWidthStyle(): string {
    if (!this.width || this.width.type === SpaceWidthType.AUTO) {
      return '1rem';
    }
  }
}
