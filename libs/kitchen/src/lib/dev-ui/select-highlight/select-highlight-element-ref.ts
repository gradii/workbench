import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { LayoutHelper } from '../../util/layout-helper.service';
import { DevUIElementRef } from '../dev-ui-ref';
import { DOMElementsService } from '../dom-elements.service';
import { OverlayZIndex } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { SelectHighlightComponent } from './select-highlight.component';

export class SelectHighlightElementRef implements DevUIElementRef {
  private destroy$ = new Subject<void>();
  private ref: OverlayRef;
  private componentRef: ComponentRef<SelectHighlightComponent>;
  private resizeObserver: ResizeObserver;
  private editable = false;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private layoutHelper: LayoutHelper,
    private flourComponent: FlourComponent,
    private domElementsService: DOMElementsService,
    private renderState: RenderState
  ) {
    this.resizeObserver = new ResizeObserver(() => this.update());
    this.getEditable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((editable: boolean) => this.onEditableChange(editable));
    this.layoutHelper.layoutChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => this.update());
    this.handleElementChange();
    // this.scrollToElement();
    this.show();
    this.resizeObserver.observe(this.el);
  }

  private get el(): HTMLElement {
    if (this.flourComponent.view) {
      return this.flourComponent.view.element.nativeElement;
    } else {
      return this.flourComponent.htmlElement;
    }
  }

  private get attached(): boolean {
    return this.ref && this.ref.hasAttached();
  }

  dispose() {
    this.destroy$.next();
    if (this.ref) {
      this.ref.dispose();
      this.ref = null;
    }
    this.resizeObserver.disconnect();
  }

  update() {
    if (this.attached) {
      // Fix updating position for `highlight` component because of table double column rendering
      if (this.flourComponent.component.definitionId === 'smartTable') {
        Promise.resolve().then(() => {
          if (this.ref && this.ref.hasAttached()) {
            this.patchInstanceWithData();
            this.updatePosition();
          }
        });
      } else {
        this.patchInstanceWithData();
        this.updatePosition();
      }
    }
  }

  // bugs when use scrollIntoView. maybe can use cdk scrollable
  // private scrollToElement(): void {
  //   if (this.domElementsService.outViewport(this.flourComponent)) {
  //     this.flourComponent.htmlElement.scrollIntoView({
  //       behavior: 'smooth',
  //       block   : 'center'
  //     });
  //   }
  // }

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

    this.ref          = this.createOverlay(this.flourComponent);
    this.componentRef = this.ref.attach(new ComponentPortal(SelectHighlightComponent));
    this.disablePointerEvents();
    this.patchInstanceWithData();

    // this.renderState.containerClipPath$.pipe(
    //   take(1),
    //   takeUntil(this.destroy$)
    // ).subscribe(clipPath => {
    //   this.ref.hostElement.style.clipPath = clipPath;
    // });
  }

  private hide() {
    if (this.attached) {
      this.ref.detach();
    }
  }

  private createOverlay(virtualComponent: FlourComponent) {
    // @ts-ignore
    const { htmlElement }  = virtualComponent;
    const positionStrategy = this.createPositionStrategy(htmlElement);

    return this.overlay.create({
      panelClass    : OverlayZIndex.z1002,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private createPositionStrategy(htmlElement: HTMLElement): PositionStrategy {
    // when element contenteditable we need space for 1px padding and 2px border
    const offset = this.editable ? -3 : 0;
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
      .withDefaultOffsetX(offset)
      .withDefaultOffsetY(offset);
  }

  private patchInstanceWithData() {
    // TODO: Cache element size in ResizeObserver
    // Current ResizeObserver polyfill implementation is outdated and listen only to content box size changes,
    // it doesn't track padding. Current spec has option to make observer listen to border-box change.
    this.componentRef.instance.width  = this.el.offsetWidth;
    this.componentRef.instance.height = this.el.offsetHeight;

    this.componentRef.instance.editable         = this.editable;
    this.componentRef.instance.virtualComponent = this.flourComponent;

    this.componentRef.changeDetectorRef.detectChanges();
  }

  private updatePosition() {
    this.ref.updatePosition();
  }

  private updatePositionStrategy() {
    const positionStrategy = this.createPositionStrategy(this.flourComponent.htmlElement);
    this.ref.updatePositionStrategy(positionStrategy);
  }

  private disablePointerEvents() {
    (<any>this.ref)._togglePointerEvents(false);
  }

  private getEditable(): Observable<boolean> {
    return /*this.flourComponent.view.editable$ ||*/ of(false);
  }

  private handleElementChange() {
    if (this.flourComponent.view?.elementChange$) {
      this.flourComponent.view.elementChange$.pipe(takeUntil(this.destroy$)).subscribe(el => {
        this.update();
        this.resizeObserver.unobserve(this.el);
        this.resizeObserver.observe(el.nativeElement);
      });
    }
  }
}
