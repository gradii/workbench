import { Injectable, IterableDiffer, IterableDiffers } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable } from 'rxjs';
import { filter, map, pairwise, shareReplay, withLatestFrom } from 'rxjs/operators';
import { onlyLatestFrom } from '@common';

import { VirtualComponent } from '../model';
import { RenderState } from '../state/render-state.service';
import { ElementsMap } from './click-select/click-select.service';
import { BakeRes, NOOP_BAKE_RES } from '../renderer/component.service';
import {
  CreateIterableChanges,
  DeleteIterableChanges,
  DevUIIterableChanges,
  UpdateIterableChanges
} from './dev-ui-iterable-changes';

@Injectable({ providedIn: 'root' })
export class DevUIStateService {
  private pageComponents$: BehaviorSubject<BakeRes> = new BehaviorSubject(NOOP_BAKE_RES);
  private headerComponents$: BehaviorSubject<BakeRes> = new BehaviorSubject(NOOP_BAKE_RES);
  private sidebarComponents$: BehaviorSubject<BakeRes> = new BehaviorSubject(NOOP_BAKE_RES);

  private updates$: Observable<DevUIIterableChanges> = merge(
    this.pageComponents$.pipe(map(({ updates }) => updates)),
    this.headerComponents$.pipe(map(({ updates }) => updates)),
    this.sidebarComponents$.pipe(map(({ updates }) => updates))
  ).pipe(map((updates: VirtualComponent[]) => new UpdateIterableChanges(updates)));

  readonly attachedComponents$: Observable<VirtualComponent[]> = combineLatest([
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

  readonly selectedComponents$: Observable<VirtualComponent[]> = this.createSelectedComponents();

  private selectedComponentsDiffer: IterableDiffer<VirtualComponent>;

  private changes$: Observable<DevUIIterableChanges> = this.selectedComponents$.pipe(
    map((selectedComponents: VirtualComponent[]) => this.selectedComponentsDiffer.diff(selectedComponents)),
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
    onlyLatestFrom(this.selectedComponents$),
    map(selected => new CreateIterableChanges(selected))
  );

  private delete$: Observable<DevUIIterableChanges> = this.hideDevUI$.pipe(
    onlyLatestFrom(this.selectedComponents$),
    map(selected => new DeleteIterableChanges(selected))
  );

  readonly selectedChanges$: Observable<DevUIIterableChanges> = merge(
    this.changes$,
    this.updates$,
    this.delete$,
    this.create$
  ).pipe(shareReplay());

  readonly elementsMap$: Observable<ElementsMap> = this.createElementsMap();

  constructor(private state: RenderState, differs: IterableDiffers) {
    this.installSelectedComponentsDiffer(differs);
  }

  setPageComponents(bakeRes: BakeRes): void {
    this.pageComponents$.next(bakeRes);
  }

  setHeaderComponents(bakeRes: BakeRes): void {
    this.headerComponents$.next(bakeRes);
  }

  setSidebarComponents(bakeRes: BakeRes): void {
    this.sidebarComponents$.next(bakeRes);
  }

  private createSelectedComponents(): Observable<VirtualComponent[]> {
    return combineLatest([this.attachedComponents$, this.state.activeComponentIdList$]).pipe(
      map(([virtualComponents, activeIds]: [VirtualComponent[], string[]]) => {
        return virtualComponents.filter((comp: VirtualComponent) => activeIds.includes(comp.component.id));
      })
    );
  }

  private createElementsMap(): Observable<ElementsMap> {
    return this.attachedComponents$.pipe(
      map((components: VirtualComponent[]) => {
        const entries: [HTMLElement, VirtualComponent][] = components.map((component: VirtualComponent) => {
          return [component.view.element.nativeElement, component];
        });

        return new Map(entries);
      })
    );
  }

  private installSelectedComponentsDiffer(differs: IterableDiffers): void {
    const differFactory = differs.find([]);
    this.selectedComponentsDiffer = differFactory.create(this.selectedComponentsTrackByFunction);
  }

  private selectedComponentsTrackByFunction(_index: number, virtualComponent: VirtualComponent) {
    return virtualComponent.component.id;
  }
}
