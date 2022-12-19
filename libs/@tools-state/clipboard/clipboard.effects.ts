import { Injectable } from '@angular/core';
import { combineWith, onlyLatestFrom, PasteSyncReason } from '@common/public-api';
import { createEffect, ofType } from '@ngneat/effects';
import { Clipboard, ClipboardContext } from '@tools-state/clipboard/clipboard';
import { ClipboardActions } from '@tools-state/clipboard/clipboard.actions';
import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { ComponentNameService } from '@tools-state/component/component-name.service';
import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponent } from '@tools-state/component/component.model';
import {
  ComponentSubEntities, getActiveComponentList, getClosestSpaceSlotByComponent, getSlotComponents,
  getSubEntitiesByComponentList, isRootComponent
} from '@tools-state/component/component.selectors';
import { ImageActions } from '@tools-state/image/image.actions';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { getSlotById, getSlotByParentId } from '@tools-state/slot/slot.selectors';
import { ComponentHelper } from '@tools-state/util/component.helper';
import { CopierService } from '@tools-state/util/copier.service';
import { RemapperService } from '@tools-state/util/remapper.service';
import { forkJoin, Observable, of } from 'rxjs';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';

@Injectable()
export class ClipboardEffects {
  constructor(
    private componentNameService: ComponentNameService,
    private componentHelper: ComponentHelper,
    private copierService: CopierService,
    private componentFacade: ComponentFacade,
    private remapperService: RemapperService,
    private clipboard: Clipboard
  ) {
  }

  paste = createEffect((actions) => actions.pipe(
    ofType(ClipboardActions.Paste),
    mergeMap((paste: any) => this.clipboard.extractContextFromClipboardData(paste.data)),
    tap((ctx: ClipboardContext) => this.clipboard.set(ctx)),
    onlyLatestFrom(getActiveComponentList),
    map((componentList: PuffComponent[]) => componentList[componentList.length - 1]),
    mergeMap((parent: PuffComponent) => this.getParentSlot(parent)),
    mergeMap((parentSlot: PuffSlot) =>
      this.componentHelper.canPaste(parentSlot.id, this.clipboard.get()).pipe(
        filter((canPaste: boolean) => canPaste),
        map(() => parentSlot)
      )
    ),
    combineWith((parentSlot: PuffSlot) => getSlotComponents(parentSlot.id)),
    map(([parentSlot, existingChildren]: [PuffSlot, PuffComponent[]]) => {
      const ctx: ClipboardContext         = this.clipboard.get();
      const clonedCtx: ClipboardContext   = this.copierService.clone(ctx);
      const remappedCtx: ClipboardContext = this.remapperService.remap(
        clonedCtx,
        parentSlot.id,
        existingChildren.length
      );
      return [remappedCtx, parentSlot];
    }),
    mergeMap(([remappedCtx, parentSlot]: [ClipboardContext, PuffSlot]) => {
      const {
              componentList,
              slotList
            }: { componentList: PuffComponent[]; slotList: PuffSlot[] } = this.componentHelper.extractComponentAndSlotList(
        remappedCtx
      );
      return forkJoin({
        componentList        : this.componentNameService.addComponentIndexIfNeeded(componentList),
        slotList             : of(slotList),
        topLevelComponentList: of(remappedCtx.componentList),
        parentSlot           : of(parentSlot)
      });
    }),
    mergeMap(
      ({
         componentList,
         slotList,
         topLevelComponentList,
         parentSlot
       }: {
        componentList: PuffComponent[];
        slotList: PuffSlot[];
        topLevelComponentList: PuffComponent[];
        parentSlot: PuffSlot;
      }) => {
        const actions = [
          ...this.componentHelper.pasteNewComponent(componentList, slotList, topLevelComponentList, parentSlot.id),
          ...this.componentHelper.sync(
            new PasteSyncReason(componentList.find((c: PuffComponent) => c.parentSlotId === parentSlot.id).id)
          )
        ];

        const currentClipboard = this.clipboard.get();

        const error               = currentClipboard.error;
        const imageSourceToUpdate = currentClipboard.imageSrc;
        const breakpoint          = currentClipboard.breakpoint;

        if (error) {
          // Add error action for image upload if max size exceeded,
          // so we can show error on empty image component
          actions.push(
            ImageActions.UpdateImageSourceError({
              error,
              compIds: [componentList[0].id]
            })
          );
        } else if (imageSourceToUpdate) {
          // Add action for image source updating if image was pasted from clipboard
          const imageUpdate = {
            image     : imageSourceToUpdate.uploadUrl,
            name      : imageSourceToUpdate.name,
            cmpId     : componentList[0].id,
            breakpoint: breakpoint
          };
          actions.push(ImageActions.UpdateImageSource(imageUpdate));
        }

        return actions;
      }
    )
  ), { dispatch: true });

  cut = createEffect((actions) => actions.pipe(
    ofType(ClipboardActions.Cut),
    onlyLatestFrom(getActiveComponentList),
    mergeMap((activeComponents: PuffComponent[]) => this.removeRootComponents(activeComponents)),
    filter((activeComponents: PuffComponent[]) => !!activeComponents.length),
    combineWith((componentList: PuffComponent[]) =>
      getSubEntitiesByComponentList(componentList)
    ),
    // select first parent space
    combineWith(([componentList]: [PuffComponent[], any]) => this.getParentSlot(componentList[0])),
    mergeMap(
      ([[componentList, componentSubEntitiesList], parentSlot]: [
        [PuffComponent[], ComponentSubEntities[]],
        PuffSlot,
      ]) => {
        return [
          ...this.componentHelper.removeCuttedComponent(componentList, componentSubEntitiesList),
          ComponentActions.SelectComponent([parentSlot.parentComponentId]),
          ...this.componentHelper.sync()
        ];
      }
    )
  ), { dispatch: true });

  clear = createEffect((actions) => actions.pipe(
    ofType(ClipboardActions.Clear),
    tap(() => this.clipboard.set(null))
  ), { dispatch: false });

  private getParentSlot(component: PuffComponent): Observable<PuffSlot> {
    if (component.definitionId === 'space') {
      return getSlotByParentId(component.id).pipe(take(1));
    }
    if (component.definitionId === 'sidebar' || component.definitionId === 'header') {
      return getClosestSpaceSlotByComponent(component.id).pipe(take(1));
    }
    return getSlotById(component.parentSlotId).pipe(take(1));
  }

  private removeRootComponents(components: PuffComponent[]): Observable<PuffComponent[]> {
    return forkJoin(
      components.map((component: PuffComponent) => {
        return isRootComponent(component).pipe(
          map((isRoot: boolean) => [isRoot, component]),
          take(1)
        );
      })
    ).pipe(
      map((comps: [boolean, PuffComponent][]) => {
        return comps.filter(([isRoot]) => !isRoot).map(([_, component]) => component);
      })
    );
  }
}
