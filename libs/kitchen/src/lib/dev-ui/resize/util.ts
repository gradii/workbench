import { BreakpointWidth } from '@common/public-api';

import { FlourComponent } from '../../model';
import { getAsBoundingClientRect, getAsStyles, getParentVirtualComponent } from '../util';
import { Size } from './model';

export function reverseResize(virtualComponent: FlourComponent): boolean {
  return (
    inFlexEndParent(virtualComponent) ||
    mostRightInSpaceBetweenParent(virtualComponent) ||
    mostRightInSpaceAroundParent(virtualComponent)
  );
}

export function exceededHorizontalThreshold(prevHostRect: ClientRect, hostSize: Size, rightThreshold: number): boolean {
  return prevHostRect.left + hostSize.width > rightThreshold;
}

export function exceededVerticalThreshold(prevHostRect: ClientRect, hostSize: Size, bottomThreshold: number): boolean {
  return prevHostRect.top + hostSize.height > bottomThreshold;
}

function inFlexEndParent(virtualComponent: FlourComponent): boolean {
  const parent: FlourComponent = getParentVirtualComponent(virtualComponent);
  const { align, justify, direction } = getAsStyles(parent)[BreakpointWidth.Desktop];

  return (direction === 'row' && justify === 'flex-end') || (direction === 'column' && align === 'flex-end');
}

function mostRightInSpaceBetweenParent(virtualComponent: FlourComponent): boolean {
  const parent: FlourComponent = getParentVirtualComponent(virtualComponent);
  const { justify } = getAsStyles(parent)[BreakpointWidth.Desktop];

  const parentRect: ClientRect = getAsBoundingClientRect(parent);
  const rect: ClientRect = getAsBoundingClientRect(virtualComponent);

  const rightPadding = parentRect.right - rect.right;
  const leftPadding = rect.left - parentRect.left;

  return justify === 'space-between' && rightPadding < leftPadding;
}

function mostRightInSpaceAroundParent(virtualComponent: FlourComponent): boolean {
  const parent: FlourComponent = getParentVirtualComponent(virtualComponent);
  const { justify } = getAsStyles(parent)[BreakpointWidth.Desktop];

  const parentRect: ClientRect = getAsBoundingClientRect(parent);
  const rect: ClientRect = getAsBoundingClientRect(virtualComponent);

  const rightPadding = parentRect.right - rect.right;
  const leftPadding = rect.left - parentRect.left;

  return justify === 'space-around' && rightPadding < leftPadding;
}
