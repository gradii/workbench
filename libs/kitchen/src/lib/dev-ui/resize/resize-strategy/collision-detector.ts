import { Inject, Injectable } from '@angular/core';
import { SpaceWidthType, StylesCompilerService } from '@common/public-api';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FlourComponent } from '../../../model';
import { DOMElementsService } from '../../dom-elements.service';
import { getAsBoundingClientRect, getAsElement, getParentVirtualComponent, isParent } from '../../util';

import { ATTACHED_COMPONENTS$, Point, VIRTUAL_COMPONENT } from '../model';
import { reverseResize } from '../util';
import { ResizeDimension } from './mousedown-provider';
import { ResizeCalculationHelper, ResizeCalculationHelperFactory } from './resize-calculation-helper';

export enum CollisionPosition {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
}

export interface Collision {
  coordinate: number;
  position: CollisionPosition;
  virtualComponent: FlourComponent;
}

export const noCollisionBag = { x: null, y: null };

export interface CollisionBag {
  x?: Collision;
  y?: Collision;
}

/**
 * Number of pixels which will stick to the position from each side
 * */
export const STICK_GAP = 5;

@Injectable()
export class CollisionDetector {
  private vc: FlourComponent;
  private attachedComponents$: Observable<FlourComponent[]>;
  private window: Window;
  private resizeCalculationHelper: ResizeCalculationHelper;

  constructor(
    @Inject(VIRTUAL_COMPONENT) virtualComponent,
    @Inject(ATTACHED_COMPONENTS$) attachedComponents$,
    private stylesCompiler: StylesCompilerService,
    private domElementsService: DOMElementsService,
    resizeCalculationHelpFactory: ResizeCalculationHelperFactory
  ) {
    this.vc = virtualComponent;
    this.attachedComponents$ = attachedComponents$;
    this.window = window;
    this.resizeCalculationHelper = resizeCalculationHelpFactory.create();
  }

  // Seeks for collisions between point and any element on the screen;
  findCollision(point: Point, cursor: Point, dimension: ResizeDimension): Observable<CollisionBag> {
    return this.attachedComponents$.pipe(
      take(1),
      map((components: FlourComponent[]) => {
        let x: Collision;
        let y: Collision;

        for (const component of components) {
          // We don't need to check collision with selected space, children and elements which are out of the screen
          if (this.activeComponent(component) || this.child(component) || !this.inViewport(component)) {
            continue;
          }

          // Try to match component with the point and find collisions
          const collision: CollisionBag = this.match(point, component, cursor);

          // If horizontal collision found the first time, then write it
          // otherwise do nothing.
          // Also, taking into account resize dimension, if it's vertical than no need to search x collisions
          if (dimension !== 'vertical' && collision.x && (!x || isParent(this.vc, collision.x.virtualComponent))) {
            x = collision.x;
          }

          // If vertical collision found the first time, then write it
          // otherwise do nothing
          // Also, taking into account resize dimension, if it's horizontal than no need to search y collisions
          if (dimension !== 'horizontal' && collision.y && (!y || isParent(this.vc, collision.y.virtualComponent))) {
            y = collision.y;
          }
        }

        return { x, y };
      })
    );
  }

  private match(point: Point, virtualComponent: FlourComponent, cursor: Point): CollisionBag {
    const collision: CollisionBag = this.collide(point, virtualComponent, cursor);

    if (this.touchesHost(collision.x)) {
      collision.x = null;
    }

    if (this.touchesHost(collision.y)) {
      collision.y = null;
    }

    return collision;
  }

  private activeComponent(component: FlourComponent): boolean {
    return component.component.id === this.vc.component.id;
  }

  private collide(point: Point, virtualComponent: FlourComponent, cursor: Point): CollisionBag {
    const x: Collision = this.getXCollision(point, virtualComponent, cursor);
    const y: Collision = this.getYCollision(point, virtualComponent);

    return { x, y };
  }

  private cursorHorizontallyOutParent(cursor: Point) {
    const parentFlourComponent = getParentVirtualComponent(this.vc);
    const parentRect = getAsBoundingClientRect(parentFlourComponent);
    const paddingGap = this.getHorizontalPaddingGap(parentFlourComponent);

    if (reverseResize(this.vc)) {
      return cursor.x < parentRect.left + paddingGap;
    }

    return cursor.x > parentRect.right - paddingGap;
  }

  private getXCollision(point: Point, virtualComponent: FlourComponent, currentMouse: Point): Collision {
    const { left, width } = getAsBoundingClientRect(virtualComponent);
    const leftCoordinate = Math.floor(left + this.window.scrollX);
    const rightCoordinate = Math.floor(left + width + this.window.scrollX);

    if (isParent(this.vc, virtualComponent) || this.cursorHorizontallyOutParent(currentMouse)) {
      const parentCollision: Collision = this.getXCollisionWithParent(point, virtualComponent, currentMouse);

      if (parentCollision) {
        return parentCollision;
      }
    }

    if (this.matchFace(rightCoordinate, point.x)) {
      return { coordinate: rightCoordinate, position: CollisionPosition.RIGHT, virtualComponent };
    }

    if (this.matchFace(leftCoordinate, point.x)) {
      return { coordinate: leftCoordinate, position: CollisionPosition.LEFT, virtualComponent };
    }
  }

