import { Directive, HostBinding, Input } from '@angular/core';

import { BoxSide, ComponentMargins, ComponentSize } from '@common';

@Directive({ selector: '[ovenWithSize]' })
export class WithSizeDirective {
  private size: ComponentSize;
  private margins: ComponentMargins = {};

  @Input() set ovenWithSize(size: ComponentSize) {
    if (size) {
      this.size = size;
    }
  }

  @Input() set ovenWithSizeMargins(margins: ComponentMargins) {
    if (margins) {
      this.margins = margins;
    }
  }

  @HostBinding('style.width') get width(): string {
    return this.getSizeValue('width', 'Left', 'Right');
  }

  @HostBinding('style.height') get height(): string {
    return this.getSizeValue('height', 'Top', 'Bottom');
  }

  private getSizeValue(name: string, firstSide: BoxSide, secondSide: BoxSide): string {
    if (!this.size || this.size[name + 'Auto']) {
      return 'auto';
    }

    const sizeValue = this.size[name + 'Value'];
    const sizeUnit = this.size[name + 'Unit'];

    const marginsAffectingWidth = this.getMarginValuesBySide(this.margins, firstSide, secondSide)
      // filter out undefined, zero and auto margins
      .filter(m => !!m && m !== '0' && m !== 'auto');

    if (sizeUnit === '%' && marginsAffectingWidth.length) {
      return `calc(${sizeValue}% - ${marginsAffectingWidth.join(' - ')})`;
    }
    return sizeValue + sizeUnit;
  }

  private getMarginValuesBySide(margins: ComponentMargins | undefined, ...sides: BoxSide[]): (string | undefined)[] {
    if (!margins) {
      return [];
    }

    const marginsBySide: (string | undefined)[] = [];

    for (const side of sides) {
      const value = margins['margin' + side];
      const unit = margins['margin' + side + 'Unit'];

      if (value === 'auto') {
        marginsBySide.push('auto');
      } else if (value === 0) {
        marginsBySide.push(`${value}`);
      } else if (value && unit) {
        marginsBySide.push(`${value}${unit}`);
      } else {
        marginsBySide.push(undefined);
      }
    }

    return marginsBySide;
  }
}
