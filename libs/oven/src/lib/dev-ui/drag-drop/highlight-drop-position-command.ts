import { Injectable } from '@angular/core';

import { VirtualComponent } from '../../model';
import { findNearestComponent, findParentComponent } from './components-util';
import { getParentVirtualComponent, isSpace } from '../util';

export interface HighlightDropPositionCommand {
  vc: VirtualComponent;
  position: 'left' | 'right' | 'top' | 'bottom';
  relativePosition: 'inside' | 'outside';
}

// TODO refactor
@Injectable({ providedIn: 'root' })
export class DropPositionCalculator {
  create(
    el: HTMLElement,
    e: MouseEvent,
    projectComponents: Map<HTMLElement, VirtualComponent>,
    thumbRect: ClientRect
  ): HighlightDropPositionCommand {
    const target: HTMLElement = this.resolveTarget(e, thumbRect, projectComponents);

    // user moved mouse out ouf draggable space or trying to put element inside itself
    if (this.targetIsComponent(el, projectComponents, target)) {
      return null;
    }

    const targetRect: ClientRect = target.getBoundingClientRect();
    const targetComponent: VirtualComponent = projectComponents.get(target);

    return this.createHighlightDropCommand(e, targetRect, targetComponent, target, projectComponents);
  }

  private createHighlightDropCommand(
    e: MouseEvent,
    targetRect: ClientRect,
    targetComponent: VirtualComponent,
    target: HTMLElement,
    projectComponents: Map<HTMLElement, VirtualComponent>
  ): HighlightDropPositionCommand {
    const dropOutsideCommand: HighlightDropPositionCommand = this.createDropOutsideCommand(
      e,
      targetRect,
      targetComponent
    );

    if (dropOutsideCommand) {
      return dropOutsideCommand;
    }

    const dropNearSiblingCommand: HighlightDropPositionCommand = this.createDropNearSiblingCommand(
      target,
      projectComponents,
      e
    );

    if (dropNearSiblingCommand) {
      return dropNearSiblingCommand;
    }

    const dropInsideCommand: HighlightDropPositionCommand = this.createDropInsideCommand(
      targetRect,
      e,
      targetComponent
    );
    if (dropInsideCommand) {
      return dropInsideCommand;
    }
  }

  private targetIsComponent(
    el: HTMLElement,
    projectComponents: Map<HTMLElement, VirtualComponent>,
    target: HTMLElement
  ): boolean {
    return el.contains(target) || !projectComponents.has(target);
  }

  private resolveTarget(
    e: MouseEvent,
    thumbRect: ClientRect,
    projectComponents: Map<HTMLElement, VirtualComponent>
  ): HTMLElement {
    const TARGET_SEARCH_OFFSET = 4;
    const position = document.elementFromPoint(e.clientX, thumbRect.top - TARGET_SEARCH_OFFSET) as HTMLElement;

    return findParentComponent(position, projectComponents, true);
  }

  private createDropOutsideCommand(
    e: MouseEvent,
    rect: ClientRect,
    vc: VirtualComponent
  ): HighlightDropPositionCommand {
    const SELECT_PARENT_GAP = 10;
    const parent = getParentVirtualComponent(vc);

    if (!isSpace(parent)) {
      return;
    }

    const componentForIsColumn = isSpace(vc) ? parent : vc;
    const isColumn = componentForIsColumn.component.styles.xl.direction === 'column';

    if (isColumn) {
      const top = e.pageY - rect.top < SELECT_PARENT_GAP && e.pageY - rect.top > 0;
      const bottom = rect.bottom - e.pageY < SELECT_PARENT_GAP && rect.bottom - e.pageY > 0;

      if (top) {
        return { position: 'top', vc, relativePosition: 'outside' };
      }

      if (bottom) {
        return { position: 'bottom', vc, relativePosition: 'outside' };
      }
    } else {
      const left = e.pageX - rect.left < SELECT_PARENT_GAP && e.pageX - rect.left > 0;
      const right = rect.right - e.pageX < SELECT_PARENT_GAP && rect.right - e.pageX > 0;

      if (left) {
        return { position: 'left', vc, relativePosition: 'outside' };
      }

      if (right) {
        return { position: 'right', vc, relativePosition: 'outside' };
      }
    }
  }

  private createDropNearSiblingCommand(
    target: HTMLElement,
    projectComponents: Map<HTMLElement, VirtualComponent>,
    e: MouseEvent
  ): HighlightDropPositionCommand {
    const component = findNearestComponent(target, projectComponents, e);

    if (!component) {
      return;
    }

    const componentRect: ClientRect = component.getBoundingClientRect();
    const vc = projectComponents.get(component);
    const relativePosition = isSpace(vc) ? 'outside' : 'inside';
    const parent = getParentVirtualComponent(vc);
    const componentForIsColumn = isSpace(vc) ? parent || vc : vc;
    const isColumn = componentForIsColumn.component.styles.xl.direction === 'column';

    if (isColumn) {
      if (componentRect.top + componentRect.height / 2 > e.pageY) {
        return { position: 'top', vc, relativePosition };
      } else {
        return { position: 'bottom', vc, relativePosition };
      }
    } else {
      if (componentRect.left + componentRect.width / 2 > e.pageX) {
        return { position: 'left', vc, relativePosition };
      } else {
        return { position: 'right', vc, relativePosition };
      }
    }
  }

  private createDropInsideCommand(rect: ClientRect, e: MouseEvent, vc: VirtualComponent): HighlightDropPositionCommand {
    const isColumn = vc.component.styles.xl.direction === 'column';

    if (isColumn) {
      if (rect.height / 2 > e.offsetY) {
        return { position: 'top', vc, relativePosition: 'inside' };
      } else {
        return { position: 'bottom', vc, relativePosition: 'inside' };
      }
    } else {
      if (rect.width / 2 > e.offsetX) {
        return { position: 'left', vc, relativePosition: 'inside' };
      } else {
        return { position: 'right', vc, relativePosition: 'inside' };
      }
    }
  }

  private resolveIsColumn(vc: VirtualComponent): boolean {
    const parent: VirtualComponent = getParentVirtualComponent(vc);

    if (isSpace(vc)) {
      return vc.component.styles.xl.direction === 'column';
    } else if (isSpace(parent)) {
      return parent.component.styles.xl.direction === 'column';
    }
  }
}
