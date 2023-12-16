import { Inject, Injectable } from '@angular/core';
import { VirtualComponent } from '../model';
import { getAsBoundingClientRect } from './util';
import { NB_WINDOW } from '@nebular/theme';

@Injectable({ providedIn: 'root' })
export class DOMElementsService {
  constructor(@Inject(NB_WINDOW) private window) {
  }

  public inViewport(virtualComponent: VirtualComponent): boolean {
    const threshold = 8;
    const bounding = getAsBoundingClientRect(virtualComponent);
    const { documentElement } = this.window.document;
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom - threshold <= (this.window.innerHeight || documentElement.clientHeight) &&
      bounding.right - threshold <= (this.window.innerWidth || documentElement.clientWidth)
    );
  }

  public outViewport(virtualComponent: VirtualComponent): boolean {
    const { top, left, bottom, right } = getAsBoundingClientRect(virtualComponent);
    const {
      height: documentHeight,
      width: documentWidth
    } = this.window.document.documentElement.getBoundingClientRect();
    return bottom <= 0 || top >= documentHeight || right <= 0 || left >= documentWidth;
  }
}
