import { Injectable } from '@angular/core';
import { NbComponentPortal } from '@nebular/theme';
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  OverlayRef,
  PositionStrategy
} from '@angular/cdk/overlay';
import { takeUntil } from 'rxjs/operators';
import ResizeObserver from 'resize-observer-polyfill';
import { Subject } from 'rxjs';
import { BreakpointWidth, InsertComponentPosition, StylesCompilerService } from '@common';

import { VirtualComponent } from '../../model';
import { LayoutHelper } from '../../util/layout-helper.service';
import { OverlayService, OverlayZIndex } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { DevUIElementBaseRef, DevUIElementRef, DevUIRef } from '../dev-ui-ref';
import { View } from '../../definitions';
import { SplitSpaceComponent } from './split-space.component';
import { RenderState } from '../../state/render-state.service';
import { getAsElement, getAsStyles, getParentVirtualComponent, isSpace } from '../util';
import { ComponentSpecificDevUI } from '../component-specific-dev-ui';

const horizontalSplitSpaceOverlayPositionMapping: Map<InsertComponentPosition, ConnectedPosition[]> = new Map()
  .set(InsertComponentPosition.BEFORE, [
    { originX: 'start', originY: 'center', overlayX: 'center', overlayY: 'center' },
    { originX: 'start', originY: 'center', overlayX: 'start', overlayY: 'center' }
  ])
  .set(InsertComponentPosition.AFTER, [
    { originX: 'end', originY: 'center', overlayX: 'center', overlayY: 'center' },
    { originX: 'end', originY: 'center', overlayX: 'end', overlayY: 'center' }
  ]);

const verticalSplitSpaceOverlayPositionMapping: Map<InsertComponentPosition, ConnectedPosition[]> = new Map()
  .set(InsertComponentPosition.AFTER, [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'center' },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'bottom' }
  ])
  .set(InsertComponentPosition.BEFORE, [
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'center' },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'top' }
  ]);

const HANDLE_SIZE = 24;
const DIMENSION_THRESHOLD = HANDLE_SIZE * 2;

class DevUISplitSpaceElementRef extends DevUIElementBaseRef {
  constructor(
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private vc: VirtualComponent,
    private position: InsertComponentPosition,
    private connectedPosition: ConnectedPosition[],
    ref: OverlayRef
  ) {
    super(ref);
  }

  update() {
    const host = getAsElement(this.vc);
    const parent = getParentVirtualComponent(this.vc);
    const { direction } = getAsStyles(parent)[BreakpointWidth.Desktop];
    const positionStrategy = this.createPositionStrategy(host);

    if (direction === 'row' && host.clientWidth < DIMENSION_THRESHOLD) {
      const offsetY = this.calcOffset(host.clientWidth);
      positionStrategy.withDefaultOffsetX(offsetY);
    } else if (direction === 'column' && host.clientHeight < DIMENSION_THRESHOLD) {
      const offsetY = this.calcOffset(host.clientHeight);
      positionStrategy.withDefaultOffsetY(offsetY);
    }

    this.ref.updatePositionStrategy(positionStrategy);
  }

  private createPositionStrategy(host: HTMLElement): FlexibleConnectedPositionStrategy {
    return this.overlayPositionBuilder.flexibleConnectedTo(host).withPositions(this.connectedPosition);
  }

  private calcOffset(dimension: number): number {
    const offset = (DIMENSION_THRESHOLD - dimension) / 2;

    if (this.position === InsertComponentPosition.BEFORE) {
      return -offset;
    }

    return offset;
  }
}

class SplitSpaceElementRef implements DevUIElementRef {
  private devUIRef: DevUIRef;
  private destroy$ = new Subject();
  private resizeObserver: ResizeObserver;

