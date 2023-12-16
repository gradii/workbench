import { ComponentFactoryResolver, Injectable, NgZone } from '@angular/core';
import { RootComponentType } from '@common';
import { NbDynamicOverlay, NbOverlayRef, NbOverlayService } from '@nebular/theme';

import { OverlayConfig, OverlayService, OverlayZIndex } from '../overlay-adapter';
import { OvenOverlayContainer } from '../overlay-container';

@Injectable()
export class CalculatorOverlayService extends OverlayService {
  create(config?: OverlayConfig): NbOverlayRef {
    return super.create({ ...config, overlayClass: OverlayZIndex.z1003, rootType: RootComponentType.Header });
  }
}

@Injectable()
export class CalculatorDynamicOverlay extends NbDynamicOverlay {
  constructor(
    overlay: NbOverlayService,
    componentFactoryResolver: ComponentFactoryResolver,
    zone: NgZone,
    overlayContainer: OvenOverlayContainer
  ) {
    super(overlay, componentFactoryResolver, zone, overlayContainer as any);
  }

  protected hasOverlayInContainer(): boolean {
    return ((this.overlayContainer as unknown) as OvenOverlayContainer)
      .getContainerElement(RootComponentType.Header)
      .contains(this.ref.hostElement);
  }
}
