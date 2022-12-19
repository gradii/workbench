import { Inject, Injectable } from '@angular/core';

import { Point, ResizeContext, VIRTUAL_COMPONENT } from '../model';
import { getAsBoundingClientRect } from '../../util';
import { FlourComponent } from '../../../model';

/**
 * Resolves the context of the resize operations.
 * Context contains all the data which will be required during resize but might be calculated
 * before resizing.
 * */
@Injectable()
export class ResizeContextResolver {
  private vc: FlourComponent;

  constructor(@Inject(VIRTUAL_COMPONENT) virtualComponent) {
    this.vc = virtualComponent;
  }

  resolveContext(event: MouseEvent): ResizeContext {
    const el = event.target as HTMLElement;
    const parentComp = this.vc.parentComponent;
    const parentEl: HTMLElement = parentComp.view.element.nativeElement;
    const parentRect = parentEl.getBoundingClientRect();

    const hostRect: ClientRect = getAsBoundingClientRect(this.vc);

    // Defines the position of the left top corner of the handle element
    const box = el.getBoundingClientRect();
    const handle: Point = { x: box.left, y: box.top };
    const handleSize = Math.min(box.width, box.height);
    const handleFix = handleSize / 2;

    const startCursorPosition: Point = { x: event.pageX, y: event.pageY };

    return {
      hostRect,
      parentRect,
      startCursorPosition,
      startHandleCenter: {
        x: handle.x + handleFix,
        y: handle.y + handleFix
      }
    };
  }
}
