import { Inject, Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { NB_DOCUMENT } from '@nebular/theme';
import { debounceTime, filter, map, withLatestFrom } from 'rxjs/operators';

import { VirtualComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { findParentComponent } from '../drag-drop/components-util';

export type ElementsMap = Map<HTMLElement, VirtualComponent>;

interface SelectBag {
  virtualComponent: VirtualComponent;
  multi: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClickSelectService {
  private readonly document: Document;

  constructor(private state: RenderState, @Inject(NB_DOCUMENT) document) {
    this.document = document;
  }

  attach(elementsMap$: Observable<ElementsMap>): void {
    const click$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'click').pipe(
      withLatestFrom(this.state.showDevUI$),
      filter(([_, showDevUI]) => showDevUI),
      map(([event]) => event)
    );

    const select$: Observable<SelectBag> = click$.pipe(
      debounceTime(100),
      withLatestFrom(elementsMap$),
      map(([e, elementsMap]: [MouseEvent, ElementsMap]) => {
        return this.createSelectBag(e, elementsMap);
      }),

      // Prevent selection attempts of not bakery elements aka devui
      filter(({ virtualComponent }) => !!virtualComponent)
    );

    select$.subscribe(selectBag => this.selectComponent(selectBag));
  }

  private createSelectBag(e: MouseEvent, elementsMap: ElementsMap): SelectBag {
    const multi: boolean = this.isMultiSelect(e);
    const virtualComponent: VirtualComponent = this.getSelectedComponent(e, elementsMap);

    return { virtualComponent, multi };
  }

  private selectComponent(selectBag: SelectBag): void {
    const { virtualComponent, multi } = selectBag;
    this.state.select(virtualComponent, multi);
  }

  private isMultiSelect(e: MouseEvent): boolean {
    return e.ctrlKey || e.metaKey;
  }

  private getSelectedComponent(e: MouseEvent, elementsMap: ElementsMap): VirtualComponent {
    const parentElement: HTMLElement = findParentComponent(e.target as HTMLElement, elementsMap, true);
    return elementsMap.get(parentElement);
  }
}
