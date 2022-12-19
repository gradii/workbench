import { fromEvent, Observable, of, Subject } from 'rxjs';
import {
  distinctUntilChanged, filter, map, mergeMap, switchMap, take, takeUntil, tap, withLatestFrom
} from 'rxjs/operators';

import { MetaDefinition } from '../../definitions/definition';
import { resolveHTMLElement } from '../../definitions/view-util';
import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { DevUIElementRef } from '../dev-ui-ref';
import { HoverHighlightContext } from '../hover-highlight/hover-highlight-context';
import { inHeader, inPage, inSidebar, isLayoutElement, isSpace } from '../util';
import { findParentComponent } from './components-util';
import { DropContainerHighlightRenderer } from './drop-container-highlight';
import { DropPlaceholderRenderer } from './drop-placeholder-renderer.service';
import { DropPositionCalculator, HighlightDropPositionCommand } from './highlight-drop-position-command';
import { ThumbRenderer } from './thumb-renderer.service';

/**
 * @deprecated
 */
export class DragDropElementRef implements DevUIElementRef {
  private destroyed$ = new Subject<void>();

  private element$: Observable<HTMLElement> = resolveHTMLElement(this.virtualComponent).pipe(
    takeUntil(this.destroyed$)
  );

  // Put all rendered project components in set to perform fast lookups
  // New elements can't be added to the project during drugging
  // so we can look through this set safely
  private projectComponents: Map<HTMLElement, FlourComponent>;
  private lastCommand: HighlightDropPositionCommand;
  private thumbRenderer: ThumbRenderer;

  constructor(
    private event: MouseEvent,
    private virtualComponent: FlourComponent,
    private document: Document,
    private attachedComponents$: Observable<FlourComponent[]>,
    private renderState: RenderState,
    private componentDefinitions: MetaDefinition[],
    private hoverHighlightContext: HoverHighlightContext,
    private dropPlaceholderRenderer: DropPlaceholderRenderer,
    private dropContainerHighlightRenderer: DropContainerHighlightRenderer,
    private dropPositionCalculator: DropPositionCalculator
  ) {
    // this.handleDragDrop(event);
  }

  private get draggable$(): Observable<boolean> {
    if (this.virtualComponent.view.draggable$) {
      return this.virtualComponent.view.draggable$;
    }

    return of(true);
  }

  dispose() {
    this.stopDrag();
    this.destroyed$.next();
    this.destroyed$.complete();
    this.dropPlaceholderRenderer.dispose();
    this.dropContainerHighlightRenderer.dispose();
  }

  update() {
  }

  private handleDragDrop(event: MouseEvent) {
    const down$ = this.createDragStartStream(event);

    const move$ = this.createMoveStream();

    down$
      .pipe(
        withLatestFrom(this.draggable$),

        // Handle drag & drop only if it enabled for that element now
        filter(([_, enabled]) => enabled),
        mergeMap(() => move$),
        takeUntil(this.destroyed$)
      )
      .subscribe((command: HighlightDropPositionCommand) => this.highlightDropPosition(command));
  }

  private createDragStartStream(event: MouseEvent): Observable<void> {
    const mouseup$ = fromEvent<MouseEvent>(this.document, 'mouseup').pipe(
      tap(e => e.stopPropagation()),
      tap(() => this.hoverHighlightContext.setDisabled(false)),
      takeUntil(this.destroyed$)
    );

    return this.element$.pipe(
      switchMap((el: HTMLElement) =>
        of(event).pipe(
          tap(e => e.stopPropagation()),
          map((e: MouseEvent) => [el, e]),

          // Cancel drag & drop if user released the mouse
          takeUntil(mouseup$)
        )
      ),
      withLatestFrom(this.attachedComponents$),
      tap(([[el, e], attachedComponents]: [[HTMLElement, MouseEvent], FlourComponent[]]) => {
        // Calculate HTMLElement -> VirtualComponent map to perform fast lookups during drag & drop
        this.initProjectComponentsMap(attachedComponents);
      }),

      // That stream doesn't need to output anything, that's why just map it to the void value
      map(() => {
      })
    );
  }

  private createMoveStream(): Observable<HighlightDropPositionCommand> {
    const mouseup$ = fromEvent<MouseEvent>(this.document, 'mouseup');
    return this.element$.pipe(
      switchMap((el: HTMLElement) => fromEvent(this.document, 'mousemove').pipe(map((e: MouseEvent) => [el, e]))),
      map(([el, e]: [HTMLElement, MouseEvent]) => {
        if (!this.thumbRenderer) {
          this.hoverHighlightContext.setDisabled(true);
          // Render thumb for the first time only on first cursor movement
          this.drawThumb(e);
          this.dimElement();
          this.document.body.style.cursor     = 'grabbing';
          this.document.body.style.userSelect = 'none';
        } else {
          // Otherwise just update thumb position
          this.thumbRenderer.update(e);
        }
        return this.dropPositionCalculator.create(el, e, this.projectComponents, this.thumbRenderer.getThumbRect());
      }),
      filter(command => {
        if (!command || isLayoutElement(command.vc)) {
          return false;
        } else if (inPage(command.vc)) {
          return true;
        }
        const componentMeta: MetaDefinition = this.componentDefinitions.find(
          (d: MetaDefinition) => d.definition.id === this.virtualComponent.component.definitionId
        );
        if (inHeader(command.vc)) {
          return componentMeta.headerSupport;
        }
        if (inSidebar(command.vc)) {
          return componentMeta.sidebarSupport;
        }
      }),

      // We don't need to redraw drop placeholder if target element and placeholder position didn't change
      distinctUntilChanged((c1: HighlightDropPositionCommand, c2: HighlightDropPositionCommand) => {
        return c1.vc === c2.vc && c1.position === c2.position && c1.relativePosition === c2.relativePosition;
      }),

      takeUntil(mouseup$)
    );
  }

