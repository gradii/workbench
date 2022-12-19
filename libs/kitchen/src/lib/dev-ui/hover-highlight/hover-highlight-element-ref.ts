import { Overlay, OverlayRef, PositionStrategy, ScrollDispatcher } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { DevUIElementRef } from '../dev-ui-ref';
import { OverlayZIndex } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { HoverHighlightComponent } from './hover-highlight.component';


export class HoverHighlightElementRef implements DevUIElementRef {
  private destroy$ = new Subject<void>();
  private ref: OverlayRef;
  private componentRef: ComponentRef<HoverHighlightComponent>;

  private get el(): HTMLElement {
    return this.virtualComponent.htmlElement;
  }

  public get overlayHostElement(): HTMLElement {
    return this.ref.hostElement;
  }

  constructor(
    private overlay: Overlay,
    private _scrollDispatcher: ScrollDispatcher,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private renderState: RenderState,
    private virtualComponent: FlourComponent
  ) {
    this.show();
  }

  dispose() {
    this.destroy$.next();
    if (this.ref) {
      this.ref.dispose();
    }
  }

  update() {
    if (!this.ref || !this.ref.hasAttached()) {
      return;
    }

    this.ref.updatePosition();
  }

  private show() {
    this.ref          = this.createOverlay(this.virtualComponent);
    this.componentRef = this.ref.attach(new ComponentPortal(HoverHighlightComponent));
    this.disablePointerEvents();
    this.patchInstanceWithData();
    this.ref.updatePosition();

    // this.renderState.containerClipPath$.pipe(
    //   take(1),
    //   takeUntil(this.destroy$)
    // ).subscribe(clipPath => {
    //   this.ref.hostElement.style.clipPath = clipPath;
    // });
    // this.ref.hostElement.style.clipPath = 'inset(67px 300px 0px 223.6px)';
  }

  private createOverlay(flourComponent: FlourComponent) {
    const { htmlElement }  = flourComponent;
    const positionStrategy = this.createPositionStrategy(htmlElement);

    return this.overlay.create({
      positionStrategy,
      panelClass    : OverlayZIndex.z1001,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private createPositionStrategy(htmlElement: HTMLElement): PositionStrategy {
    const scrollableAncestors =
            this._scrollDispatcher.getAncestorScrollContainers(this.el);

    return this.overlayPositionBuilder
      .flexibleConnectedTo(htmlElement)
      .withPositions([
        {
          originX : 'start',
          originY : 'top',
          overlayX: 'start',
          overlayY: 'top'
        }
      ])
      .withScrollableContainers(scrollableAncestors);
  }

  private patchInstanceWithData() {
    this.componentRef.instance.width          = this.el.offsetWidth;
    this.componentRef.instance.height         = this.el.offsetHeight;
    this.componentRef.instance.flourComponent = this.virtualComponent;
    this.componentRef.changeDetectorRef.detectChanges();
  }

  private disablePointerEvents() {
    (<any>this.ref)._togglePointerEvents(false);
  }
}
