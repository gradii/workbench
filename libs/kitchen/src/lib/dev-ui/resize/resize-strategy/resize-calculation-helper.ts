import { Inject, Injectable } from '@angular/core';
import { SpaceHeightType, SpaceWidthType, StylesCompilerService } from '@common/public-api';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ATTACHED_COMPONENTS$, Point, VIRTUAL_COMPONENT } from '../model';
import { FlourComponent } from '../../../model';
import { reverseResize } from '../util';
import { getAsBoundingClientRect, getParentVirtualComponent, isParent } from '../../util';
import { CollisionBag } from './collision-detector';

export interface ResizeCalculationHelper {
  calcHostShift(cursorPosition: Point, startPosition: Point): Point;

  stickWidth(collision: CollisionBag, parentRect: ClientRect, initialCursorPosition: Point): boolean;

  stickHeight(collision: CollisionBag, virtualComponent: FlourComponent, initialCursorPosition: Point): boolean;

  fullSizeStickWidth(prevHostRect: ClientRect, parentRect: ClientRect): boolean;

  fullSizeStickHeight(prevHostRect: ClientRect, parentRect: ClientRect): boolean;

  autoStickAvailable(): Observable<boolean>;

  calcMaxWidth(hostRect: ClientRect, parentRect: ClientRect): number;

  calcMaxHeight(hostRect: ClientRect, parentRect: ClientRect): number;
}

@Injectable()
export class ResizeCalculationHelperFactory {
  private virtualComponent: FlourComponent;
  private attachedComponents$: Observable<FlourComponent[]>;

  constructor(
    @Inject(VIRTUAL_COMPONENT) virtualComponent,
    @Inject(ATTACHED_COMPONENTS$) attachedComponents,
    private stylesCompiler: StylesCompilerService
  ) {
    this.virtualComponent = virtualComponent;
    this.attachedComponents$ = attachedComponents;
  }

  create(): ResizeCalculationHelper {
    if (reverseResize(this.virtualComponent)) {
      return new ReversedResizeCalculationHelper(this.virtualComponent, this.stylesCompiler, this.attachedComponents$);
    }

    return new BaseResizeCalculationHelper(this.virtualComponent, this.stylesCompiler, this.attachedComponents$);
  }
}

export class BaseResizeCalculationHelper implements ResizeCalculationHelper {
  constructor(
    private vc: FlourComponent,
    private stylesCompiler: StylesCompilerService,
    private attachedComponents$: Observable<FlourComponent[]>
  ) {
  }

  calcHostShift(handleCenter: Point, startHandleCenter: Point): Point {
    return { x: handleCenter.x - startHandleCenter.x, y: handleCenter.y - startHandleCenter.y };
  }

  stickWidth(collision: CollisionBag, parentRect: ClientRect, initialCursorPosition: Point): boolean {
    return (
      this.collisionWithParentHorizontally(collision) || this.cursorRighterThanParent(initialCursorPosition, parentRect)
    );
  }

  stickHeight(collision: CollisionBag, virtualComponent: FlourComponent, initialCursorPosition: Point): boolean {
    return (
      this.collisionWithParentVertically(collision) ||
      this.cursorBelowThanParent(initialCursorPosition, virtualComponent)
    );
  }

  fullSizeStickWidth(prevHostRect: ClientRect, parentRect: ClientRect): boolean {
    return Math.floor(prevHostRect.left) === Math.floor(parentRect.left);
  }

  fullSizeStickHeight(prevHostRect: ClientRect, parentRect: ClientRect): boolean {
    return Math.floor(prevHostRect.top) === Math.floor(parentRect.top) && !this.isParentHeightAuto();
  }

  autoStickAvailable(): Observable<boolean> {
    return this.attachedComponents$.pipe(
      take(1),
      map((attachedComponents: FlourComponent[]) => {
        const siblingsIds = this.vc.parentSlot.componentList.map(c => c.id);
        const siblings = attachedComponents
          .sort((a, b) => a.index - b.index)
          .filter(vc => siblingsIds.includes(vc.component.id));
        const currentIndex = siblings.findIndex(c => c.component.id === this.vc.component.id);
        // it's the last element in the row
        return currentIndex === siblings.length - 1;
      })
    );
  }

  calcMaxWidth(hostRect: ClientRect, parentRect: ClientRect): number {
    const parent = getParentVirtualComponent(this.vc);
    const { paddings } = this.stylesCompiler.compileStyles(parent.component.styles);
    const width = parentRect.right - hostRect.left;
    if (!paddings) {
      return width;
    }
    return width - (paddings.paddingRight || 0);
  }

  calcMaxHeight(hostRect: ClientRect, parentRect: ClientRect): number {
    const parent = getParentVirtualComponent(this.vc);
    const { paddings } = this.stylesCompiler.compileStyles(parent.component.styles);
    const height = parentRect.bottom - hostRect.top;
    if (!paddings) {
      return height;
    }
    return height - (paddings.paddingBottom || 0);
  }

  private isParentHeightAuto(): boolean {
    const parent = getParentVirtualComponent(this.vc);
    const { height } = this.stylesCompiler.compileStyles(parent.component.styles);
    return height.type === SpaceWidthType.AUTO;
  }