  private stopDrag(): void {
    this.document.body.style.cursor     = 'auto';
    this.document.body.style.userSelect = 'auto';

    this.dropPlaceholderRenderer.clear();
    this.dropContainerHighlightRenderer.clear();

    if (this.lastCommand) {
      this.move(this.lastCommand);
    }

    this.lightenElement();

    this.lastCommand = null;

    // In case a user pressed the element but didn't move mouse yet
    // we may have no thumb rendered
    if (this.thumbRenderer) {
      this.thumbRenderer.clear();
      this.thumbRenderer = null;
    }
  }

  private drawThumb(e: MouseEvent) {
    this.element$.pipe(take(1)).subscribe((el: HTMLElement) => {
      const target: HTMLElement = findParentComponent(el, this.projectComponents, true);
      this.thumbRenderer        = new ThumbRenderer(target);
      this.thumbRenderer.update(e);
    });
  }

  private initProjectComponentsMap(attachedComponents: FlourComponent[]) {
    this.projectComponents = new Map();

    for (const vc of attachedComponents) {
      this.projectComponents.set(vc.view.element.nativeElement, vc);
    }
  }

  private highlightDropPosition(command: HighlightDropPositionCommand) {
    this.dropPlaceholderRenderer.draw(command);
    this.dropContainerHighlightRenderer.draw(command);
    this.lastCommand = command;
  }

  private move(lastCommand: HighlightDropPositionCommand) {
    const { vc, position, relativePosition } = lastCommand;
    const index                              = position === 'left' || position === 'top' ? vc.index : vc.index + 1;

    if (isSpace(vc)) {
      if (relativePosition === 'inside') {
        this.moveIntoSpace(vc);
      } else {
        this.moveNearComponent(vc, index);
      }
    } else {
      this.moveNearComponent(vc, index);
    }

    if (this.movingToSameSpace(vc)) {
      this.lightenElement();
    }
  }

  private needToDecIndex(vc1: FlourComponent, vc2: FlourComponent, index: number): boolean {
    const sameSlot     = vc1.parentSlot.id === vc2.parentSlot.id;
    const lastElement  = index === vc2.parentSlot.componentList.length;
    const movedFurther = vc1.index < vc2.index;

    return sameSlot && (lastElement || movedFurther);
  }

  private moveIntoSpace(targetSpace: FlourComponent) {
    if (this.movingToSamePlaceIntoSpace(targetSpace)) {
      this.lightenElement();
      return;
    }

    this.renderState.move(
      this.virtualComponent,
      targetSpace.component.slots['content'].id,
      targetSpace.component.slots['content'].componentList.length
    );
  }

  private moveNearComponent(targetComponent: FlourComponent, index: number) {
    // In case if we're moving component in the same slot we need to decrease index
    // when component moved to the position with bigger index than before.
    if (this.needToDecIndex(this.virtualComponent, targetComponent, index)) {
      index -= 1;
    }

    if (this.movingToSamePlaceNearComponent(targetComponent, index)) {
      this.lightenElement();
      return;
    }

    this.renderState.move(this.virtualComponent, targetComponent.parentSlot.id, index);
  }

  private movingToSamePlaceIntoSpace(targetSpace: FlourComponent): boolean {
    return this.virtualComponent.parentSlot.id === targetSpace.component.slots['content'].id;
  }

  private movingToSamePlaceNearComponent(targetComponent: FlourComponent, index: number): boolean {
    const sameSlot     = this.virtualComponent.parentSlot.id === targetComponent.parentSlot.id;
    const samePosition = this.virtualComponent.index === index;

    return sameSlot && samePosition;
  }

  private movingToSameSpace(space: FlourComponent): boolean {
    if (isSpace(space)) {
      return this.virtualComponent.parentSlot.id === space.component.slots['content'].id;
    }

    return this.virtualComponent.parentSlot.id === space.parentSlot.id;
  }

  private dimElement() {
    this.setOpacity(0.3);
  }

  private lightenElement() {
    this.setOpacity(1);
  }

  private setOpacity(opacity: number) {
    this.element$.pipe(take(1)).subscribe((el: HTMLElement) => {
      el.style.opacity = `${opacity}`;
    });
  }
}
