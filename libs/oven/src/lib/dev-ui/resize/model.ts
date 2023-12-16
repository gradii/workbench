import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { CollisionPosition } from './resize-strategy/collision-detector';
import { VirtualComponent } from '../../model';
import { ResizeDimension } from './resize-strategy/mousedown-provider';

export const VIRTUAL_COMPONENT = new InjectionToken<VirtualComponent>('Virtual Component');
export const ATTACHED_COMPONENTS$ = new InjectionToken<Observable<VirtualComponent[]>>('Attached Components');

export interface Dimension {
  value?: number;
  unit?: '%' | 'px';
  auto?: boolean;
}

export interface Rect {
  width: Dimension;
  height: Dimension;
  dimension?: ResizeDimension;
}

export function noopRect(): Rect {
  return { width: { value: 0, unit: 'px' }, height: { value: 0, unit: 'px' } };
}

export interface Ruler {
  collisionPosition: CollisionPosition;
  coordinate: number;
}

export interface Rulers {
  horizontal: Ruler;
  vertical: Ruler;
}

export function noopRulers(): Rulers {
  return { horizontal: null, vertical: null };
}

export interface Point {
  x: number;
  y: number;
}

export class Multiplier {
  constructor(public horizontal: number = 1, public vertical: number = 1) {
  }
}

export interface ResizeContext {
  hostRect: ClientRect;
  startCursorPosition: Point;
  parentRect: ClientRect;
  startHandleCenter: Point;
}

export interface Size {
  width: number;
  height: number;
}
