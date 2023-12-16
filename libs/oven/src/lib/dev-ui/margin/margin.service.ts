import { ComponentRef, Injectable } from '@angular/core';
import { NbComponentPortal } from '@nebular/theme';
import { ConnectedPosition, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import ResizeObserver from 'resize-observer-polyfill';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { ActiveSetting } from '@common';

import { VirtualComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { DevUIElementRef, DevUIRef } from '../dev-ui-ref';
import { OverlayService, OverlayZIndex } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { View } from '../../definitions';
import { MarginComponent } from './margin.component';
import { LayoutHelper } from '../../util/layout-helper.service';
import { ComponentSpecificDevUI } from '../component-specific-dev-ui';

export type ElementMarginType = 'top' | 'right' | 'bottom' | 'left';

export interface ElementMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

export const marginPositions: { [key: string]: ConnectedPosition } = {
  top: {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom'
  },
  right: {
    originX: 'end',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top'
  },
  bottom: {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top'
  },
  left: {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top'
  }
};

export function extractDimensions(el: HTMLElement): ElementMargin {
  const getProperty = (style, property: string) => {
    // we avoid negative margins
    return Math.max(parseInt(style.getPropertyValue(property), 10), 0);
  };

  const styleDeclaration = window.getComputedStyle(el);
  return {
    top: getProperty(styleDeclaration, 'margin-top'),
    right: getProperty(styleDeclaration, 'margin-right'),
    bottom: getProperty(styleDeclaration, 'margin-bottom'),
    left: getProperty(styleDeclaration, 'margin-left'),
    width: el.offsetWidth,
    height: el.offsetHeight
  };
}

class MarginElementRef implements DevUIElementRef {
  private destroyed$ = new Subject();
  private ref: OverlayRef;
  private componentRef: ComponentRef<MarginComponent>;
  private resizeObserver: ResizeObserver;

  private activateMargin$: Observable<boolean> = combineLatest([
    this.state.activeComponentIdList$,
    this.state.activeSetting$
  ]).pipe(
    map(([activeComponentIdList, activeSetting]: [string[], ActiveSetting]) => {
      return activeComponentIdList.includes(this.virtualComponent.component.id) && activeSetting === 'margin';
    }),
    debounceTime(50)
  );

  constructor(
    private marginType: ElementMarginType,
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState,
    private layoutHelper: LayoutHelper,
    private virtualComponent: VirtualComponent
  ) {
    this.resizeObserver = new ResizeObserver(() => this.update());
    this.activateMargin$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((selected: boolean) => this.onSelectChange(selected));

    this.layoutHelper.layoutChanged$.pipe(takeUntil(this.destroyed$)).subscribe(() => this.update());
    this.handleElementChange();
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
    this.componentRef = this.ref.attach(new NbComponentPortal(MarginComponent));
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
    const position = marginPositions[this.marginType];
    const dimensions = extractDimensions(this.el);

    let offsetX,
      offsetY = 0;
    if (this.marginType === 'bottom') {
      offsetX = -Math.max(dimensions.left, 0);
    }

    if (this.marginType === 'left') {
      offsetY = -Math.max(dimensions.top, 0);
    }

    return this.overlayPositionBuilder
      .flexibleConnectedTo(view.element)
      .withPositions([position])
      .withDefaultOffsetX(offsetX)
      .withDefaultOffsetY(offsetY);
  }

  private patchInstanceWithData() {
    const dimensions = extractDimensions(this.el);
    const margin = dimensions[this.marginType];

    let width,
      height = 0;

    if (this.marginType === 'top') {
      width = dimensions.width + dimensions.right;
      height = margin;
    }

    if (this.marginType === 'right') {
      width = margin;
      height = dimensions.height + dimensions.bottom;
    }

    if (this.marginType === 'bottom') {
      width = dimensions.width + dimensions.left;
      height = margin;
    }

    if (this.marginType === 'left') {
      width = margin;
      height = dimensions.height + dimensions.top;
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
export class MarginService {
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
    const marginTypes: ElementMarginType[] = ['top', 'right', 'bottom', 'left'];
    const devUIRef: DevUIRef = new DevUIRef(virtualComponent.rootType);

    for (const marginType of marginTypes) {
      const elementRef: DevUIElementRef = this.createMarginElementRef(marginType, virtualComponent);
      devUIRef.attach(elementRef);
    }

    return devUIRef;
  }

  private createMarginElementRef(marginType: ElementMarginType, virtualComponent: VirtualComponent): DevUIElementRef {
    return new MarginElementRef(
      marginType,
      this.overlay,
      this.overlayPositionBuilder,
      this.state,
      this.layoutHelper,
      virtualComponent
    );
  }
}
