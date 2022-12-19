import { Inject, Injectable } from '@angular/core';
import { RootComponentType } from '@common/public-api';
import { DOCUMENT } from '@angular/common';
import { KitchenOverlayContainer } from '../overlay-container';

import { Ruler, Rulers } from './model';
import { CollisionPosition } from './resize-strategy/collision-detector';

interface RulerCtx {
  left: number;
  top: number;
  height: string;
  width: string;
}

/**
 * This implementation of the ruler painter uses document.createElement directly to create and position rulers
 * instead of using overlays since code is easier to read and maintain.
 * */
@Injectable(/*{ providedIn: 'root' }*/)
export class RulerPainter {
  private points = [];
  private document: Document;

  constructor(@Inject(DOCUMENT) document, private overlayContainer: KitchenOverlayContainer) {
    this.document = document;
  }

  redrawRulers(rulers: Rulers) {
    this.clearPoints();

    const { horizontal, vertical } = rulers;

    if (horizontal) {
      this.drawHorizontalRuler(horizontal);
    }

    if (vertical) {
      this.drawVerticalRuler(vertical);
    }
  }

  clearPoints() {
    for (const point of this.points) {
      this.overlayContainer.getContainerElement(RootComponentType.Header).removeChild(point);
    }
    this.points = [];
  }

  private drawHorizontalRuler(ruler: Ruler) {
    const offset = this.calcHorizontalOffset(ruler);
    this.drawRuler({
      left: 0,
      top: ruler.coordinate + offset,
      width: '100vw',
      height: '1px'
    });
  }

  private drawVerticalRuler(ruler: Ruler) {
    const offset = this.calcVerticalOffset(ruler);
    this.drawRuler({
      left: ruler.coordinate + offset,
      top: 0,
      width: '1px',
      height: '100vh'
    });
  }

  private drawRuler(ctx: RulerCtx) {
    const { left, top, width, height } = ctx;
    const ruler = this.document.createElement('div');
    ruler.style.backgroundColor = '#1e89ef';
    ruler.style.position = 'absolute';
    ruler.style.zIndex = '1002';
    ruler.style.left = `${left}px`;
    ruler.style.top = `${top}px`;
    ruler.style.width = width;
    ruler.style.height = height;
    this.persistRuler(ruler);
  }

  private persistRuler(ruler: HTMLElement) {
    // Put rulers in header since we need to put them above all the content
    this.overlayContainer.getContainerElement(RootComponentType.Header).appendChild(ruler);
    this.points.push(ruler);
  }

  private calcHorizontalOffset(ruler: Ruler): number {
    return ruler.collisionPosition === CollisionPosition.TOP ? 1 : 0;
  }

  private calcVerticalOffset(ruler: Ruler): number {
    return ruler.collisionPosition === CollisionPosition.LEFT ? 1 : 0;
  }
}
