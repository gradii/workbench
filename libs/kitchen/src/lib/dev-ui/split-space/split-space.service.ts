import {
  ConnectedPosition, FlexibleConnectedPositionStrategy, Overlay, OverlayRef, PositionStrategy
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { BreakpointWidth, InsertComponentPosition, StylesCompilerService } from '@common/public-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { View } from '../../definitions';

import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { LayoutHelper } from '../../util/layout-helper.service';
import { ComponentSpecificDevUI } from '../component-specific-dev-ui';
import { DevUIElementBaseRef, DevUIElementRef, DevUIRef } from '../dev-ui-ref';
import { OverlayZIndex } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { getAsElement, getAsStyles, getParentVirtualComponent, isSpace } from '../util';
import { SplitSpaceComponent } from './split-space.component';

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

const HANDLE_SIZE         = 24;
const DIMENSION_THRESHOLD = HANDLE_SIZE * 2;

class DevUISplitSpaceElementRef extends DevUIElementBaseRef {
  constructor(
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private vc: FlourComponent,
    private position: InsertComponentPosition,
    private connectedPosition: ConnectedPosition[],
    ref: OverlayRef
  ) {
    super(ref);
  }

  update() {
    const host             = getAsElement(this.vc);
    const parent           = getParentVirtualComponent(this.vc);
    const { direction }    = getAsStyles(parent)[BreakpointWidth.Desktop];
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
  private destroy$ = new Subject<void>();
  private resizeObserver: ResizeObserver;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState,
    private virtualComponent: FlourComponent,
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
    if (this.virtualComponent.view) {

      return this.virtualComponent.view.element.nativeElement;
    } else {
      // @ts-ignore
      return (this.virtualComponent).htmlElement;
    }
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
    return;
    // this.devUIRef = new DevUIRef(this.virtualComponent.rootType);
    //
    // const parent = this.virtualComponent.parentComponent;
    //
    // if (!isSpace(parent) || this.isParentTable(this.virtualComponent)) {
    //   return;
    // }
    //
    // const { direction } = this.stylesCompiler.compileStyles(parent.component.styles);
    //
    // if (direction === 'row') {
    //   this.createHorizontalSplitHandles();
    // }
    //
    // if (direction === 'column') {
    //   this.createVerticalSplitHandles();
    // }
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

  private isParentTable(cmp: FlourComponent) {
    return cmp.parentComponent && cmp.parentComponent.component.definitionId === 'table';
  }

  private createSplitOverlay(
    virtualComponent: FlourComponent,
    position: InsertComponentPosition,
    connectedPosition: ConnectedPosition[]
  ): DevUIElementRef {
    const ref: OverlayRef = this.createOverlay(virtualComponent, connectedPosition);
    const componentRef    = ref.attach(new ComponentPortal(SplitSpaceComponent));

    componentRef.instance.virtualComponent = virtualComponent;
    componentRef.instance.position         = position;
    componentRef.changeDetectorRef.detectChanges();

    return new DevUISplitSpaceElementRef(
      this.overlayPositionBuilder,
      this.virtualComponent,
      position,
      connectedPosition,
      ref
    );
  }

  private createOverlay(virtualComponent: FlourComponent, connectedPosition: ConnectedPosition[]) {
    const { view }         = virtualComponent;
    const positionStrategy = this.createPositionStrategy(view, connectedPosition);
    const ref              = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass    : OverlayZIndex.z1005
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

@Injectable(/*{ providedIn: 'root' }*/)
export class SplitSpaceService {
  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState,
    private layoutHelper: LayoutHelper,
    private componentSpecificDevUI: ComponentSpecificDevUI,
    private stylesCompiler: StylesCompilerService
  ) {
  }

  attach(): void {
    this.componentSpecificDevUI.create((virtualComponent: FlourComponent) => this.createDevUI(virtualComponent));
  }

  private createDevUI(virtualComponent: FlourComponent): DevUIElementRef {
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
