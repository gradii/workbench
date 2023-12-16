import { Inject, Injectable, IterableChanges } from '@angular/core';
import { NB_DOCUMENT } from '@nebular/theme';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, filter, map, pairwise, startWith, tap, withLatestFrom } from 'rxjs/operators';

import { RenderState } from '../../state/render-state.service';
import { OverlayService } from '../overlay-adapter';
import { COMPONENT_META_DEFINITION, MetaDefinition } from '../../definitions/definition';
import { OverlayPositionBuilderService } from '../overlay-position';
import { VirtualComponent } from '../../model';
import { DragDropElementRef } from './drag-drop-element-ref';
import { isSpace } from '../util';
import { DevUIElementRef } from '../dev-ui-ref';
import { ElementsMap } from '../click-select/click-select.service';
import { findParentComponent } from './components-util';
import { HoverHighlightContext } from '../hover-highlight/hover-highlight-context';
import { DropContainerHighlightRendererFactoryService } from './drop-container-highlight';
import { DropPlaceholderRendererFactoryService } from './drop-placeholder-renderer.service';
import { DropPositionCalculator } from './highlight-drop-position-command';

interface DragDropBag {
  event: MouseEvent;
  virtualComponent: VirtualComponent;
}

@Injectable({ providedIn: 'root' })
export class DragDropService {
  constructor(
    @Inject(NB_DOCUMENT) private document,
    private overlay: OverlayService,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private dropPlaceholderRendererFactory: DropPlaceholderRendererFactoryService,
    private hoverHighlightContext: HoverHighlightContext,
    private state: RenderState,
    private dropContainerHighlightRendererFactory: DropContainerHighlightRendererFactoryService,
    @Inject(COMPONENT_META_DEFINITION) private componentDefinitions: MetaDefinition[],
    private dropPositionCalculator: DropPositionCalculator
  ) {
  }

  attach(
    selectedComponents$: Observable<IterableChanges<VirtualComponent>>,
    attachedComponents$: Observable<VirtualComponent[]>,
    elementsMap$: Observable<ElementsMap>
  ): void {
    const mousedown$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'mousedown').pipe(
      withLatestFrom(this.state.showDevUI$),
      filter(([_, showDevUI]) => showDevUI),
      map(([event]) => event)
    );

    const mouseup$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'mouseup');

    const componentToDrag$: Observable<DragDropBag> = mousedown$.pipe(
      withLatestFrom(elementsMap$),
      map(([event, elementsMap]) => ({
        virtualComponent: this.getHoveredComponent(event, elementsMap),
        event
      }))
    );

    const cancel$: Observable<null> = mouseup$.pipe(map(() => null));

    const component$: Observable<DragDropBag | null> = merge(componentToDrag$, cancel$);

    component$
      .pipe(
        debounceTime(200),
        map((dragDropBag: DragDropBag) => {
          if (!dragDropBag || !dragDropBag.virtualComponent) {
            return null;
          }

          const { event, virtualComponent } = dragDropBag;

          return this.createDevUI(event, virtualComponent, attachedComponents$);
        }),
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

  private createDevUI(
    event: MouseEvent,
    virtualComponent: VirtualComponent,
    attachedComponents$: Observable<VirtualComponent[]>
  ): DevUIElementRef {
    if (!isSpace(virtualComponent.parentComponent)) {
      return;
    }

    return new DragDropElementRef(
      event,
      virtualComponent,
      this.document,
      attachedComponents$,
      this.state,
      this.componentDefinitions,
      this.hoverHighlightContext,
      this.dropPlaceholderRendererFactory.create(),
      this.dropContainerHighlightRendererFactory.create(),
      this.dropPositionCalculator
    );
  }
}
