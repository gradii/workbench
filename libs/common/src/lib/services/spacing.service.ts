import { Injectable } from '@angular/core';
import {
  ComponentMargins,
  ComponentPaddings,
  MarginUnit,
  MarginValue,
  PaddingUnit,
  PaddingValue
} from '../models/oven.models';

@Injectable()
export class SpacingService {
  getMarginCssValue(margins: ComponentMargins | undefined): string | undefined {
    return this.getSpacingCssValue('margin', margins);
  }

  getPaddingCssValue(paddings: ComponentPaddings | undefined): string | undefined {
    return this.getSpacingCssValue('padding', paddings);
  }

  isPaddingsEqual(prev: ComponentPaddings | undefined, next: ComponentPaddings | undefined): boolean {
    if (!prev && !next) {
      return true;
    }
    if (!prev || !next) {
      return false;
    }

    return (
      prev.paddingTop === next.paddingTop &&
      prev.paddingTopUnit === next.paddingTopUnit &&
      prev.paddingBottom === next.paddingBottom &&
      prev.paddingBottomUnit === next.paddingBottomUnit &&
      prev.paddingLeft === next.paddingLeft &&
      prev.paddingLeftUnit === next.paddingLeftUnit &&
      prev.paddingRight === next.paddingRight &&
      prev.paddingRightUnit === next.paddingRightUnit
    );
  }

  private getSpacingCssValue(
    spacing: 'margin' | 'padding',
    model: ComponentMargins | ComponentPaddings | undefined
  ): string | undefined {
    if (!model || !Object.keys(model).length) {
      return undefined;
    }

    const top = this.getCssValue(model[spacing + 'Top'], model[spacing + 'TopUnit']);
    const right = this.getCssValue(model[spacing + 'Right'], model[spacing + 'RightUnit']);
    const bottom = this.getCssValue(model[spacing + 'Bottom'], model[spacing + 'BottomUnit']);
    const left = this.getCssValue(model[spacing + 'Left'], model[spacing + 'LeftUnit']);

    return `${top} ${right} ${bottom} ${left}`;
  }

  private getCssValue(
    value: MarginValue | PaddingValue | undefined,
    unit: MarginUnit | PaddingUnit | undefined
  ): string {
    if (value == null || value === 0) {
      return '0';
    }

    if (value === 'auto') {
      return 'auto';
    }

    if (!unit) {
      unit = 'px';
    }

    return `${value}${unit}`;
  }
}