  constructor(
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState,
    private virtualComponent: VirtualComponent,
    private layoutHelper: LayoutHelper,
    private stylesCompiler: StylesCompilerService
  ) {
    // TODO unubserve
    this.resizeObserver = new ResizeObserver(() => this.update());
    this.resizeObserver.observe(this.el);
    this.show();
    this.layoutHelper.layoutChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => this.update());
  }

  private get el(): HTMLElement {
    return this.virtualComponent.view.element.nativeElement;
  }

  dispose() {
    this.hide();
    this.destroy$.next();
    this.resizeObserver.disconnect();
  }

  update() {
    if (this.devUIRef) {
      this.devUIRef.update();
    }
  }

  private show() {
    this.devUIRef = new DevUIRef(this.virtualComponent.rootType);

    const parent = this.virtualComponent.parentComponent;

    if (!isSpace(parent) || this.isParentTable(this.virtualComponent)) {
      return;
    }

    const { direction } = this.stylesCompiler.compileStyles(parent.component.styles);

    if (direction === 'row') {
      this.createHorizontalSplitHandles();
    }

    if (direction === 'column') {
      this.createVerticalSplitHandles();
    }
  }

  private hide() {
    if (!this.devUIRef) {
      return;
    }
    this.devUIRef.dispose();
  }

  private createHorizontalSplitHandles() {
    horizontalSplitSpaceOverlayPositionMapping.forEach(
      (connectedPosition: ConnectedPosition[], position: InsertComponentPosition) => {
        const devUIElementRef = this.createSplitOverlay(this.virtualComponent, position, connectedPosition);
        this.devUIRef.attach(devUIElementRef);
      }
    );
  }

  private createVerticalSplitHandles() {
    verticalSplitSpaceOverlayPositionMapping.forEach(
      (connectedPosition: ConnectedPosition[], position: InsertComponentPosition) => {
        const devUIElementRef = this.createSplitOverlay(this.virtualComponent, position, connectedPosition);
        this.devUIRef.attach(devUIElementRef);
      }
    );
  }

  private isParentTable(cmp: VirtualComponent) {
    return cmp.parentComponent && cmp.parentComponent.component.definitionId === 'table';
  }

  private createSplitOverlay(
    virtualComponent: VirtualComponent,
    position: InsertComponentPosition,
    connectedPosition: ConnectedPosition[]
  ): DevUIElementRef {
    const ref: OverlayRef = this.createOverlay(virtualComponent, connectedPosition);
    const componentRef = ref.attach(new NbComponentPortal(SplitSpaceComponent));

    componentRef.instance.virtualComponent = virtualComponent;
    componentRef.instance.position = position;
    componentRef.changeDetectorRef.detectChanges();

    return new DevUISplitSpaceElementRef(
      this.overlayPositionBuilder,
      this.virtualComponent,
      position,
      connectedPosition,
      ref
    );
  }

  private createOverlay(virtualComponent: VirtualComponent, connectedPosition: ConnectedPosition[]) {
    const { view } = virtualComponent;
    const positionStrategy = this.createPositionStrategy(view, connectedPosition);
    const ref = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      overlayClass: OverlayZIndex.z1005,
      rootType: virtualComponent.rootType
    });

    this.disablePointerEvents(ref);

    return ref;
  }

  private createPositionStrategy<T>(view: View<T>, connectedPosition: ConnectedPosition[]): PositionStrategy {
    return this.overlayPositionBuilder.flexibleConnectedTo(view.element).withPositions(connectedPosition);
  }

  private disablePointerEvents(ref: any) {
    ref._togglePointerEvents(false);
  }
}

@Injectable({ providedIn: 'root' })
export class SplitSpaceService {
  constructor(
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState,
    private layoutHelper: LayoutHelper,
    private componentSpecificDevUI: ComponentSpecificDevUI,
    private stylesCompiler: StylesCompilerService
  ) {
  }

  attach(): void {
    this.componentSpecificDevUI.create((virtualComponent: VirtualComponent) => this.createDevUI(virtualComponent));
  }

  private createDevUI(virtualComponent: VirtualComponent): DevUIElementRef {
    if (!isSpace(virtualComponent)) {
      return;
    }

    return new SplitSpaceElementRef(
      this.overlay,
      this.overlayPositionBuilder,
      this.state,
      virtualComponent,
      this.layoutHelper,
      this.stylesCompiler
    );
  }
}
