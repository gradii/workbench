import { ComponentRef, Injectable } from '@angular/core';
import { OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { OverlayPositionBuilderService } from '../overlay-position';
import { OverlayService, OverlayZIndex } from '../overlay-adapter';
import { HighlightDropPositionCommand } from './highlight-drop-position-command';
import { VirtualComponent } from '../../model';
import { DropContainerHighlightComponent } from './drop-container-highlight.component';
import { getAsBoundingClientRect, getAsElement, getParentVirtualComponent, isSpace } from '../util';
import { RootComponentType } from '@common';

@Injectable({ providedIn: 'root' })
export class DropContainerHighlightRendererFactoryService {
  constructor(private positionBuilder: OverlayPositionBuilderService, private overlay: OverlayService) {
  }

  create(): DropContainerHighlightRenderer {
    return new DropContainerHighlightRenderer(this.positionBuilder, this.overlay);
  }
}

export class DropContainerHighlightRenderer {
  private overlayRef: OverlayRef;
  private prevRootType: RootComponentType;

  constructor(private positionBuilder: OverlayPositionBuilderService, private overlay: OverlayService) {
  }

  draw(command: HighlightDropPositionCommand) {
    const componentToHighlight: VirtualComponent = this.resolveContainerToHighlight(command);
    const positionStrategy = this.createContainerPositionStrategy(componentToHighlight);

    if (!this.overlayRef || this.prevRootType !== command.vc.rootType) {
      if (this.overlayRef) {
        this.overlayRef.dispose();
      }
      this.overlayRef = this.overlay.create({
        overlayClass: OverlayZIndex.z1005,
        rootType: command.vc.rootType,
        positionStrategy
      });
    } else {
      this.overlayRef.updatePositionStrategy(positionStrategy);
    }

    this.prevRootType = command.vc.rootType;

    this.clear();
    this.drawContainerHighlight(componentToHighlight);
  }

  clear() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  dispose() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  private createContainerPositionStrategy(virtualComponent: VirtualComponent): PositionStrategy {
    const el = getAsElement(virtualComponent);
    return this.positionBuilder
      .flexibleConnectedTo(el)
      .withFlexibleDimensions(true)
      .withPush(false)
      .withPositions([{ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' }]);
  }

  private drawContainerHighlight(virtualComponent: VirtualComponent) {
    const compRef: ComponentRef<DropContainerHighlightComponent> = this.overlayRef.attach(
      new ComponentPortal(DropContainerHighlightComponent)
    );

    (this.overlayRef as any)._togglePointerEvents(false);

    const { width, height } = getAsBoundingClientRect(virtualComponent);

    compRef.instance.height = height;
    compRef.instance.width = width;

    compRef.changeDetectorRef.detectChanges();
  }

  private resolveContainerToHighlight(command: HighlightDropPositionCommand): VirtualComponent {
    if (command.relativePosition === 'inside' && isSpace(command.vc)) {
      return command.vc;
    }

    const parent = getParentVirtualComponent(command.vc);

    return parent || command.vc;
  }
}
