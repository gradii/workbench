import { ComponentRef, Injectable } from '@angular/core';
import { NbComponentPortal } from '@nebular/theme';
import { OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import ResizeObserver from 'resize-observer-polyfill';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VirtualComponent } from '../../model';
import { DevUIElementRef } from '../dev-ui-ref';
import { LayoutHelper } from '../../util/layout-helper.service';
import { OverlayService, OverlayZIndex } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { View } from '../../definitions';
import { SelectHighlightComponent } from './select-highlight.component';
import { DOMElementsService } from '../dom-elements.service';
import { ComponentSpecificDevUI } from '../component-specific-dev-ui';

class SelectHighlightElementRef implements DevUIElementRef {
  private destroyed$ = new Subject();
  private ref: OverlayRef;
  private componentRef: ComponentRef<SelectHighlightComponent>;
  private resizeObserver: ResizeObserver;
  private editable = false;

  constructor(
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private layoutHelper: LayoutHelper,
    private virtualComponent: VirtualComponent,
    private domElementsService: DOMElementsService
  ) {
    this.resizeObserver = new ResizeObserver(() => this.update());
    this.getEditable()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((editable: boolean) => this.onEditableChange(editable));
    this.layoutHelper.layoutChanged$.pipe(takeUntil(this.destroyed$)).subscribe(() => this.update());
    this.handleElementChange();
    this.scrollToElement();
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
      // Fix updating position for `highlight` component because of table double column rendering
      if (this.virtualComponent.component.definitionId === 'smartTable') {
        Promise.resolve().then(() => {
          if (this.ref && this.ref.hasAttached()) {
            this.patchInstanceWithData();
            this.updatePositionStrategy();
          }
        });
      } else {
        this.patchInstanceWithData();
        this.updatePositionStrategy();
      }
    }
  }

  private scrollToElement(): void {
    if (this.domElementsService.outViewport(this.virtualComponent)) {
      (this.virtualComponent.view.element.nativeElement as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }

  private onEditableChange(editable: boolean) {
    if (this.attached) {
      this.editable = editable;
      this.update();
    }
  }

  private show() {
    if (this.attached) {
      return;
    }

    this.ref = this.createOverlay(this.virtualComponent);
    this.componentRef = this.ref.attach(new NbComponentPortal(SelectHighlightComponent));
    this.disablePointerEvents();
    this.patchInstanceWithData();
  }

  private hide() {
    if (this.attached) {
      this.ref.detach();
    }
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
    // when element contenteditable we need space for 1px padding and 2px border
    const offset = this.editable ? -3 : 0;
    return this.overlayPositionBuilder
      .flexibleConnectedTo(view.element)
      .withPositions([
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top'
        }
      ])
      .withDefaultOffsetX(offset)
      .withDefaultOffsetY(offset);
  }

  private patchInstanceWithData() {
    // TODO: Cache element size in ResizeObserver
    // Current ResizeObserver polyfill implementation is outdated and listen only to content box size changes,
    // it doesn't track padding. Current spec has option to make observer listen to border-box change.
    this.componentRef.instance.width = this.el.offsetWidth;
    this.componentRef.instance.height = this.el.offsetHeight;

    this.componentRef.instance.editable = this.editable;
    this.componentRef.instance.virtualComponent = this.virtualComponent;

    this.componentRef.changeDetectorRef.detectChanges();
  }

  private updatePositionStrategy() {
    const positionStrategy = this.createPositionStrategy(this.virtualComponent.view);
    this.ref.updatePositionStrategy(positionStrategy);
  }

  private disablePointerEvents() {
    (<any>this.ref)._togglePointerEvents(false);
  }

  private getEditable(): Observable<boolean> {
    return this.virtualComponent.view.editable$ || of(false);
  }

  private handleElementChange() {
    if (this.virtualComponent.view.elementChange$) {
      this.virtualComponent.view.elementChange$.pipe(takeUntil(this.destroyed$)).subscribe(el => {
        this.update();
        this.resizeObserver.unobserve(this.el);
        this.resizeObserver.observe(el.nativeElement);
      });
    }
  }
}

@Injectable({ providedIn: 'root' })
export class SelectHighlightService {
  constructor(
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private layoutHelper: LayoutHelper,
    private domElementsService: DOMElementsService,
    private componentSpecificDevUI: ComponentSpecificDevUI
  ) {
  }

  attach(): void {
    this.componentSpecificDevUI.create((virtualComponent: VirtualComponent) => this.createDevUI(virtualComponent));
  }

  private createDevUI(virtualComponent: VirtualComponent): DevUIElementRef {
    return new SelectHighlightElementRef(
      this.overlay,
      this.overlayPositionBuilder,
      this.layoutHelper,
      virtualComponent,
      this.domElementsService
    );
  }
}
