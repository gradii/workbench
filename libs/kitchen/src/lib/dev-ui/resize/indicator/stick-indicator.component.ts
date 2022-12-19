import { ChangeDetectionStrategy, Component, HostBinding, Input, OnDestroy, ɵdetectChanges } from '@angular/core';

import { Rect } from '../model';

@Component({
  selector: 'kitchen-stick-indicator',
  styleUrls: ['./stick-indicator.component.scss'],
  template: `
    <div></div>
    <span>{{ getContent() }} width</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StickIndicatorComponent implements OnDestroy {
  @HostBinding('class.visible') visible: boolean;

  @Input() hostElement: HTMLElement;
  private prevState = false;
  private hideTimer;
  private _rect: Rect;
  private prevContent: string;

  constructor() {
  }

  @Input() set rect(rect: Rect) {
    this._rect = rect;
    this.scheduleAnimation();
    ɵdetectChanges(this);
  }

  @HostBinding('style.width.px') get width(): number {
    const { width } = this.hostElement.getBoundingClientRect();
    return width;
  }

  getContent(): string {
    if (this.shouldShow()) {
      const content = this._rect.width.auto ? 'auto' : '100%';
      this.prevContent = content;
      return content;
    } else {
      this.visible = false;
      return this.prevContent;
    }
  }

  private shouldShow(): boolean {
    return this._rect.width.auto || (this._rect.width.value === 100 && this._rect.width.unit === '%');
  }

  private scheduleAnimation(): void {
    const show = this.shouldShow();

    if (this.prevState === show) {
      return;
    }

    const hideTimeout = 1000;

    if (!this.prevState) {
      if (show) {
        this.visible = true;
        this.hideTimer = setTimeout(() => {
          this.visible = false;
          ɵdetectChanges(this);
        }, hideTimeout);
      } else {
        this.visible = false;
      }
    }

    this.prevState = show;
  }

  ngOnDestroy(): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
  }
}
