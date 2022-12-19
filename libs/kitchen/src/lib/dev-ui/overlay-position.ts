import {
  FlexibleConnectedPositionStrategy, OverlayContainer, OverlayPositionBuilder, ViewportRuler
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ElementRef, Inject, Injectable } from '@angular/core';

@Injectable()
export class OverlayPositionBuilderService extends OverlayPositionBuilder {
  constructor(
    @Inject(DOCUMENT) protected document,
    private overlayContainer: OverlayContainer,
    private platform: Platform,
    private viewportRuler: ViewportRuler
  ) {
    super(document, viewportRuler, platform, overlayContainer);
  }

  flexibleConnectedTo(connectedTo: ElementRef | HTMLElement): FlexibleConnectedPositionStrategy {
    return new FlexibleConnectedPositionStrategy(
      connectedTo,
      this.viewportRuler,
      this.document,
      this.platform,
      this.overlayContainer
    )
      .withFlexibleDimensions(false)
      .withPush(false);
  }
}
