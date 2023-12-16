import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, pairwise, takeUntil } from 'rxjs/operators';
import { NbComponentPortal, NbPortalInjector } from '@nebular/theme';
import { ConnectedPosition, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import ResizeObserver from 'resize-observer-polyfill';

import { VirtualComponent } from '../../model';
import { OverlayService, OverlayZIndex } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { RenderState } from '../../state/render-state.service';
import { DevUIElementBaseRef, DevUIElementRef, DevUIRef } from '../dev-ui-ref';
import { View } from '../../definitions';
import { ResizeHandleComponent } from './resize-handle/resize-handle.component';
import { ATTACHED_COMPONENTS$, VIRTUAL_COMPONENT } from './model';
import { isSpace } from '../util';
import { ComponentSpecificDevUI } from '../component-specific-dev-ui';
import { DevUIStateService } from '../dev-ui-state.service';

class ResizeHandleElementRef extends DevUIElementBaseRef {
  private resizeObserver: ResizeObserver;

  constructor(
    ref: OverlayRef,
    private componentRef: ComponentRef<ResizeHandleComponent>,
    private virtualComponent: VirtualComponent
  ) {
    super(ref);
    this.resizeObserver = new ResizeObserver(() => this.update());
    this.resizeObserver.observe(this.el);
  }

  private get el(): HTMLElement {
    return this.virtualComponent.view.element.nativeElement;
  }

  dispose() {
    super.dispose();
    this.resizeObserver.disconnect();
  }

  update() {
    super.update();
    this.ref.updatePosition();
  }
}

class ResizeElementRef implements DevUIElementRef {
  private devUIRef: DevUIRef;
  private destroy$ = new Subject();
  private hide$ = new Subject();
  private componentRef: ComponentRef<ResizeHandleComponent>;
  private ref: OverlayRef;

  constructor(
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState,
    private virtualComponent: VirtualComponent,
    private attachedComponents$: Observable<VirtualComponent[]>,
    private injector: Injector
  ) {
    this.show();
  }

  dispose() {
    this.hide();
    this.destroy$.next();
  }

  update() {
    if (!this.devUIRef || !this.ref || !this.ref.hasAttached()) {
      return;
    }
    this.updatePosition();
    this.componentRef.instance.recalculateInitialValue();
  }

  private show() {
    this.devUIRef = new DevUIRef(this.virtualComponent.rootType);

    if (isSpace(this.virtualComponent.parentComponent)) {
      this.attachHandle();
    }
  }

  private hide() {
    if (!this.devUIRef) {
      return;
    }
    this.hide$.next();
    this.devUIRef.dispose();
  }

  private attachHandle() {
    const devUIElementRef = this.createHandle();
    this.devUIRef.attach(devUIElementRef);
  }

  private createHandle(): DevUIElementRef {
    const position: ConnectedPosition = { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' };
    this.ref = this.createOverlay(this.virtualComponent, position);
    const injector: NbPortalInjector = this.createInjector();
    this.componentRef = this.ref.attach(new NbComponentPortal(ResizeHandleComponent, null, injector));
    this.updatePosition();
    this.disablePointerEvents();
    this.handleReverseResize();

    return new ResizeHandleElementRef(this.ref, this.componentRef, this.virtualComponent);
  }

  private handleReverseResize(): void {
    this.componentRef.instance.reverseResize$
      .pipe(
        pairwise(),
        filter(([prev, curr]) => prev !== curr),
        takeUntil(this.hide$)
      )
      .subscribe(() => {
        this.hide();
        this.show();
      });
  }

  private updatePosition(): void {
    const { width, height } = this.virtualComponent.view.element.nativeElement.getBoundingClientRect();
    this.componentRef.instance.width = width + 'px';
    this.componentRef.instance.height = height + 'px';
    this.componentRef.changeDetectorRef.detectChanges();
    this.ref.updatePosition();
  }

  private createInjector(): NbPortalInjector {
    return new NbPortalInjector(
      this.injector,
      new WeakMap<any, any>([
        [VIRTUAL_COMPONENT, this.virtualComponent],
        [ATTACHED_COMPONENTS$, this.attachedComponents$]
      ])
    );
  }

  private createOverlay(virtualComponent: VirtualComponent, connectedPosition: ConnectedPosition) {
    const { view } = virtualComponent;
    const positionStrategy = this.createPositionStrategy(view, connectedPosition);
    return this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      rootType: virtualComponent.rootType,
      overlayClass: OverlayZIndex.z1004
    });
  }

  private createPositionStrategy<T>(view: View<T>, connectedPosition: ConnectedPosition): PositionStrategy {
    return this.overlayPositionBuilder.flexibleConnectedTo(view.element).withPositions([connectedPosition]);
  }

  private disablePointerEvents(): void {
    (this.ref as any)._togglePointerEvents(false);
  }
}

@Injectable({ providedIn: 'root' })
export class ResizeHandleFactory {
  constructor(
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState,
    private componentSpecificDevUI: ComponentSpecificDevUI,
    private devUIStateService: DevUIStateService,
    private injector: Injector
  ) {
  }

  attach(): void {
    this.componentSpecificDevUI.create((virtualComponent: VirtualComponent) => this.createDevUI(virtualComponent));
  }

  private createDevUI(virtualComponent: VirtualComponent): DevUIElementRef {
    if (!isSpace(virtualComponent)) {
      return;
    }

    return new ResizeElementRef(
      this.overlay,
      this.overlayPositionBuilder,
      this.state,
      virtualComponent,
      this.devUIStateService.attachedComponents$,
      this.injector
    );
  }
}
