import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Dimension, Multiplier, Point, Rect, ResizeContext, Size, VIRTUAL_COMPONENT } from '../model';
import { CollisionBag } from './collision-detector';
import { getAsBoundingClientRect, getParentVirtualComponent } from '../../util';
import { ResizeCalculationHelper, ResizeCalculationHelperFactory } from './resize-calculation-helper';
import { FlourComponent } from '../../../model';

@Injectable()
export class RectCalculator {
  private virtualComponent: FlourComponent;
  private resizeCalculationHelper: ResizeCalculationHelper;

  constructor(
    @Inject(VIRTUAL_COMPONENT) virtualComponent,
    resizeCalculationHelperFactory: ResizeCalculationHelperFactory
  ) {
    this.virtualComponent = virtualComponent;
    this.resizeCalculationHelper = resizeCalculationHelperFactory.create();
  }

  calcRect(
    hostSize: Size,
    collision: CollisionBag,
    ctx: ResizeContext,
    cursor: Point,
    multiplier: Multiplier
  ): Observable<Rect> {
    const height: Dimension = this.calcRectHeight(hostSize, collision, ctx, cursor, multiplier);
    return this.calcRectWidth(hostSize, collision, ctx, cursor, multiplier).pipe(map(width => ({ width, height })));
  }

  private calcRectWidth(
    hostSize: Size,
    collision: CollisionBag,
    ctx: ResizeContext,
    cursor: Point,
    multiplier: Multiplier
  ): Observable<Dimension> {
    const { hostRect, startCursorPosition } = ctx;
    const prevHostRect: ClientRect = getAsBoundingClientRect(this.virtualComponent);

    return this.resizeCalculationHelper.autoStickAvailable().pipe(
      map((autoStickAvailable: boolean) => {
        // recalculating parentRect since it might change because appeared scroll
        const parentRect: ClientRect = getAsBoundingClientRect(getParentVirtualComponent(this.virtualComponent));
        const isStick = this.resizeCalculationHelper.stickWidth(collision, parentRect, cursor);
        const isFullSize = this.resizeCalculationHelper.fullSizeStickWidth(prevHostRect, parentRect);
        const m = multiplier.horizontal - 1;
        const offsetX = m ? (startCursorPosition.x - cursor.x) / m : 0;

        if (!isStick) {
          return { value: Math.round(hostSize.width), unit: 'px' };
        }

        if (isFullSize) {
          return { value: 100, unit: '%' };
        }

        if (autoStickAvailable) {
          return { value: 100, unit: '%', auto: true };
        }

        if (isStick) {
          const width = this.resizeCalculationHelper.calcMaxWidth(hostRect, parentRect);
          return { value: width - offsetX, unit: 'px' };
        }

        return { value: Math.round(hostSize.width), unit: 'px' };
      })
    );
  }

  private calcRectHeight(
    hostSize: Size,
    collision: CollisionBag,
    ctx: ResizeContext,
    cursor: Point,
    multiplier: Multiplier
  ): Dimension {
    const { hostRect, startCursorPosition } = ctx;
    const prevHostRect: ClientRect = getAsBoundingClientRect(this.virtualComponent);
    // recalculating parentRect since it might change because appeared scroll
    const parentRect: ClientRect = getAsBoundingClientRect(getParentVirtualComponent(this.virtualComponent));

    const isStick = this.resizeCalculationHelper.stickHeight(collision, this.virtualComponent, cursor);
    const isFullSize = this.resizeCalculationHelper.fullSizeStickHeight(prevHostRect, parentRect);
    const m = multiplier.vertical - 1;
    const offsetY = m ? (startCursorPosition.y - cursor.y) / m : 0;

    if (!isStick) {
      return { value: Math.round(hostSize.height), unit: 'px' };
    }

    if (isFullSize) {
      return { value: 100, unit: '%' };
    }

    if (isStick) {
      const height = this.resizeCalculationHelper.calcMaxHeight(hostRect, parentRect);
      return { value: height - offsetY, unit: 'px' };
    }

    return { value: Math.round(hostSize.height), unit: 'px' };
  }
}
