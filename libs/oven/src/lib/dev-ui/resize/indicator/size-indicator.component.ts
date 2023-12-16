import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input } from '@angular/core';

import { Rect } from '../model';
import { stickAnimation } from './size-indicator.animation';

@Component({
  selector: 'oven-size-indicator',
  styleUrls: ['./size-indicator.component.scss'],
  template: `
    <ng-container *ngIf="rect.width.auto">auto</ng-container>
    <ng-container *ngIf="!rect.width.auto">{{ width }}</ng-container>
    x
    <ng-container *ngIf="rect.height.auto">auto</ng-container>
    <ng-container *ngIf="!rect.height.auto">{{ height }}</ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [stickAnimation]
})
export class SizeIndicatorComponent {
  @Input() set rect(rect: Rect) {
    this._rect = rect;
    this.cd.detectChanges();
  }

  get rect(): Rect {
    return this._rect;
  }

  private _rect: Rect;

  constructor(private cd: ChangeDetectorRef) {
  }

  @HostBinding('@stickAnimation') get stickAnimation() {
    const width = this.rect.width;

    if (width.auto || (width.value === 100 && width.unit === '%')) {
      return 'animate';
    }

    return '';
  }

  get width(): string {
    const { value, unit } = this.rect.width;
    return Math.round(value) + unit;
  }

  get height(): string {
    const { value, unit } = this.rect.height;
    return Math.round(value) + unit;
  }
}
