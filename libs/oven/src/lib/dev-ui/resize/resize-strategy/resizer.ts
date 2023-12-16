import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, iif, Observable, of } from 'rxjs';
import { map, pairwise, startWith, switchMap, tap } from 'rxjs/operators';

import { RenderState } from '../../../state/render-state.service';
import {
  Dimension,
  Multiplier,
  noopRulers,
  Point,
  Rect,
  ResizeContext,
  Rulers,
  Size,
  VIRTUAL_COMPONENT
} from '../model';
import { CollisionBag, CollisionDetector, noCollisionBag } from './collision-detector';
import { getAsElement, getParentDirection, isParent } from '../../util';
import { VirtualComponent } from '../../../model';
import { CollisionHighlightCalculator } from './collision-highlight-calculator';
import { HostSizeCalculator } from './host-size-calculator';
import { RectCalculator } from './rect-calculator';
import { ResizeCalculationHelper, ResizeCalculationHelperFactory } from './resize-calculation-helper';
import { MultiplierResolver } from './multiplier-resolver';
import { ResizeDimension } from './mousedown-provider';

/**
 * Performs actual resize of the space
 * */
@Injectable()
export class Resizer implements OnDestroy {
  private vc: VirtualComponent;

  private rulers = new BehaviorSubject<Rulers>(noopRulers());
  public readonly rulers$: Observable<Rulers> = this.rulers.asObservable();

  private resizeCalculationHelper: ResizeCalculationHelper;
  private lastRect: Rect;

  constructor(
    @Inject(VIRTUAL_COMPONENT) virtualComponent,
    private collisionDetector: CollisionDetector,
    private collisionHighlightCalculator: CollisionHighlightCalculator,
    private hostSizeCalculator: HostSizeCalculator,
    private rectCalculator: RectCalculator,
    private multiplierResolver: MultiplierResolver,
    private state: RenderState,
    resizeCalculationHelperFactory: ResizeCalculationHelperFactory
  ) {
    this.vc = virtualComponent;
    this.resizeCalculationHelper = resizeCalculationHelperFactory.create();
  }

  ngOnDestroy(): void {
    this.endResize();
  }

  setInitialRect(rect: Rect): void {
    this.lastRect = rect;
  }

  resize(event: MouseEvent, ctx: ResizeContext, dimension: ResizeDimension): Observable<Rect> {
    event.preventDefault();

    const multiplier: Multiplier = this.multiplierResolver.resolveMultiplier(ctx.parentRect);

    // Point on the screen the user pressed
    const cursor: Point = { x: event.pageX, y: event.pageY };

    // Potential handle center is a place where we'll potentially move handle in case of no collisions or other restrictions.
    // We'll figure out where to move handle and how to resize this element based on that potential handle position.
    const potentialHandleCenter: Point = this.applyHandleOffset(cursor, ctx);

    return this.resolveCollisions(event, potentialHandleCenter, cursor, dimension).pipe(
      switchMap((collisionBag: CollisionBag) => {
        const hostSize: Size = this.calcHostSize(potentialHandleCenter, collisionBag, ctx, multiplier);
        this.updateRulers(hostSize, collisionBag, ctx);
        return this.rectCalculator.calcRect(hostSize, collisionBag, ctx, cursor, multiplier);
      }),
      startWith(this.lastRect),
      pairwise(),
      map((rects: [Rect, Rect]) => this.verifyOnlyRequiredDimensionResized(rects, dimension)),
      tap((rect: Rect) => {
        this.lastRect = rect;
        this.moveHost(rect);
      })
    );
  }

  endResize(): void {
    this.clearFlexboxFixes();
  }

  private applyHandleOffset(cursor: Point, ctx: ResizeContext): Point {
    const cursorOffsetX = cursor.x - ctx.startCursorPosition.x;
    const cursorOffsetY = cursor.y - ctx.startCursorPosition.y;

    return {
      x: cursorOffsetX + ctx.startHandleCenter.x,
      y: cursorOffsetY + ctx.startHandleCenter.y
    };
  }

