import { ElementRef, Inject, Injectable } from '@angular/core';
import {
  NB_DOCUMENT,
  NbAdjustableConnectedPositionStrategy,
  NbOverlayContainerAdapter,
  NbOverlayPositionBuilder,
  NbPlatform,
  NbPosition,
  NbPositionBuilderService,
  NbViewportRulerAdapter
} from '@nebular/theme';

const POSITIONS = [
  NbPosition.TOP,
  NbPosition.END,
  NbPosition.BOTTOM,
  NbPosition.START,
  NbPosition.TOP_START,
  NbPosition.TOP_END,
  NbPosition.END_TOP,
  NbPosition.END_BOTTOM,
  NbPosition.BOTTOM_END,
  NbPosition.BOTTOM_START,
  NbPosition.START_BOTTOM,
  NbPosition.START_TOP
];

export class AdjustableConnectedPositionStrategy extends NbAdjustableConnectedPositionStrategy {
  protected createPositions(): NbPosition[] {
    return this.reorderPreferredPositions(POSITIONS);
  }
}

@Injectable()
export class PositionBuilderService extends NbPositionBuilderService {
  constructor(
    @Inject(NB_DOCUMENT) protected document,
    protected viewportRuler: NbViewportRulerAdapter,
    protected platform: NbPlatform,
    protected positionBuilder: NbOverlayPositionBuilder,
    protected overlayContainer: NbOverlayContainerAdapter
  ) {
    super(document, viewportRuler, platform, positionBuilder, overlayContainer);
  }

  connectedTo(elementRef: ElementRef): NbAdjustableConnectedPositionStrategy {
    return new AdjustableConnectedPositionStrategy(
      elementRef,
      this.viewportRuler,
      this.document,
      this.platform,
      this.overlayContainer
    )
      .withFlexibleDimensions(false)
      .withPush(false);
  }
}
