import { Inject, Injectable } from '@angular/core';
import { StylesCompilerService } from '@common';

import { Multiplier, Point, ResizeContext, Size, VIRTUAL_COMPONENT } from '../model';
import { VirtualComponent } from '../../../model';
import { ResizeCalculationHelper, ResizeCalculationHelperFactory } from './resize-calculation-helper';

export const MIN_SPACE_DIMENSION = 12;

@Injectable()
export class HostSizeCalculator {
  private virtualComponent: VirtualComponent;
  private resizeCalculationHelper: ResizeCalculationHelper;

  constructor(
    @Inject(VIRTUAL_COMPONENT) virtualComponent,
    private stylesCompiler: StylesCompilerService,
    private resizeCalculationHelperFactory: ResizeCalculationHelperFactory
  ) {
    this.virtualComponent = virtualComponent;
    this.resizeCalculationHelper = resizeCalculationHelperFactory.create();
  }

  calcHostSize(handleCenter: Point, ctx: ResizeContext, multiplier: Multiplier): Size {
    const { startHandleCenter, hostRect } = ctx;
    const hostShift: Point = this.resizeCalculationHelper.calcHostShift(handleCenter, startHandleCenter);

    const hostSize: Size = {
      width: Math.round(hostRect.width + hostShift.x * multiplier.horizontal),
      height: Math.round(hostRect.height + hostShift.y * multiplier.vertical)
    };

    // We can't make space smaller than MIN_SPACE_DIMENSION
    if (hostSize.width < MIN_SPACE_DIMENSION) {
      hostSize.width = MIN_SPACE_DIMENSION;
    }

    // We can't make space smaller than MIN_SPACE_DIMENSION
    if (hostSize.height < MIN_SPACE_DIMENSION) {
      hostSize.height = MIN_SPACE_DIMENSION;
    }

    return hostSize;
  }
}
