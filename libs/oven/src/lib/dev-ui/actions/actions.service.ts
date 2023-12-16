import { ConnectedPosition, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentRef, Injectable, NgZone } from '@angular/core';
import { NbComponentPortal } from '@nebular/theme';
import ResizeObserver from 'resize-observer-polyfill';
import { Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { View } from '../../definitions';
import { VirtualComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { LayoutHelper } from '../../util/layout-helper.service';
import { DevUIElementRef } from '../dev-ui-ref';
import { OverlayService, OverlayZIndex } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { ActionsComponent } from './actions.component';
import { ComponentSpecificDevUI } from '../component-specific-dev-ui';

const positions: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -2,
    panelClass: 'top'
  },
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 2,
    panelClass: 'bottom'
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetY: -2,
    panelClass: 'top'
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: 2,
    panelClass: 'bottom'
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 4,
    offsetX: 4,
    panelClass: 'bottom-inset'
  }
];

class ActionsElementRef implements DevUIElementRef {
  private ref: OverlayRef;
  private componentRef: ComponentRef<ActionsComponent>;
  private destroy$ = new Subject();
  private resizeObserver: ResizeObserver;

  constructor(
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private renderState: RenderState,
    private ngZone: NgZone,
    private layoutHelper: LayoutHelper,
    private virtualComponent: VirtualComponent
  ) {
    this.show();
    this.resizeObserver = new ResizeObserver(() => this.update());
    this.resizeObserver.observe(this.el);
    this.layoutHelper.layoutChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => this.update());
    this.handleElementChange();
  }

  private get el(): HTMLElement {
    return this.virtualComponent.view.element.nativeElement;
  }

  private get attached(): boolean {
    return this.ref && this.ref.hasAttached();
  }

  dispose() {
    this.hide();
    this.destroy$.next();
    this.resizeObserver.disconnect();
  }

  update() {
    if (this.attached) {
      const positionStrategy = this.createPositionStrategy(this.virtualComponent.view);
      this.ref.updatePositionStrategy(positionStrategy);

      // Fix updating position for `actions` component because of table double column rendering
      if (this.virtualComponent.component.definitionId === 'smartTable') {
        Promise.resolve().then(() => {
          this.patchInstanceWithData();
          if (this.ref && this.ref.hasAttached()) {
            this.ref.updatePosition();
          }
        });
      } else if (this.virtualComponent.component.definitionId === 'menu') {
        // nebular menu doesn't use nbFor.trackBy, it leads to wrong alignment
        this.ngZone.runOutsideAngular(() => {
          Promise.resolve().then(() => {
            this.patchInstanceWithData();
            this.ref.updatePosition();
          });
        });
      } else {
        this.patchInstanceWithData();
        this.ref.updatePosition();
      }
    }
  }

  private show() {
    if (this.attached) {
      return;
    }

    this.ref = this.createOverlay(this.virtualComponent);
    this.componentRef = this.ref.attach(new NbComponentPortal(ActionsComponent));
    this.disablePointerEvents(this.ref);

    this.patchInstanceWithData();
  }

  private hide() {
    if (this.attached) {
      this.ref.dispose();
    }
  }

  private createOverlay(virtualComponent: VirtualComponent) {
    const positionStrategy = this.createPositionStrategy(virtualComponent.view);
    return this.overlay.create({
      positionStrategy,
      overlayClass: OverlayZIndex.z1003,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      rootType: virtualComponent.rootType
    });
  }

  private createPositionStrategy<T>(view: View<T>): PositionStrategy {
    return this.overlayPositionBuilder.flexibleConnectedTo(view.element).withPositions(positions);
  }

  private patchInstanceWithData() {
    this.componentRef.instance.virtualComponent = this.virtualComponent;
    this.componentRef.instance.width = this.el.offsetWidth;
    this.componentRef.changeDetectorRef.detectChanges();
  }

  private disablePointerEvents(ref: any) {
    ref._togglePointerEvents(false);
  }

  private getEditable(): Observable<boolean> {
    return this.virtualComponent.view.editable$ ? this.virtualComponent.view.editable$ : of(false);
  }

  private getSelected(): Observable<boolean> {
    return this.renderState.activeComponentIdList$.pipe(
      map((activeComponentIdList: string[]) => activeComponentIdList.includes(this.virtualComponent.component.id)),
      distinctUntilChanged()
    );
  }

  private handleElementChange() {
    if (this.virtualComponent.view.elementChange$) {
      this.virtualComponent.view.elementChange$.pipe(takeUntil(this.destroy$)).subscribe(el => {
        this.update();
        this.resizeObserver.unobserve(this.el);
        this.resizeObserver.observe(el.nativeElement);
      });
    }
  }
}

@Injectable({ providedIn: 'root' })
export class ActionsService {
  constructor(
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState,
    private ngZone: NgZone,
    private componentSpecificDevUI: ComponentSpecificDevUI,
    private layoutHelper: LayoutHelper
  ) {
  }

  attach(): void {
    this.componentSpecificDevUI.create((virtualComponent: VirtualComponent) => this.createDevUI(virtualComponent));
  }

  private createDevUI(virtualComponent: VirtualComponent): DevUIElementRef {
    return new ActionsElementRef(
      this.overlay,
      this.overlayPositionBuilder,
      this.state,
      this.ngZone,
      this.layoutHelper,
      virtualComponent
    );
  }
}
