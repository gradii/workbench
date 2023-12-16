import { Inject, Injectable } from '@angular/core';
import { BreakpointWidth } from '@common';

import { Multiplier, VIRTUAL_COMPONENT } from '../model';
import {
  getAsBoundingClientRect,
  getAsStyles,
  getParentComponent,
  getParentVirtualComponent,
  isSpace
} from '../../util';
import { VirtualComponent } from '../../../model';

@Injectable()
export class MultiplierResolver {
  private virtualComponent: VirtualComponent;

  constructor(@Inject(VIRTUAL_COMPONENT) virtualComponent) {
    this.virtualComponent = virtualComponent;
  }

  /**
   * If resizing element which is centered inside the parent, then resizing will change elements position,
   * So, we ought to introduce specific multipliers which will solve the issue
   *
   * TODO: think on elements which are not centered when using space-between and space-around positions
   * TODO: the same for column
   * */
  resolveMultiplier(parentRect: ClientRect): Multiplier {
    const parentVC = getParentVirtualComponent(this.virtualComponent);
    const parentComponent = getParentComponent(this.virtualComponent);
    if (!parentComponent || !isSpace(parentVC)) {
      return new Multiplier();
    }

    let horizontalCoefficient = 1;
    let verticalCoefficient = 1;

    const { justify, align, direction } = getAsStyles(parentVC)[BreakpointWidth.Desktop];
    const hostRect: ClientRect = getAsBoundingClientRect(this.virtualComponent);

    if (direction === 'row') {
      /**
       * If element is centered at the parent we're using multiplier === 2
       * since we ought to compensate that counterpart of the space is also moving
       *
       * ┌--------------------┐
       * │        ***         │
       * │        ***         │
       * │        ***         │
       * └--------------------┘
       *
       * Even if we have multiple spaces centered at the parent we're always using multiplier === 2
       * since situation is the same. During the resize counterpart of the space is moving to the same distance.
       *
       * ┌--------------------┐
       * │      ***  ***      │
       * │      ***  ***      │
       * │      ***  ***      │
       * └--------------------┘
       * */
      if (justify === 'center' && parentRect.left !== hostRect.left && parentRect.right !== hostRect.right) {
        horizontalCoefficient = 2;
      }

      if (align === 'center' && parentRect.top !== hostRect.top && parentRect.bottom !== hostRect.bottom) {
        verticalCoefficient = 2;
      }

      /**
       * If parent alignment is space between and current space is stuck to the left or right of the row
       * we're using multiplier === 1 since its counterpart is staying at the same place during the resize.
       *
       * ┌--------------------┐
       * │***              ***│
       * │***              ***│
       * │***              ***│
       * └--------------------┘
       *
       * However, if we're talking about element which is not bound to the left or right side of the parent
       * but centered, we ought to install multiplier === 2 to compensate its counterpart movement.
       *
       * ┌--------------------┐
       * │***     ***      ***│
       * │***     ***      ***│
       * │***     ***      ***│
       * └--------------------┘
       *
       * TODO:
       * this shit works only for the most central element. If we have more than 3 elements at the row
       * and resizing not centered one, we ought to calculate other coefficients.
       * Those coefficients have to be calculated based on the item number from the left.
       * Also, we ought to take into account the position of the element regarding to the most centered element.
       * Coefficients for elements at the left and at the right of the centered element will be different.
       *
       * TODO:
       * Remove multiplication for not centered elements
       *
       * ┌--------------------┐
       * │*   **   **   **   *│
       * │*   **   **   **   *│
       * │*   **   **   **   *│
       * └--------------------┘
       * */
      if (justify === 'space-between' && parentRect.left !== hostRect.left && parentRect.right !== hostRect.right) {
        horizontalCoefficient = 2;
      }

      if (align === 'space-between' && parentRect.top !== hostRect.top && parentRect.bottom !== hostRect.bottom) {
        verticalCoefficient = 2;
      }
    }

    return new Multiplier(horizontalCoefficient, verticalCoefficient);
  }
}