  private calcHostSize(
    potentialHandleCenter: Point,
    collisionBag: CollisionBag,
    ctx: ResizeContext,
    multiplier: Multiplier
  ): Size {
    const handleCenter: Point = this.applyCollisionsToPotentialHandleCenter(potentialHandleCenter, collisionBag);
    return this.hostSizeCalculator.calcHostSize(handleCenter, ctx, multiplier);
  }

  private applyCollisionsToPotentialHandleCenter(potentialHandleCenter: Point, collision: CollisionBag): Point {
    const handleCenter: Point = { x: potentialHandleCenter.x, y: potentialHandleCenter.y };

    if (collision.x) {
      handleCenter.x = collision.x.coordinate;
    }

    if (collision.y) {
      handleCenter.y = collision.y.coordinate;
    }

    return handleCenter;
  }

  private updateRulers(hostSize: Size, collision: CollisionBag, ctx: ResizeContext): void {
    const rulers: Rulers = this.collisionHighlightCalculator.calcRulers(hostSize, collision, ctx);
    this.highlightPaddings(collision);
    this.rulers.next(rulers);
  }

  private resolveCollisions(
    event: MouseEvent,
    potentialHandleCenter: Point,
    cursor: Point,
    dimension: ResizeDimension
  ): Observable<CollisionBag> {
    return iif(
      () => event.altKey,
      this.collisionDetector.findCollision(potentialHandleCenter, cursor, dimension),
      of(noCollisionBag)
    );
  }

  private verifyOnlyRequiredDimensionResized([prev, curr]: [Rect, Rect], dimension: ResizeDimension): Rect {
    if (dimension === 'vertical') {
      return { ...prev, height: curr.height, dimension };
    }

    if (dimension === 'horizontal') {
      return { ...prev, width: curr.width, dimension };
    }

    return curr;
  }

  private moveHost(rect: Rect): void {
    const host = getAsElement(this.vc);
    const { width, height } = rect;
    host.style.width = width.auto ? 'auto' : width.value + width.unit;
    host.style.height = height.auto ? 'auto' : height.value + height.unit;

    this.setFlexboxFixes(rect);
  }

  private setFlexboxFixes(rect: Rect): void {
    const host = getAsElement(this.vc);
    const majorDimension = this.getMajorDimension(rect);

    if (majorDimension.auto) {
      host.style.flexGrow = '1';
      host.style.flexBasis = '0';
    } else {
      host.style.flexGrow = '0';
      host.style.flexBasis = majorDimension.value + majorDimension.unit;
    }
  }

  private clearFlexboxFixes(): void {
    if (!this.lastRect) {
      return;
    }

    const majorDimension: Dimension = this.getMajorDimension(this.lastRect);
    const host = getAsElement(this.vc);
    let flexBasis;

    if (majorDimension.auto) {
      flexBasis = '0';
    } else {
      flexBasis = null;
    }

    host.style.flexBasis = flexBasis;
  }

  private getMajorDimension(rect: Rect): Dimension {
    const direction = getParentDirection(this.vc);
    const majorDimensionName = direction === 'row' ? 'width' : 'height';
    return rect[majorDimensionName];
  }

  private highlightPaddings(collision: CollisionBag): void {
    let paddingHighlighted = false;

    if (collision.x && isParent(this.vc, collision.x.virtualComponent)) {
      this.state.highlightComponentPaddings(collision.x.virtualComponent.component.id);
      paddingHighlighted = true;
    }

    if (collision.y && isParent(this.vc, collision.y.virtualComponent)) {
      this.state.highlightComponentPaddings(collision.y.virtualComponent.component.id);
      paddingHighlighted = true;
    }

    // If we don't need to highlight something, then, we're just clearing it
    if (!paddingHighlighted) {
      this.state.highlightComponentPaddings('');
    }
  }
}
