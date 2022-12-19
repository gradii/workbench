import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, ElementRef, Injectable } from '@angular/core';
import { RootComponentType } from '@common/public-api';
import { TooltipComponent } from '@gradii/triangle/tooltip';

import { OverlayZIndex } from '../../overlay-adapter';
import { OverlayPositionBuilderService } from '../../overlay-position';

@Injectable(/*{ providedIn: 'root' }*/)
export class ResizeAltStickPainter {
  private ref: OverlayRef;
  private rootType: RootComponentType;
  private elementRef: ElementRef;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilderService) {
  }

  init(el: ElementRef, rootType: RootComponentType) {
    this.elementRef = el;
    this.rootType   = rootType;
  }

  show() {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{ originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'top' }])
      .withDefaultOffsetX(6)
      .withDefaultOffsetY(26)
      .withViewportMargin(16)
      .withLockedPosition(false)
      .withPush(true);

    this.ref = this.overlay.create({
      positionStrategy,
      panelClass: [OverlayZIndex.z1003, 'no-arrow'] as any,
    });

    const componentRef: ComponentRef<TooltipComponent> = this.ref.attach(new ComponentPortal(TooltipComponent));
    componentRef.instance.content                      = 'Hold Alt (Option) to snap space to other elements on the Working Area.';
    componentRef.instance.tooltipContext               = { status: 'info', icon: { icon: 'info', status: 'info' } };
    componentRef.changeDetectorRef.detectChanges();
  }

  hide() {
    if (this.ref && this.ref.hasAttached()) {
      this.ref.dispose();
    }
  }

  update() {
    if (this.ref && this.ref.hasAttached()) {
      this.ref.updatePosition();
    }
  }
}
