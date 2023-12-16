import { ComponentRef, Injectable } from '@angular/core';
import { NbComponentPortal } from '@nebular/theme';
import { OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { filter, map, pairwise, startWith, tap } from 'rxjs/operators';
import ResizeObserver from 'resize-observer-polyfill';

import { VirtualComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { DevUIElementRef } from '../dev-ui-ref';
import { OverlayService, OverlayZIndex } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { View } from '../../definitions';
import { BreadcrumbsHoverComponent } from './breadcrumbs-hover.component';

class BreadcrumbsHoverHighlightElementRef implements DevUIElementRef {
  private destroyed$ = new Subject();
  private ref: OverlayRef;
  private componentRef: ComponentRef<BreadcrumbsHoverComponent>;
  private resizeObserver: ResizeObserver;

  private elWidth: number;
  private elHeight: number;

  constructor(
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState,
    private virtualComponent: VirtualComponent
  ) {
    this.resizeObserver = new ResizeObserver(() => {
      // Cache element size to not trigger relayout on update
      this.elWidth = this.el.offsetWidth;
      this.elHeight = this.el.offsetHeight;
      this.update();
    });
    this.show();
    this.resizeObserver.observe(this.el);
  }

  private get el(): HTMLElement {
    return this.virtualComponent.view.element.nativeElement;
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

    this.ref = this.createOverlay(this.virtualComponent);
    this.componentRef = this.ref.attach(new NbComponentPortal(BreadcrumbsHoverComponent));
    this.disablePointerEvents();
    this.patchInstanceWithData();
  }

  private createOverlay(virtualComponent: VirtualComponent) {
    const { view } = virtualComponent;
    const positionStrategy = this.createPositionStrategy(view);

    return this.overlay.create({
      rootType: virtualComponent.rootType,
      overlayClass: OverlayZIndex.z1002,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private createPositionStrategy<T>(view: View<T>): PositionStrategy {
    return this.overlayPositionBuilder.flexibleConnectedTo(view.element).withPositions([
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top'
      }
    ]);
  }

  private patchInstanceWithData() {
    this.componentRef.instance.width = this.elWidth;
    this.componentRef.instance.height = this.elHeight;
    this.componentRef.changeDetectorRef.detectChanges();
  }

  private updatePositionStrategy() {
    const positionStrategy = this.createPositionStrategy(this.virtualComponent.view);
    this.ref.updatePositionStrategy(positionStrategy);
  }

  private disablePointerEvents() {
    (<any>this.ref)._togglePointerEvents(false);
  }
}

@Injectable()
export class BreadcrumbsHoverService {
  constructor(
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState
  ) {
  }

  attach(): void {
    this.state.breadcrumbsHighlightedComponent$
      .pipe(
        map((virtualComponent: VirtualComponent) => this.createDevUI(virtualComponent)),
        startWith(null),
        pairwise(),
        map(([prev]: [DevUIElementRef, DevUIElementRef]) => prev),
        filter((ref: DevUIElementRef) => !!ref),
        tap((ref: DevUIElementRef) => ref.dispose())
      )
      .subscribe();
  }

  private createDevUI(virtualComponent: VirtualComponent): DevUIElementRef {
    if (!virtualComponent) {
      return;
    }

    return new BreadcrumbsHoverHighlightElementRef(
      this.overlay,
      this.overlayPositionBuilder,
      this.state,
      virtualComponent
    );
  }
}
