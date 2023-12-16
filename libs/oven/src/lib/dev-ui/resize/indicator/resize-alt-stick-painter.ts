import { ComponentRef, ElementRef, Injectable } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayRef } from '@angular/cdk/overlay';
import { RootComponentType } from '@common';
import { NbTooltipComponent } from '@nebular/theme';

import { OverlayService, OverlayZIndex } from '../../overlay-adapter';
import { OverlayPositionBuilderService } from '../../overlay-position';

@Injectable({ providedIn: 'root' })
export class ResizeAltStickPainter {
  private ref: OverlayRef;
  private rootType: RootComponentType;
  private elementRef: ElementRef;

  constructor(private overlay: OverlayService, private overlayPositionBuilder: OverlayPositionBuilderService) {
  }

  init(el: ElementRef, rootType: RootComponentType) {
    this.elementRef = el;
    this.rootType = rootType;
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
      overlayClass: [OverlayZIndex.z1003, 'no-arrow'] as any,
      rootType: this.rootType
    });

    const componentRef: ComponentRef<NbTooltipComponent> = this.ref.attach(new ComponentPortal(NbTooltipComponent));
    componentRef.instance.content = 'Hold Alt (Option) to snap space to other elements on the Working Area.';
    componentRef.instance.context = { status: 'info', icon: { icon: 'info', status: 'info' } };
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