  private getYCollision(point: Point, virtualComponent: FlourComponent): Collision {
    const { top, height } = getAsBoundingClientRect(virtualComponent);
    const topCoordinate = Math.floor(top + this.window.scrollY);
    const bottomCoordinate = Math.floor(top + height + this.window.scrollY);
    const parent = getParentVirtualComponent(this.vc);
    const { height: parentHeight } = this.stylesCompiler.compileStyles(parent.component.styles);

    if (isParent(this.vc, virtualComponent) && parentHeight.type !== SpaceWidthType.AUTO) {
      const parentCollision: Collision = this.getYCollisionWithParent(point, virtualComponent);

      if (parentCollision) {
        return parentCollision;
      }
    }

    if (this.matchFace(topCoordinate, point.y)) {
      return { coordinate: topCoordinate, position: CollisionPosition.TOP, virtualComponent };
    }

    if (this.matchFace(bottomCoordinate, point.y)) {
      return { coordinate: bottomCoordinate, position: CollisionPosition.BOTTOM, virtualComponent };
    }
  }

  private getXCollisionWithParent(point: Point, virtualComponent: FlourComponent, currentMouse: Point): Collision {
    const { left, width } = getAsBoundingClientRect(virtualComponent);
    const leftCoordinate = Math.floor(left + this.window.scrollX);
    const padding = this.getHorizontalPaddingGap(virtualComponent);
    const rightCoordinate = Math.floor(left + width - padding + this.window.scrollX);

    if (point.x <= leftCoordinate || currentMouse.x <= leftCoordinate) {
      return { coordinate: leftCoordinate, position: CollisionPosition.LEFT, virtualComponent };
    }

    if (point.x >= rightCoordinate || currentMouse.x >= rightCoordinate) {
      return { coordinate: rightCoordinate, position: CollisionPosition.RIGHT, virtualComponent };
    }
  }

  private getYCollisionWithParent(point: Point, virtualComponent: FlourComponent): Collision {
    const { top, height } = getAsBoundingClientRect(virtualComponent);
    const topCoordinate = Math.floor(top + this.window.scrollY);
    const padding = this.getVerticalPaddingGap(virtualComponent);
    const bottomCoordinate = Math.floor(top + height - padding + this.window.scrollY);

    if (point.y <= topCoordinate) {
      return { coordinate: topCoordinate, position: CollisionPosition.TOP, virtualComponent };
    }

    if (point.y >= bottomCoordinate) {
      return { coordinate: bottomCoordinate, position: CollisionPosition.BOTTOM, virtualComponent };
    }
  }

  private matchFace(pointCoordinate: number, rectCoordinate: number): boolean {
    const coordinate = Math.floor(rectCoordinate);
    const leftThreshold = coordinate - STICK_GAP;
    const rightThreshold = coordinate + STICK_GAP + 1;

    return leftThreshold <= pointCoordinate && pointCoordinate <= rightThreshold;
  }

  /**
   * Checks whether component is a child of the resizable element
   * */
  private child(virtualComponent: FlourComponent): boolean {
    const parent: Node = getAsElement(this.vc);
    const child: Node = getAsElement(virtualComponent);

    return parent.contains(child);
  }

  private inViewport(virtualComponent: FlourComponent): boolean {
    // no matter whether parent fully at the view port or not, we ought to detect collisions with it
    if (isParent(this.vc, virtualComponent)) {
      return true;
    }

    return this.domElementsService.inViewport(virtualComponent);
  }

  private touchesHost(collision: Collision): boolean {
    if (!collision) {
      return false;
    }

    const collidedRect: ClientRect = getAsBoundingClientRect(collision.virtualComponent);
    const hostRect: ClientRect = getAsBoundingClientRect(this.vc);

    if (collision.position === CollisionPosition.LEFT) {
      const collidedStrictlyAboveHost = hostRect.top >= collidedRect.top + collidedRect.height;
      const collidedStrictlyBelowHost = hostRect.top + hostRect.height <= collidedRect.top;

      return !collidedStrictlyAboveHost && !collidedStrictlyBelowHost;
    }

    if (collision.position === CollisionPosition.TOP) {
      const collidedStrictlyLeftThanHost = hostRect.left >= collidedRect.left + collidedRect.width;
      const collidedStrictlyRightThanHost = hostRect.left + hostRect.width <= collidedRect.left;

      return !collidedStrictlyLeftThanHost && !collidedStrictlyRightThanHost;
    }

    return false;
  }

  private getHorizontalPaddingGap(virtualComponent: FlourComponent): number {
    const { paddings } = this.stylesCompiler.compileStyles(virtualComponent.component.styles);
    if (!paddings) {
      return 0;
    }
    if (reverseResize(this.vc)) {
      return paddings.paddingLeft || 0;
    }
    return paddings.paddingRight || 0;
  }

  private getVerticalPaddingGap(virtualComponent: FlourComponent): number {
    const { paddings } = this.stylesCompiler.compileStyles(virtualComponent.component.styles);
    if (!paddings) {
      return 0;
    }
    return paddings.paddingBottom || 0;
  }
}
