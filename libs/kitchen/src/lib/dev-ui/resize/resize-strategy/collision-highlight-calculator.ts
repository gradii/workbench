import { Inject, Injectable } from '@angular/core';
import { BreakpointWidth, SpaceHeightType } from '@common/public-api';

import { noopRulers, ResizeContext, Ruler, Rulers, Size, VIRTUAL_COMPONENT } from '../model';
import { CollisionBag } from './collision-detector';
import { getAsBoundingClientRect, getAsStyles, getParentVirtualComponent, isParent } from '../../util';
import { exceededHorizontalThreshold, exceededVerticalThreshold } from '../util';
import { FlourComponent } from '../../../model';

@Injectable()
export class CollisionHighlightCalculator {
  private virtualComponent: FlourComponent;

  constructor(@Inject(VIRTUAL_COMPONENT) virtualComponent) {
    this.virtualComponent = virtualComponent;
  }

  calcRulers(hostSize: Size, collision: CollisionBag, ctx: ResizeContext): Rulers {
    const rulers: Rulers = noopRulers();

    if (this.shouldDrawVerticalRuler(collision, hostSize, ctx)) {
      rulers.vertical = this.createVerticalRuler(collision);
    }

    if (this.shouldDrawHorizontalRuler(collision, hostSize, ctx)) {
      rulers.horizontal = this.createHorizontalRuler(collision);
    }

    return rulers;
  }

  private shouldDrawHorizontalRuler(collision: CollisionBag, hostSize: Size, ctx: ResizeContext): boolean {
    const prevHostRect: ClientRect = getAsBoundingClientRect(this.virtualComponent);
    const bottomThreshold = ctx.parentRect.top + ctx.parentRect.height;

    if (collision.y && isParent(this.virtualComponent, collision.y.virtualComponent) && this.isParentHeightAuto()) {
      return false;
    }

    return !!collision.y && !exceededVerticalThreshold(prevHostRect, hostSize, bottomThreshold);
  }

  private shouldDrawVerticalRuler(collision: CollisionBag, hostSize: Size, ctx: ResizeContext): boolean {
    const prevHostRect: ClientRect = getAsBoundingClientRect(this.virtualComponent);
    const rightThreshold = ctx.parentRect.left + ctx.parentRect.width;
    return !!collision.x && !exceededHorizontalThreshold(prevHostRect, hostSize, rightThreshold);
  }

  private createHorizontalRuler(collision: CollisionBag): Ruler {
    return {
      coordinate: collision.y.coordinate - 1,
      collisionPosition: collision.y.position
    };
  }

  private createVerticalRuler(collision: CollisionBag): Ruler {
    return {
      coordinate: collision.x.coordinate - 1,
      collisionPosition: collision.x.position
    };
  }

  private isParentHeightAuto(): boolean {
    const parent = getParentVirtualComponent(this.virtualComponent);
    const { height } = getAsStyles(parent)[BreakpointWidth.Desktop];
    return height.type === SpaceHeightType.AUTO;
  }
}
