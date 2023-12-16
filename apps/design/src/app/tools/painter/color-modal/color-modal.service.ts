import { Overlay, OverlayPositionBuilder, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ColorChange } from '@tools-state/theme/theme.models';
import { ColorModalComponent } from './color-modal.component';

@Injectable()
export class ColorModalService implements OnDestroy {
  private overlayRef: OverlayRef;
  private destroyed: Subject<void> = new Subject<void>();

  constructor(private overlay: Overlay, private overlayPositionBuilder: OverlayPositionBuilder) {
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  show(
    el: ElementRef,
    startColor: string,
    includeLogo: boolean
  ): { submit: EventEmitter<ColorChange>; cancel: EventEmitter<void> } {
    this.overlayRef = this.createOverlay(el);
    const componentRef = this.overlayRef.attach(new ComponentPortal(ColorModalComponent));
    componentRef.instance.color = startColor;
    componentRef.instance.includeLogo = includeLogo;
    componentRef.changeDetectorRef.detectChanges();

    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this.hide());

    componentRef.instance.cancel.pipe(takeUntil(this.destroyed)).subscribe(() => this.hide());

    componentRef.instance.submit.pipe(takeUntil(this.destroyed)).subscribe(() => this.hide());

    return { submit: componentRef.instance.submit, cancel: componentRef.instance.cancel };
  }

  hide() {
    if (!this.overlayRef) {
      return;
    }
    this.overlayRef.dispose();
  }

  private createOverlay(el: ElementRef): OverlayRef {
    const positionStrategy = this.createPositionStrategy(el);
    return this.overlay.create({
      backdropClass: 'transparent-backdrop',
      hasBackdrop: true,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private createPositionStrategy<T>(el: ElementRef): PositionStrategy {
    return this.overlayPositionBuilder.flexibleConnectedTo(el).withPositions([
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'top'
      }
    ]);
  }
}
