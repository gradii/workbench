import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { LayoutHelper } from '../../util/layout-helper.service';
import { DevUIElementRef } from '../dev-ui-ref';
import { OverlayPositionBuilderService } from '../overlay-position';
import { ComponentSelectorComponent } from './component-selector.component';


export class ComponentSelectorElementRef implements DevUIElementRef {
  private ref: OverlayRef;
  private destroy$ = new Subject<void>();
  private resizeObserver: ResizeObserver;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState,
    private layoutHelper: LayoutHelper,
    private virtualComponent: FlourComponent
  ) {
    this.show();
    this.resizeObserver = new ResizeObserver(() => this.update());
    this.resizeObserver.observe(this.virtualComponent.htmlElement);
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
    this.ref           = this.createOverlay(this.virtualComponent);
    const componentRef = this.ref.attach(new ComponentPortal(ComponentSelectorComponent));

    this.patchInstanceWithData(componentRef, this.virtualComponent);
  }

  private hide() {
    if (!this.ref) {
      return;
    }
    this.ref.dispose();
  }

  private createOverlay(virtualComponent: FlourComponent) {
    const { htmlElement }  = virtualComponent;
    const positionStrategy = this.createPositionStrategy(htmlElement);
    const ref              = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });

    this.disablePointerEvents(ref);

    return ref;
  }

  private createPositionStrategy(htmlElement: HTMLElement): PositionStrategy {
    return this.overlayPositionBuilder
      .flexibleConnectedTo(htmlElement)
      .withPositions([
        {
          originX : 'center',
          originY : 'center',
          overlayX: 'center',
          overlayY: 'center'
        }
      ]);
  }

  private patchInstanceWithData(ref: ComponentRef<ComponentSelectorComponent>, virtualComponent: FlourComponent) {
    ref.instance.virtualComponent = virtualComponent;
    ref.changeDetectorRef.detectChanges();
  }

  private disablePointerEvents(ref: any) {
    ref._togglePointerEvents(false);
  }
}
