import { ComponentRef, Inject, Injectable } from '@angular/core';
import { NB_DOCUMENT, NbComponentPortal } from '@nebular/theme';
import { OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { combineLatest, fromEvent, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, pairwise, startWith, tap, withLatestFrom } from 'rxjs/operators';

import { VirtualComponent } from '../../model';
import { DevUIElementRef } from '../dev-ui-ref';
import { OverlayService, OverlayZIndex } from '../overlay-adapter';
import { OverlayPositionBuilderService } from '../overlay-position';
import { View } from '../../definitions';
import { HoverHighlightComponent } from './hover-highlight.component';
import { ElementsMap } from '../click-select/click-select.service';
import { findParentComponent } from '../drag-drop/components-util';
import { HoverHighlightContext } from './hover-highlight-context';
import { RenderState } from '../../state/render-state.service';

class HoverHighlightElementRef implements DevUIElementRef {
  private destroy$ = new Subject();
  private ref: OverlayRef;
  private componentRef: ComponentRef<HoverHighlightComponent>;

  private get el(): HTMLElement {
    return this.virtualComponent.view.element.nativeElement;
  }

  constructor(
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private renderState: RenderState,
    private virtualComponent: VirtualComponent
  ) {
    this.show();
  }

  dispose() {
    this.destroy$.next();
    if (this.ref) {
      this.ref.dispose();
    }
  }

  update() {
    if (!this.ref || !this.ref.hasAttached()) {
      return;
    }

    this.ref.updatePosition();
  }

  private show() {
    this.ref = this.createOverlay(this.virtualComponent);
    this.componentRef = this.ref.attach(new NbComponentPortal(HoverHighlightComponent));
    this.disablePointerEvents();
    this.patchInstanceWithData();
    this.ref.updatePosition();
  }

  private createOverlay(virtualComponent: VirtualComponent) {
    const { view } = virtualComponent;
    const positionStrategy = this.createPositionStrategy(view);

    return this.overlay.create({
      positionStrategy,
      rootType: virtualComponent.rootType,
      overlayClass: OverlayZIndex.z1001,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private createPositionStrategy<T>(view: View<T>): PositionStrategy {
    return this.overlayPositionBuilder.flexibleConnectedTo(view.element).withPositions([
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top'
      }
    ]);
  }

  private patchInstanceWithData() {
    this.componentRef.instance.width = this.el.offsetWidth;
    this.componentRef.instance.height = this.el.offsetHeight;
    this.componentRef.instance.virtualComponent = this.virtualComponent;
    this.componentRef.changeDetectorRef.detectChanges();
  }

  private disablePointerEvents() {
    (<any>this.ref)._togglePointerEvents(false);
  }
}

@Injectable()
export class HoverHighlightService {
  private readonly document: Document;

  constructor(
    private state: RenderState,
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private hoverHighlightContext: HoverHighlightContext,
    @Inject(NB_DOCUMENT) document
  ) {
    this.document = document;
  }

  attach(
    selectedComponents$: Observable<VirtualComponent[]>,
    elementsMap$: Observable<ElementsMap>,
    attachedComponents$: Observable<VirtualComponent[]>
  ): void {
    const hover$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'mouseover').pipe(
      withLatestFrom(this.state.showDevUI$),
      filter(([_, showDevUI]) => showDevUI),
      map(([event]) => event)
    );

    const leaveDocument$: Observable<null> = fromEvent(this.document, 'mouseleave').pipe(mapTo(null));

    const hoverHighlightedComponents$: Observable<VirtualComponent> = combineLatest([hover$, elementsMap$]).pipe(
      map(([e, elementsMap]: [MouseEvent, ElementsMap]) => this.getHoveredComponent(e, elementsMap)),
      filter((virtualComponent: VirtualComponent) => !!virtualComponent)
    );

    const dynamicallyHighlightedComponents$: Observable<VirtualComponent> = combineLatest([
      attachedComponents$,
      this.state.hoveredComponentId$
    ]).pipe(
      map(([components, id]: [VirtualComponent[], string]) => {
        return components.find((virtualComponent: VirtualComponent) => virtualComponent.component.id === id);
      })
    );

    const componentsToHighlight$: Observable<VirtualComponent> = merge(
      hoverHighlightedComponents$,
      dynamicallyHighlightedComponents$
    );

    const notSelectedComponentsOnly$: Observable<VirtualComponent> = combineLatest([
      componentsToHighlight$,
      selectedComponents$
    ]).pipe(
      map(([component, selected]: [VirtualComponent, VirtualComponent[]]) => {
        return selected.includes(component) ? null : component;
      })
    );

    const res$: Observable<VirtualComponent | null> = merge(notSelectedComponentsOnly$, leaveDocument$).pipe(
      distinctUntilChanged()
    );

    const componentHighlightIfDevUIEnabled$: Observable<VirtualComponent | null> = combineLatest([
      this.hoverHighlightContext.disabled$,
      res$
    ]).pipe(
      map(([disabled, res]) => {
        if (disabled) {
          return null;
        }

        return res;
      })
    );

    componentHighlightIfDevUIEnabled$
      .pipe(
        map((virtualComponent: VirtualComponent) => this.createDevUI(virtualComponent)),
        startWith(null),
        pairwise(),
        map(([prev]: [DevUIElementRef, DevUIElementRef]) => prev),
        filter((ref: DevUIElementRef) => !!ref),
        tap((ref: DevUIElementRef) => ref.dispose())
      )
      .subscribe();
  }

  private getHoveredComponent(e: MouseEvent, elementsMap: ElementsMap): VirtualComponent {
    const parentElement: HTMLElement = findParentComponent(e.target as HTMLElement, elementsMap, true);
    return elementsMap.get(parentElement);
  }

  private createDevUI(virtualComponent: VirtualComponent): DevUIElementRef {
    if (!virtualComponent) {
      return null;
    }

    return new HoverHighlightElementRef(this.overlay, this.overlayPositionBuilder, this.state, virtualComponent);
  }
}