  private collisionWithParentHorizontally(collision: CollisionBag): boolean {
    return collision.x && isParent(this.vc, collision.x.virtualComponent);
  }

  private collisionWithParentVertically(collision: CollisionBag): boolean {
    return collision.y && isParent(this.vc, collision.y.virtualComponent);
  }

  private cursorRighterThanParent(cursorPosition: Point, parentRect: ClientRect): boolean {
    const { paddings } = this.stylesCompiler.compileStyles(this.vc.parentComponent.component.styles);
    return cursorPosition.x > parentRect.right - ((paddings && paddings.paddingRight) || 0);
  }

  private cursorBelowThanParent(cursorPosition: Point, virtualComponent: FlourComponent): boolean {
    const parent: FlourComponent = getParentVirtualComponent(virtualComponent);
    const parentRect: ClientRect = getAsBoundingClientRect(parent);
    const { height, paddings } = this.stylesCompiler.compileStyles(parent.component.styles);
    const isParentAuto: boolean = height.type === SpaceHeightType.AUTO;
    return !isParentAuto && cursorPosition.y > parentRect.bottom - ((paddings && paddings.paddingBottom) || 0);
  }
}

export class ReversedResizeCalculationHelper implements ResizeCalculationHelper {
  constructor(
    private vc: FlourComponent,
    private stylesCompiler: StylesCompilerService,
    private attachedComponents$: Observable<FlourComponent[]>
  ) {
  }

  calcHostShift(cursorPosition: Point, startPosition: Point): Point {
    return { x: startPosition.x - cursorPosition.x, y: cursorPosition.y - startPosition.y };
  }

  stickWidth(collision: CollisionBag, parentRect: ClientRect, initialCursorPosition: Point): boolean {
    return (
      this.collisionWithParentHorizontally(collision) || this.cursorLefterThanParent(initialCursorPosition, parentRect)
    );
  }

  stickHeight(collision: CollisionBag, virtualComponent: FlourComponent, initialCursorPosition: Point): boolean {
    return (
      this.collisionWithParentVertically(collision) ||
      this.cursorBelowThanParent(initialCursorPosition, virtualComponent)
    );
  }

  fullSizeStickWidth(prevHostRect: ClientRect, parentRect: ClientRect): boolean {
    return Math.floor(prevHostRect.right) === Math.floor(parentRect.right);
  }

  fullSizeStickHeight(prevHostRect: ClientRect, parentRect: ClientRect): boolean {
    return Math.floor(prevHostRect.top) === Math.floor(parentRect.top) && !this.isParentHeightAuto();
  }

  autoStickAvailable(): Observable<boolean> {
    return this.attachedComponents$.pipe(
      take(1),
      map((attachedComponents: FlourComponent[]) => {
        const siblingsIds = this.vc.parentSlot.componentList.map(c => c.id);
        const siblings = attachedComponents
          .sort((a, b) => a.index - b.index)
          .filter(vc => siblingsIds.includes(vc.component.id));
        const currentIndex = siblings.findIndex(c => c.component.id === this.vc.component.id);
        // it's the first element in the row
        return currentIndex === 0;
      })
    );
  }

  calcMaxWidth(hostRect: ClientRect, parentRect: ClientRect): number {
    const parent = getParentVirtualComponent(this.vc);
    const { paddings } = this.stylesCompiler.compileStyles(parent.component.styles);
    const width = parentRect.right - hostRect.left;
    if (!paddings) {
      return width;
    }
    return width - (paddings.paddingLeft || 0);
  }

  calcMaxHeight(hostRect: ClientRect, parentRect: ClientRect): number {
    const parent = getParentVirtualComponent(this.vc);
    const { paddings } = this.stylesCompiler.compileStyles(parent.component.styles);
    const height = parentRect.bottom - hostRect.top;
    if (!paddings) {
      return height;
    }
    return height - (paddings.paddingBottom || 0);
  }

  private isParentHeightAuto(): boolean {
    const parent = getParentVirtualComponent(this.vc);
    const { height } = this.stylesCompiler.compileStyles(parent.component.styles);
    return height.type === SpaceWidthType.AUTO;
  }

  private collisionWithParentHorizontally(collision: CollisionBag): boolean {
    return collision.x && isParent(this.vc, collision.x.virtualComponent);
  }

  private collisionWithParentVertically(collision: CollisionBag): boolean {
    return collision.y && isParent(this.vc, collision.y.virtualComponent);
  }

  private cursorLefterThanParent(cursorPosition: Point, parentRect: ClientRect): boolean {
    return cursorPosition.x < parentRect.left;
  }

  private cursorBelowThanParent(cursorPosition: Point, virtualComponent: FlourComponent): boolean {
    const parent: FlourComponent = getParentVirtualComponent(virtualComponent);
    const parentRect: ClientRect = getAsBoundingClientRect(parent);
    const parentStyles = this.stylesCompiler.compileStyles(parent.component.styles);
    const isParentAuto: boolean = parentStyles.height.type === SpaceHeightType.AUTO;
    return !isParentAuto && cursorPosition.y > parentRect.bottom;
  }
}
