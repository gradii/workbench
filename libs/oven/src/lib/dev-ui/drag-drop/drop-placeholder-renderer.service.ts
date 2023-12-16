import { ComponentRef, Injectable } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { NbConnectedPosition } from '@nebular/theme';

import { OverlayPositionBuilderService } from '../overlay-position';
import { OverlayService, OverlayZIndex } from '../overlay-adapter';
import { DropPlaceholderComponent } from './drop-placeholder.component';
import { HighlightDropPositionCommand } from './highlight-drop-position-command';
import { getAsElement } from '../util';
import { RootComponentType } from '@common';

@Injectable({ providedIn: 'root' })
export class DropPlaceholderRendererFactoryService {
  constructor(private positionBuilder: OverlayPositionBuilderService, private overlay: OverlayService) {
  }

  create(): DropPlaceholderRenderer {
    return new DropPlaceholderRenderer(this.positionBuilder, this.overlay);
  }
}

export class DropPlaceholderRenderer {
  private overlayRef: OverlayRef;
  private prevRootType: RootComponentType;

  constructor(private positionBuilder: OverlayPositionBuilderService, private overlay: OverlayService) {
  }

  draw(command: HighlightDropPositionCommand) {
    const positionStrategy = this.createPlaceholderPositionStrategy(command);

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

    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }

    this.drawPlaceholder(command);
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

  private createPlaceholderPositionStrategy(command: HighlightDropPositionCommand): PositionStrategy {
    const el = getAsElement(command.vc);
    return this.positionBuilder
      .flexibleConnectedTo(el)
      .withFlexibleDimensions(true)
      .withPush(false)
      .withPositions([this.resolvePosition(command)]);
  }

  private resolvePosition(command: HighlightDropPositionCommand): NbConnectedPosition {
    if (command.position === 'left') {
      return {
        originX: 'start',
        originY: 'center',
        overlayX: 'center',
        overlayY: 'center'
      };
    }

    if (command.position === 'right') {
      return {
        originX: 'end',
        originY: 'center',
        overlayX: 'center',
        overlayY: 'center'
      };
    }

    if (command.position === 'top') {
      return {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'center'
      };
    }

    if (command.position === 'bottom') {
      return {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'center'
      };
    }
  }

  private drawPlaceholder(command: HighlightDropPositionCommand) {
    const compRef: ComponentRef<DropPlaceholderComponent> = this.overlayRef.attach(
      new ComponentPortal(DropPlaceholderComponent)
    );
    if (command.position === 'left' || command.position === 'right') {
      compRef.instance.height = command.vc.view.element.nativeElement.offsetHeight;
      compRef.instance.width = 4;
    } else {
      compRef.instance.height = 4;
      compRef.instance.width = command.vc.view.element.nativeElement.offsetWidth;
    }
    compRef.changeDetectorRef.detectChanges();
  }
}
