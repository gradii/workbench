import { Injectable, OnDestroy } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { TourProgressControlComponent } from './tour-progress-control.component';

@Injectable()
export class TourProgressService implements OnDestroy {
  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay, private overlayPositionBuilder: OverlayPositionBuilder) {
  }

  ngOnDestroy(): void {
    this.overlayRef.dispose();
  }

  show(): void {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlayPositionBuilder.global().bottom('0').centerHorizontally()
    });
    this.overlayRef.attach(new ComponentPortal(TourProgressControlComponent));
  }

  hide(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
