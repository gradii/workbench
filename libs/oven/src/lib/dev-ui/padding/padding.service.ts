import { ComponentRef, Injectable } from '@angular/core';
import { NbComponentPortal } from '@nebular/theme';
import { ConnectedPosition, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import ResizeObserver from 'resize-observer-polyfill';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ActiveSetting } from '@common';

import { VirtualComponent } from '../../model';
import { DevUIElementRef, DevUIRef } from '../dev-ui-ref';
import { OverlayService, OverlayZIndex } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { View } from '../../definitions';
import { PaddingComponent } from './padding.component';
import { LayoutHelper } from '../../util/layout-helper.service';
import { RenderState } from '../../state/render-state.service';
import { ComponentSpecificDevUI } from '../component-specific-dev-ui';

export type ElementPaddingType = 'top' | 'right' | 'bottom' | 'left';

export interface ElementPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
  shiftTop: number;
  shiftLeft: number;
  shiftBottom: number;
  shiftRight: number;
}

export const paddingPositions: { [key: string]: ConnectedPosition } = {
  top: {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top'
  },
  right: {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top'
  },
  bottom: {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'bottom'
  },
  left: {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top'
  }
};

export function extractDimensions(el: HTMLElement): ElementPadding {
  let extractEl: HTMLElement = el;
  let shifts = {
    shiftTop: 0,
    shiftBottom: 0,
    shiftRight: 0,
    shiftLeft: 0
  };

  /* This if is needed to handle tab padding highlight */
  if (el.tagName.toLowerCase() === 'nb-tabset') {
    extractEl = el.querySelector('nb-tab.content-active');
    shifts = {
      shiftTop: extractEl.offsetTop - el.offsetTop,
      shiftRight: extractEl.offsetLeft - el.offsetLeft + (extractEl.offsetWidth - el.offsetWidth),
      shiftBottom: extractEl.offsetTop - el.offsetTop + (extractEl.offsetHeight - el.offsetHeight),
      shiftLeft: extractEl.offsetWidth - el.offsetWidth
    };
  }

  const getProperty = function(style, property: string) {
    return parseInt(style.getPropertyValue(property), 10);
  };

  const styleDeclaration = window.getComputedStyle(extractEl);
  return {
    top: getProperty(styleDeclaration, 'padding-top'),
    right: getProperty(styleDeclaration, 'padding-right'),
    bottom: getProperty(styleDeclaration, 'padding-bottom'),
    left: getProperty(styleDeclaration, 'padding-left'),
    width: extractEl.offsetWidth,
    height: extractEl.offsetHeight,
    ...shifts
  };
}

class PaddingElementRef implements DevUIElementRef {
  private destroyed$ = new Subject();
  private ref: OverlayRef;
  private componentRef: ComponentRef<PaddingComponent>;
  private resizeObserver: ResizeObserver;

  private activatePadding$: Observable<boolean> = combineLatest([
    this.renderState.componentsWithPaddingsToHighlight$,
    this.renderState.activeSetting$
  ]).pipe(
    map(([activeComponentIdList, activeSetting]: [string[], ActiveSetting]) => {
      return activeComponentIdList.includes(this.virtualComponent.component.id) && activeSetting === 'padding';
    })
  );

  private get el(): HTMLElement {
    return this.virtualComponent.view.element.nativeElement;
  }

  private get attached(): boolean {
    return this.ref && this.ref.hasAttached();
  }

  constructor(
    private paddingType: ElementPaddingType,
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private renderState: RenderState,
    private layoutHelper: LayoutHelper,
    private virtualComponent: VirtualComponent
  ) {
    this.resizeObserver = new ResizeObserver(() => this.update());
    this.activatePadding$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((selected: boolean) => this.onSelectChange(selected));
    this.layoutHelper.layoutChanged$.pipe(takeUntil(this.destroyed$)).subscribe(() => this.update());
    this.handleElementChange();
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
      this.patchInstanceWithData();
      // Fix updating position for `highlight` component because of table double column rendering
      if (this.virtualComponent.component.definitionId === 'smartTable') {
        Promise.resolve().then(() => {
          if (this.ref && this.ref.hasAttached()) {
            this.updatePositionStrategy();
          }
        });
      } else {
        this.updatePositionStrategy();
      }
    }
  }

  private onSelectChange(selected: boolean) {
    if (selected) {
      this.show();
      this.resizeObserver.observe(this.el);
    } else {
      this.hide();
      this.resizeObserver.unobserve(this.el);
    }
  }

  private show() {
    if (this.attached) {
      return;
    }

    this.ref = this.createOverlay(this.virtualComponent);
    this.componentRef = this.ref.attach(new NbComponentPortal(PaddingComponent));
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
    // const offset = this.editable ? -3 : 0;
    const position = paddingPositions[this.paddingType];
    const paddings = extractDimensions(this.el);

    let offsetX, offsetY;

    if (this.paddingType === 'top') {
      offsetX = paddings.shiftLeft;
      offsetY = paddings.shiftTop;
    }

    if (this.paddingType === 'right') {
      offsetX = paddings.shiftRight;
      offsetY = paddings.shiftTop;
    }

    if (this.paddingType === 'bottom') {
      offsetX = paddings['left'] + paddings.shiftLeft;
      offsetY = paddings.shiftBottom;
    }

    if (this.paddingType === 'left') {
      offsetX = paddings.shiftLeft;
      offsetY = paddings['top'] + paddings.shiftTop;
    }

    return this.overlayPositionBuilder
      .flexibleConnectedTo(view.element)
      .withPositions([position])
      .withDefaultOffsetX(offsetX)
      .withDefaultOffsetY(offsetY);
  }

  private patchInstanceWithData() {
    const dimensions = extractDimensions(this.el);
    const padding = dimensions[this.paddingType];

    let width,
      height = 0;

    if (this.paddingType === 'top') {
      width = dimensions.width - dimensions.right;
      height = padding;
    }

    if (this.paddingType === 'right') {
      width = padding;
      height = dimensions.height - dimensions.bottom;
    }

    if (this.paddingType === 'bottom') {
      width = dimensions.width - dimensions.left;
      height = padding;
    }

    if (this.paddingType === 'left') {
      width = padding;
      height = dimensions.height - dimensions.top;
    }

    this.componentRef.instance.width = width;
    this.componentRef.instance.height = height;
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
export class PaddingService {
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

  createDevUI(virtualComponent: VirtualComponent): DevUIElementRef {
    const paddingTypes: ElementPaddingType[] = ['top', 'right', 'bottom', 'left'];
    const devUIRef: DevUIRef = new DevUIRef(virtualComponent.rootType);

    for (const paddingType of paddingTypes) {
      const elementRef: DevUIElementRef = this.createPaddingElementRef(paddingType, virtualComponent);
      devUIRef.attach(elementRef);
    }

    return devUIRef;
  }

  private createPaddingElementRef(
    paddingType: ElementPaddingType,
    virtualComponent: VirtualComponent
  ): DevUIElementRef {
    return new PaddingElementRef(
      paddingType,
      this.overlay,
      this.overlayPositionBuilder,
      this.state,
      this.layoutHelper,
      virtualComponent
    );
  }
}
