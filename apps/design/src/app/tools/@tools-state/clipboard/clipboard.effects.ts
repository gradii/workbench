import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { combineWith, onlyLatestFrom, PasteSyncReason, StoreItem } from '@common';

import { fromTools } from '@tools-state/tools.reducer';
import { ComponentNameService } from '@tools-state/component/component-name.service';
import { getSlotById, getSlotByParentId } from '@tools-state/slot/slot.selectors';
import { ClipboardActions } from '@tools-state/clipboard/clipboard.actions';
import { BakeryComponent } from '@tools-state/component/component.model';
import { Slot } from '@tools-state/slot/slot.model';
import {
  ComponentSubEntities,
  getActiveComponentList,
  getClosestSpaceSlotByComponent,
  getSlotComponents,
  getSubEntitiesByComponentList,
  isRootComponent
} from '@tools-state/component/component.selectors';
import { Clipboard, ClipboardContext } from '@tools-state/clipboard/clipboard';
import { CopierService } from '@tools-state/util/copier.service';
import { ComponentHelper } from '@tools-state/util/component.helper';
import { RemapperService } from '@tools-state/util/remapper.service';
import { ComponentActions } from '@tools-state/component/component.actions';
import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { ImageActions } from '@tools-state/image/image.actions';
import { StoreItemActions } from '@tools-state/data/store-item/store-item.actions';

@Injectable()
export class ClipboardEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromTools.State>,
    private componentNameService: ComponentNameService,
    private componentHelper: ComponentHelper,
    private copierService: CopierService,
    private componentFacade: ComponentFacade,
    private remapperService: RemapperService,
    private clipboard: Clipboard
  ) {
  }

  @Effect()
  paste = this.actions$.pipe(
    ofType(ClipboardActions.ActionTypes.Paste),
    mergeMap((paste: any) => this.clipboard.extractContextFromClipboardData(paste.data)),
    tap((ctx: ClipboardContext) => this.clipboard.set(ctx)),
    onlyLatestFrom(this.store.pipe(select(getActiveComponentList))),
    map((componentList: BakeryComponent[]) => componentList[componentList.length - 1]),
    mergeMap((parent: BakeryComponent) => this.getParentSlot(parent)),
    mergeMap((parentSlot: Slot) =>
      this.componentHelper.canPaste(parentSlot.id, this.clipboard.get()).pipe(
        filter((canPaste: boolean) => canPaste),
        map(() => parentSlot)
      )
    ),
    combineWith((parentSlot: Slot) => this.store.pipe(select(getSlotComponents, parentSlot.id))),
    map(([parentSlot, existingChildren]: [Slot, BakeryComponent[]]) => {
      const ctx: ClipboardContext = this.clipboard.get();
      const clonedCtx: ClipboardContext = this.copierService.clone(ctx);
      const remappedCtx: ClipboardContext = this.remapperService.remap(
        clonedCtx,
        parentSlot.id,
        existingChildren.length
      );
      return [remappedCtx, parentSlot];
    }),
    mergeMap(([remappedCtx, parentSlot]: [ClipboardContext, Slot]) => {
      const {
        componentList,
        slotList
      }: { componentList: BakeryComponent[]; slotList: Slot[] } = this.componentHelper.extractComponentAndSlotList(
        remappedCtx
      );
      return forkJoin({
        componentList: this.componentNameService.addComponentIndexIfNeeded(componentList),
        slotList: of(slotList),
        topLevelComponentList: of(remappedCtx.componentList),
        parentSlot: of(parentSlot)
      });
    }),
    mergeMap(
      ({
         componentList,
         slotList,
         topLevelComponentList,
         parentSlot
       }: {
        componentList: BakeryComponent[];
        slotList: Slot[];
        topLevelComponentList: BakeryComponent[];
        parentSlot: Slot;
      }) => {
        const actions = [
          ...this.componentHelper.pasteNewComponent(componentList, slotList, topLevelComponentList, parentSlot.id),
          ...this.componentHelper.sync(
            new PasteSyncReason(componentList.find((c: BakeryComponent) => c.parentSlotId === parentSlot.id).id)
          )
        ];

        const currentClipboard = this.clipboard.get();

        const error = currentClipboard.error;
        const imageSourceToUpdate = currentClipboard.imageSrc;
        const breakpoint = currentClipboard.breakpoint;

        if (error) {
          // Add error action for image upload if max size exceeded,
          // so we can show error on empty image component
          actions.push(
            new ImageActions.UpdateImageSourceError({
              error,
              compIds: [componentList[0].id]
            })
          );
        } else if (imageSourceToUpdate) {
          // Add action for image source updating if image was pasted from clipboard
          const imageUpdate = {
            image: imageSourceToUpdate.uploadUrl,
            name: imageSourceToUpdate.name,
            cmpId: componentList[0].id,
            breakpoint: breakpoint
          };
          actions.push(new ImageActions.UpdateImageSource(imageUpdate));
        }

        return actions;
      }
    )
  );

  @Effect()
  cut = this.actions$.pipe(
    ofType(ClipboardActions.ActionTypes.Cut),
    onlyLatestFrom(this.store.pipe(select(getActiveComponentList))),
    mergeMap((activeComponents: BakeryComponent[]) => this.removeRootComponents(activeComponents)),
    filter((activeComponents: BakeryComponent[]) => !!activeComponents.length),
    combineWith((componentList: BakeryComponent[]) =>
      this.store.pipe(select(getSubEntitiesByComponentList, componentList))
    ),
    // select first parent space
    combineWith(([componentList]: [BakeryComponent[], any]) => this.getParentSlot(componentList[0])),
    mergeMap(
      ([[componentList, componentSubEntitiesList], parentSlot]: [
        [BakeryComponent[], ComponentSubEntities[]],
        Slot,
      ]) => {
        return [
          ...this.componentHelper.removeCuttedComponent(componentList, componentSubEntitiesList),
          new ComponentActions.SelectComponent([parentSlot.parentComponentId]),
          ...this.componentHelper.sync()
        ];
      }
    )
  );

  @Effect({ dispatch: false })
  clear = this.actions$.pipe(
    ofType(ClipboardActions.ActionTypes.Clear),
    tap(() => this.clipboard.set(null))
  );

  private getParentSlot(component: BakeryComponent): Observable<Slot> {
    if (component.definitionId === 'space') {
      return this.store.pipe(select(getSlotByParentId, component.id), take(1));
    }
    if (component.definitionId === 'sidebar' || component.definitionId === 'header') {
      return this.store.pipe(select(getClosestSpaceSlotByComponent, component.id), take(1));
    }
    return this.store.pipe(select(getSlotById, component.parentSlotId), take(1));
  }

  private removeRootComponents(components: BakeryComponent[]): Observable<BakeryComponent[]> {
    return forkJoin(
      components.map((component: BakeryComponent) => {
        return this.store.pipe(
          select(isRootComponent, component),
          map((isRoot: boolean) => [isRoot, component]),
          take(1)
        );
      })
    ).pipe(
      map((comps: [boolean, BakeryComponent][]) => {
        return comps.filter(([isRoot]) => !isRoot).map(([_, component]) => component);
      })
    );
  }
}
