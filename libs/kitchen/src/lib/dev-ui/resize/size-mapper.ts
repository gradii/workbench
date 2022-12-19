import { SpaceHeight, SpaceHeightType, SpaceWidth, SpaceWidthType } from '@common/public-api';
import { Injectable } from '@angular/core';

import { Dimension } from './model';

@Injectable()
export class SizeMapper {
  parseSpaceWidth(width: SpaceWidth, fallbackRect: ClientRect): Dimension {
    if (width.type === SpaceWidthType.AUTO) {
      return { auto: true };
    }

    if (width.type === SpaceWidthType.CUSTOM && width.customUnit === '%') {
      return { value: width.customValue, unit: width.customUnit };
    }

    if (width.customUnit === 'col') {
      return { value: fallbackRect.width, unit: 'px' };
    }

    return {
      value: width.customValue,
      unit: width.customUnit
    };
  }

  parseSpaceHeight(height: SpaceHeight, fallbackRect: ClientRect): Dimension {
    if (height.type === SpaceHeightType.AUTO) {
      return { value: fallbackRect.height, unit: 'px' };
    }

    return {
      value: height.customValue,
      unit: height.customUnit
    };
  }

  createSpaceWidth(width: Dimension): SpaceWidth {
    if (width.auto) {
      return {
        type: SpaceWidthType.AUTO,
        customValue: Math.round(width.value),
        customUnit: width.unit
      };
    }
    return {
      type: SpaceWidthType.CUSTOM,
      customValue: Math.round(width.value),
      customUnit: width.unit
    };
  }

  createSpaceHeight(height: Dimension): SpaceHeight {
    if (height.auto) {
      return {
        type: SpaceHeightType.AUTO,
        customValue: Math.round(height.value),
        customUnit: height.unit
      };
    }
    return {
      type: SpaceHeightType.CUSTOM,
      customValue: Math.round(height.value),
      customUnit: height.unit
    };
  }
}
