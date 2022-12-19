import { Overlay, ScrollDispatcher } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { combineLatest, fromEvent, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, pairwise, startWith, tap, withLatestFrom } from 'rxjs/operators';
import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { FlourElementsMap } from '../click-select/click-select.service';
import { DevUIElementRef } from '../dev-ui-ref';
import { findParentComponent } from '../drag-drop/components-util';
import { OverlayPositionBuilderService } from '../overlay-position';
import { HoverHighlightElementRef } from './hover-highlight-element-ref';
import { HoverHighlightContext } from './hover-highlight-context';


@Injectable()
export class HoverHighlightService {
  private readonly document: Document;

  constructor(
    private state: RenderState,
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private hoverHighlightContext: HoverHighlightContext,
    private _scrollDispatcher: ScrollDispatcher,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) document
  ) {
    this.document = document;
  }

  attach(
    selectedComponents$: Observable<FlourComponent[]>,
    elementsMap$: Observable<FlourElementsMap>,
    attachedComponents$: Observable<FlourComponent[]>
  ): void {
    this._ngZone.runOutsideAngular(() => {

      const hover$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'mouseover').pipe(
        withLatestFrom(this.state.showDevUI$),
        filter(([_, showDevUI]) => showDevUI),
        map(([event]) => event)
      );

      const leaveDocument$: Observable<null>  = fromEvent(this.document, 'mouseleave').pipe(mapTo(null));
      const notHoverComponent$: Subject<null> = new Subject();

      const hoverHighlightedComponents$: Observable<FlourComponent> = combineLatest([hover$, elementsMap$]).pipe(
        map(([e, elementsMap]: [MouseEvent, FlourElementsMap]) => this.getHoveredComponent(e, elementsMap)),
        filter((flourComponent: FlourComponent) => {
          if (!flourComponent) {
            notHoverComponent$.next(null);
            return false;
          }
          return true;
        })
      );

      const dynamicallyHighlightedComponents$: Observable<FlourComponent> = combineLatest([
        attachedComponents$,
        this.state.hoveredComponentId$
      ]).pipe(
        map(([components, id]: [FlourComponent[], string]) => {
          return components.find((flourComponent: FlourComponent) => flourComponent.component.id === id);
        })
      );

      const componentsToHighlight$: Observable<FlourComponent> = merge(
        hoverHighlightedComponents$,
        dynamicallyHighlightedComponents$
      );

      const notSelectedComponentsOnly$: Observable<FlourComponent> = combineLatest([
        componentsToHighlight$,
        selectedComponents$
      ]).pipe(
        map(([component, selected]: [FlourComponent, FlourComponent[]]) => {
          return selected.includes(component) ? null : component;
        })
      );

      const res$: Observable<FlourComponent | null> = merge(notSelectedComponentsOnly$, leaveDocument$, notHoverComponent$).pipe(
        distinctUntilChanged()
      );

      const componentHighlightIfDevUIEnabled$: Observable<FlourComponent | null> = combineLatest([
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
          map((flourComponent: FlourComponent) => {
            return this._ngZone.run(() => this.createDevUI(flourComponent));
          }),
          startWith(null),
          pairwise(),
          map(([prev]: [DevUIElementRef, DevUIElementRef]) => prev),
          filter((ref: DevUIElementRef) => !!ref),
          tap((ref: DevUIElementRef) => ref.dispose())
        )
        .subscribe();
    });
  }

  private getHoveredComponent(e: MouseEvent, elementsMap: FlourElementsMap): FlourComponent {
    const parentElement: HTMLElement = findParentComponent(e.target as HTMLElement, elementsMap, true);
    return elementsMap.get(parentElement);
  }

  private createDevUI(flourComponent: FlourComponent): DevUIElementRef {
    if (!flourComponent) {
      return null;
    }

    return new HoverHighlightElementRef(
      this.overlay,
      this._scrollDispatcher,
      this.overlayPositionBuilder,
      this.state,
      flourComponent
    );
  }
}
