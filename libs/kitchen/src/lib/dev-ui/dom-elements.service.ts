import { Injectable } from '@angular/core';
import { FlourComponent } from '../model';
import { getAsBoundingClientRect } from './util';

@Injectable(/*{ providedIn: 'root' }*/)
export class DOMElementsService {
  private window: Window
  constructor() {
    this.window = window;
  }

  public inViewport(virtualComponent: FlourComponent): boolean {
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

  public outViewport(virtualComponent: FlourComponent | FlourComponent): boolean {
    const { top, left, bottom, right } = getAsBoundingClientRect(virtualComponent);
    const {
      height: documentHeight,
      width: documentWidth
    } = this.window.document.documentElement.getBoundingClientRect();
    return bottom <= 0 || top >= documentHeight || right <= 0 || left >= documentWidth;
  }
}
