import { ComponentRef, Injectable } from '@angular/core';
import { OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { NbComponentPortal } from '@nebular/theme';
import ResizeObserver from 'resize-observer-polyfill';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VirtualComponent } from '../../model';
import { LayoutHelper } from '../../util/layout-helper.service';
import { OverlayService } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { View } from '../../definitions';
import { ComponentSelectorComponent } from './component-selector.component';
import { DevUIElementRef } from '../dev-ui-ref';
import { RenderState } from '../../state/render-state.service';
import { isSpace } from '../util';
import { ComponentSpecificDevUI } from '../component-specific-dev-ui';

class ComponentSelectorElementRef implements DevUIElementRef {
  private ref: OverlayRef;
  private destroy$ = new Subject();
  private resizeObserver: ResizeObserver;

  constructor(
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState,
    private layoutHelper: LayoutHelper,
    private virtualComponent: VirtualComponent
  ) {
    this.show();
    this.resizeObserver = new ResizeObserver(() => this.update());
    this.resizeObserver.observe(this.virtualComponent.view.element.nativeElement);
    this.layoutHelper.layoutChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => this.update());
  }

  dispose() {
    this.hide();
    this.destroy$.next();
    this.resizeObserver.disconnect();
  }

  update() {
    if (!this.ref || !this.ref.hasAttached()) {
      return;
    }

    this.ref.updatePosition();
  }

  private show() {
    this.ref = this.createOverlay(this.virtualComponent);
    const componentRef = this.ref.attach(new NbComponentPortal(ComponentSelectorComponent));

    this.patchInstanceWithData(componentRef, this.virtualComponent);
  }

  private hide() {
    if (!this.ref) {
      return;
    }
    this.ref.dispose();
  }

  private createOverlay(virtualComponent: VirtualComponent) {
    const { view } = virtualComponent;
    const positionStrategy = this.createPositionStrategy(view);
    const ref = this.overlay.create({
      rootType: virtualComponent.rootType,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });

    this.disablePointerEvents(ref);

    return ref;
  }

  private createPositionStrategy<T>(view: View<T>): PositionStrategy {
    return this.overlayPositionBuilder.flexibleConnectedTo(view.element).withPositions([
      {
        originX: 'center',
        originY: 'center',
        overlayX: 'center',
        overlayY: 'center'
      }
    ]);
  }

  private patchInstanceWithData(ref: ComponentRef<ComponentSelectorComponent>, virtualComponent: VirtualComponent) {
    ref.instance.virtualComponent = virtualComponent;
    ref.changeDetectorRef.detectChanges();
  }

  private disablePointerEvents(ref: any) {
    ref._togglePointerEvents(false);
  }
}

@Injectable()
export class ComponentSelectorService {
  constructor(
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private layoutHelper: LayoutHelper,
    private componentSpecificDevUI: ComponentSpecificDevUI,
    private state: RenderState
  ) {
  }

  attach(): void {
    this.componentSpecificDevUI.create((virtualComponent: VirtualComponent) => this.createDevUI(virtualComponent));
  }

  private createDevUI(virtualComponent: VirtualComponent): DevUIElementRef {
    if (!isSpace(virtualComponent)) {
      return;
    }

    return new ComponentSelectorElementRef(
      this.overlay,
      this.overlayPositionBuilder,
      this.state,
      this.layoutHelper,
      virtualComponent
    );
  }
}
