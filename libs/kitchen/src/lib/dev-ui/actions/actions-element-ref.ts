import { ConnectedPosition, Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, NgZone } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { LayoutHelper } from '../../util/layout-helper.service';
import { DevUIElementRef } from '../dev-ui-ref';
import { OverlayZIndex } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { ActionsComponent } from './actions.component';

const positions: ConnectedPosition[] = [
  {
    originX   : 'start',
    originY   : 'top',
    overlayX  : 'start',
    overlayY  : 'bottom',
    offsetY   : -2,
    panelClass: 'top'
  },
  {
    originX   : 'start',
    originY   : 'bottom',
    overlayX  : 'start',
    overlayY  : 'top',
    offsetY   : 2,
    panelClass: 'bottom'
  },
  {
    originX   : 'end',
    originY   : 'top',
    overlayX  : 'end',
    overlayY  : 'bottom',
    offsetY   : -2,
    panelClass: 'top'
  },
  {
    originX   : 'end',
    originY   : 'bottom',
    overlayX  : 'end',
    overlayY  : 'top',
    offsetY   : 2,
    panelClass: 'bottom'
  },
  {
    originX   : 'start',
    originY   : 'top',
    overlayX  : 'start',
    overlayY  : 'top',
    offsetY   : 4,
    offsetX   : 4,
    panelClass: 'bottom-inset'
  }
];

export class ActionsElementRef implements DevUIElementRef {
  private ref: OverlayRef;
  private componentRef: ComponentRef<ActionsComponent>;
  private destroy$ = new Subject<void>();
  private resizeObserver: ResizeObserver;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private renderState: RenderState,
    private ngZone: NgZone,
    private layoutHelper: LayoutHelper,
    private virtualComponent: FlourComponent
  ) {
    this.show();
    this.resizeObserver = new ResizeObserver(() => this.update());
    this.resizeObserver.observe(this.el);
    this.layoutHelper.layoutChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => this.update());
    this.handleElementChange();
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
    this.hide();
    this.destroy$.next();
    this.resizeObserver.disconnect();
  }

  update() {
    if (this.attached) {
      const positionStrategy = this.createPositionStrategy(this.virtualComponent.htmlElement);
      this.ref.updatePositionStrategy(positionStrategy);

      if (this.virtualComponent.component.definitionId === 'smartTable') {
        Promise.resolve().then(() => {
          this.patchInstanceWithData();
          if (this.ref && this.ref.hasAttached()) {
            this.ref.updatePosition();
          }
        });
      } else if (this.virtualComponent.component.definitionId === 'menu') {
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

    this.ref          = this.createOverlay(this.virtualComponent);
    this.componentRef = this.ref.attach(new ComponentPortal(ActionsComponent));
    this.disablePointerEvents(this.ref);

    this.patchInstanceWithData();
  }

  private hide() {
    if (this.attached) {
      this.ref.dispose();
    }
  }

  private createOverlay(virtualComponent: FlourComponent) {
    const positionStrategy = this.createPositionStrategy(virtualComponent.htmlElement);
    return this.overlay.create({
      positionStrategy,
      panelClass    : OverlayZIndex.z1003,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private createPositionStrategy(htmlElement: HTMLElement): PositionStrategy {
    return this.overlayPositionBuilder
      .flexibleConnectedTo(htmlElement)
      .withPositions(positions);
  }

  private patchInstanceWithData() {
    this.componentRef.instance.virtualComponent = this.virtualComponent;
    this.componentRef.instance.width            = this.el.offsetWidth;
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
    // if (this.virtualComponent.view.elementChange$) {
    //   this.virtualComponent.view.elementChange$.pipe(takeUntil(this.destroy$)).subscribe(el => {
    //     this.update();
    //     this.resizeObserver.unobserve(this.el);
    //     this.resizeObserver.observe(el.nativeElement);
    //   });
    // }
  }
}