import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef } from '@angular/core';
import { Subject } from 'rxjs';
import { View } from '../../definitions';
import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { DevUIElementRef } from '../dev-ui-ref';
import { OverlayZIndex } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { BreadcrumbsHoverComponent } from './breadcrumbs-hover.component';


export class BreadcrumbsHoverHighlightElementRef implements DevUIElementRef {
  private destroyed$ = new Subject<void>();
  private ref: OverlayRef;
  private componentRef: ComponentRef<BreadcrumbsHoverComponent>;
  private resizeObserver: ResizeObserver;

  private elWidth: number;
  private elHeight: number;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState,
    private virtualComponent: FlourComponent
  ) {
    this.resizeObserver = new ResizeObserver(() => {
      // Cache element size to not trigger relayout on update
      this.elWidth  = this.el.offsetWidth;
      this.elHeight = this.el.offsetHeight;
      this.update();
    });
    this.show();
    this.resizeObserver.observe(this.el);
  }

  private get el(): HTMLElement {
    if (this.virtualComponent.view) {
      return this.virtualComponent.view.element.nativeElement;
    } else {
      return this.virtualComponent.htmlElement;
    }
  }

  private get attached(): boolean {
    return this.ref && this.ref.hasAttached();
  }

  dispose() {
    this.destroyed$.next();
    if (this.ref) {
      this.ref.dispose();
      this.ref = null;
    }
    this.resizeObserver.disconnect();
  }

  update() {
    if (this.attached) {
      this.updatePositionStrategy();
      this.patchInstanceWithData();
    }
  }

  private show() {
    if (this.attached) {
      return;
    }

    this.ref          = this.createOverlay(this.virtualComponent);
    this.componentRef = this.ref.attach(new ComponentPortal(BreadcrumbsHoverComponent));
    this.disablePointerEvents();
    this.patchInstanceWithData();
  }

  private createOverlay(virtualComponent: FlourComponent) {
    const { htmlElement }  = virtualComponent;
    const positionStrategy = this.createPositionStrategy(htmlElement);

    return this.overlay.create({
      panelClass    : OverlayZIndex.z1002,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private createPositionStrategy(htmlElement: HTMLElement): PositionStrategy {
    return this.overlayPositionBuilder
      .flexibleConnectedTo(htmlElement)
      .withPositions([
        {
          originX : 'start',
          originY : 'top',
          overlayX: 'start',
          overlayY: 'top'
        }
      ]);
  }

  private patchInstanceWithData() {
    this.componentRef.instance.width  = this.elWidth;
    this.componentRef.instance.height = this.elHeight;
    this.componentRef.changeDetectorRef.detectChanges();
  }

  private updatePositionStrategy() {
    const positionStrategy = this.createPositionStrategy(this.virtualComponent.htmlElement);
    this.ref.updatePositionStrategy(positionStrategy);
  }

  private disablePointerEvents() {
    (<any>this.ref)._togglePointerEvents(false);
  }
}
