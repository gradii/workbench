import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy } from '@angular/core';

import { Rect } from '../model';

@Component({
  selector: 'oven-stick-indicator',
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

  constructor(private cd: ChangeDetectorRef) {
  }

  @Input() set rect(rect: Rect) {
    this._rect = rect;
    this.scheduleAnimation();
    this.cd.detectChanges();
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
          this.cd.detectChanges();
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
