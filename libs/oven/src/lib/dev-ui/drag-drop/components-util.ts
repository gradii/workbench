import { VirtualComponent } from '../../model';
import { distanceBetweenPoints, Point, rectanglePeakPoints } from './math-util';
import { isSpace } from '../util';

export function findParentComponent(
  el: HTMLElement,
  projectComponents: Map<HTMLElement, VirtualComponent>,
  includeSpace: boolean,
  iteration: number = 0
): HTMLElement {
  const maxSearchDepth = 10;

  // Can't find parent component for that html element
  // Returning null to not enter infinite recursion
  if (iteration >= maxSearchDepth) {
    return null;
  }

  // User moved mouse out of the draggable field on the previous find iteration
  if (el === null) {
    return null;
  }

  if (projectComponents.has(el)) {
    // If we need to count space in current iteration then we don't need to check is it a space
    if (includeSpace) {
      return el;
    }

    if (!isSpace(projectComponents.get(el))) {
      return el;
    }
  }

  return findParentComponent(el.parentElement, projectComponents, includeSpace, iteration + 1);
}

interface CompPeakPoints {
  vc: VirtualComponent;
  peakPoints: Point[];
}

interface CompDistance {
  vc: VirtualComponent;
  nearestDistance: number;
}

// searches in four directions and figure out the nearest component on the surface
// with the priority to the horizontally aligned components
export function findNearestComponent(
  spaceEl: HTMLElement,
  projectComponents: Map<HTMLElement, VirtualComponent>,
  e: MouseEvent
): HTMLElement {
  // find all direct space children
  const siblingComponents: VirtualComponent[] = [];
  for (let i = 0; i < spaceEl.children.length; i++) {
    const el: HTMLElement = spaceEl.children[i] as HTMLElement;
    if (projectComponents.has(el)) {
      siblingComponents.push(projectComponents.get(el));
    }
  }

  // Using page relative coordinates to have the ability to use client rects for calculations
  const ePoint: Point = { x: e.pageX, y: e.pageY };

  // component peak points mapping
  const siblingsPeakPoints: CompPeakPoints[] = siblingComponents.map((vc: VirtualComponent) => {
    const el: HTMLElement = vc.view.element.nativeElement;
    const rect = el.getBoundingClientRect();
    return { vc, peakPoints: rectanglePeakPoints(rect) };
  });

  // mapping component to its nearest to event peak point
  const distanceToSiblingsNearestPeakPoints: CompDistance[] = siblingsPeakPoints.map(
    ({ vc, peakPoints }: CompPeakPoints) => {
      const distances: number[] = peakPoints.map((peakPoint: Point) => distanceBetweenPoints(peakPoint, ePoint));
      return { vc, nearestDistance: Math.min(...distances) };
    }
  );

  // if no nearestComponent -> space is empty
  if (distanceToSiblingsNearestPeakPoints.length === 0) {
    return null;
  }

  const nearestComponent: CompDistance = distanceToSiblingsNearestPeakPoints.reduce(
    (prevCompDistance: CompDistance, nextCompDistance: CompDistance) => {
      if (nextCompDistance.nearestDistance < prevCompDistance.nearestDistance) {
        return nextCompDistance;
      }
      return prevCompDistance;
    }
  );

  return nearestComponent.vc.view.element.nativeElement;
}
