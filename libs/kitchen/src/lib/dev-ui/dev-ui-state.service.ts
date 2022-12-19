import { Injectable, IterableDiffer, IterableDiffers } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable } from 'rxjs';
import { filter, map, pairwise, shareReplay, withLatestFrom } from 'rxjs/operators';
import { onlyLatestFrom } from '@common/public-api';

import { FlourComponent } from '../model';
import { RenderState } from '../state/render-state.service';
import { ElementsMap, FlourElementsMap } from './click-select/click-select.service';
import { CookFlourRes, CookRes, NOOP_BAKE_RES } from '../renderer/component.service';
import {
  CreateIterableChanges,
  DeleteIterableChanges,
  DevUIIterableChanges,
  UpdateIterableChanges
} from './dev-ui-iterable-changes';

@Injectable(/*{ providedIn: 'root' }*/)
export class DevUIStateService {

  private flourComponent$ = new BehaviorSubject<CookFlourRes>(NOOP_BAKE_RES);

  private pageComponents$: BehaviorSubject<CookRes>    = new BehaviorSubject(NOOP_BAKE_RES);
  private headerComponents$: BehaviorSubject<CookRes>  = new BehaviorSubject(NOOP_BAKE_RES);
  private sidebarComponents$: BehaviorSubject<CookRes> = new BehaviorSubject(NOOP_BAKE_RES);

  private updates$: Observable<DevUIIterableChanges> = merge(
    this.pageComponents$.pipe(map(({ updates }) => updates)),
    this.headerComponents$.pipe(map(({ updates }) => updates)),
    this.sidebarComponents$.pipe(map(({ updates }) => updates))
  ).pipe(map((updates: FlourComponent[]) => new UpdateIterableChanges(updates)));

  readonly attachedComponents$: Observable<FlourComponent[]> = combineLatest([
    this.pageComponents$,
    this.headerComponents$,
    this.sidebarComponents$
  ]).pipe(
    map(([page, header, sidebar]) => [
      ...page.virtualComponents.values(),
      ...header.virtualComponents.values(),
      ...sidebar.virtualComponents.values()
    ])
  );

  readonly attachedFlourComponents$: Observable<FlourComponent[]> = this.flourComponent$.pipe(
    map((page) =>
      [...page.virtualComponents.values()]
    )
  );

  readonly selectedFlourComponents$: Observable<FlourComponent[]> = this.createSelectedFlourComponents();

  private selectedComponentsDiffer: IterableDiffer<FlourComponent | FlourComponent>;

  private changes$: Observable<DevUIIterableChanges> = this.selectedFlourComponents$.pipe(
    map((selectedComponents: FlourComponent[]) => this.selectedComponentsDiffer.diff(selectedComponents)),
    filter((changes: DevUIIterableChanges) => !!changes),
    withLatestFrom(this.state.showDevUI$),
    filter(([_, show]) => show),
    map(([selectedComponents]) => selectedComponents)
  );

  private showDevUI$: Observable<boolean> = this.state.showDevUI$.pipe(
    pairwise(),
    filter(([prev, curr]) => !prev && curr),
    map(([prev, curr]) => !prev && curr)
  );

  private hideDevUI$: Observable<boolean> = this.state.showDevUI$.pipe(
    pairwise(),
    filter(([prev, curr]) => prev && !curr),
    map(([prev, curr]) => prev && !curr)
  );

  private create$: Observable<DevUIIterableChanges> = this.showDevUI$.pipe(
    onlyLatestFrom(this.selectedFlourComponents$),
    map(selected => new CreateIterableChanges(selected))
  );

  private delete$: Observable<DevUIIterableChanges> = this.hideDevUI$.pipe(
    onlyLatestFrom(this.selectedFlourComponents$),
    map(selected => new DeleteIterableChanges(selected))
  );

  readonly selectedChanges$: Observable<DevUIIterableChanges> = merge(
    this.changes$,
    this.updates$,
    this.delete$,
    this.create$
  ).pipe(shareReplay());

  readonly flourElementsMap$: Observable<FlourElementsMap> = this.createFlourElementsMap();

  constructor(private state: RenderState, differs: IterableDiffers) {
    this.installSelectedComponentsDiffer(differs);
  }

  setFlourComponents(bakeRes: CookFlourRes): void {
    this.flourComponent$.next(bakeRes);
  }

  setPageComponents(bakeRes: CookRes): void {
    this.pageComponents$.next(bakeRes);
  }

  setHeaderComponents(bakeRes: CookRes): void {
    this.headerComponents$.next(bakeRes);
  }

  setSidebarComponents(bakeRes: CookRes): void {
    this.sidebarComponents$.next(bakeRes);
  }

  private createSelectedFlourComponents(): Observable<FlourComponent[]> {
    return combineLatest([this.attachedFlourComponents$, this.state.activeComponentIdList$]).pipe(
      map(([virtualComponents, activeIds]: [FlourComponent[], string[]]) => {
        return virtualComponents.filter((comp: FlourComponent) => activeIds.includes(comp.component.id));
      })
    );
  }

  private createElementsMap(): Observable<ElementsMap> {
    return this.attachedComponents$.pipe(
      map((components: FlourComponent[]) => {
        const entries: [HTMLElement, FlourComponent][] = components.map((component: FlourComponent) => {
          return [component.view.element.nativeElement, component];
        });

        return new Map(entries);
      })
    );
  }

  private createFlourElementsMap(): Observable<FlourElementsMap> {
    return this.attachedFlourComponents$.pipe(
      map((components: FlourComponent[]) => {
        const entries: [HTMLElement, FlourComponent][] = components.map((component: FlourComponent) => {
          return [component.htmlElement, component];
        });

        return new Map(entries);
      })
    );
  }

  private installSelectedComponentsDiffer(differs: IterableDiffers): void {
    const differFactory           = differs.find([]);
    this.selectedComponentsDiffer = differFactory.create(this.selectedComponentsTrackByFunction);
  }

  private selectedComponentsTrackByFunction(_index: number, virtualComponent: FlourComponent | FlourComponent) {
    return virtualComponent.component.id;
  }
}
