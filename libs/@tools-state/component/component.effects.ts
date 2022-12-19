import { Injectable } from '@angular/core';
import { combineWith } from '@common/public-api';
import { createEffect, ofType } from '@ngneat/effects';

import { ClipboardContext } from '@tools-state/clipboard/clipboard';
import { ComponentNameService } from '@tools-state/component/component-name.service';
import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponent } from '@tools-state/component/component.model';
import {
  ComponentSubEntities, getComponentById, getComponentSlotByComponentId, getSubEntitiesByComponentList
} from '@tools-state/component/component.selectors';
import { ComponentHelper } from '@tools-state/util/component.helper';
import { CopierService } from '@tools-state/util/copier.service';
import { RemapperService } from '@tools-state/util/remapper.service';
import { combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { PuffSlot } from '../slot/slot.model';
import { getSlotById } from '../slot/slot.selectors';

@Injectable()
export class ComponentEffects {
  constructor(
    private componentContainerService: ComponentNameService,
    private copierService: CopierService,
    private componentHelper: ComponentHelper,
    private remapperService: RemapperService
  ) {
  }

  move = createEffect(actions => actions.pipe(
      ofType(ComponentActions.MoveComponent),
      combineWith((action) => getComponentById(action.componentId)),
      combineWith(([, component]: [any, PuffComponent]) =>
        getSubEntitiesByComponentList([component])
      ),
      map(
        ([[action, component], componentSubEntitiesList]: [
          [any, PuffComponent],
          ComponentSubEntities[],
        ]) => {
          const { parentSlotId, position } = action;
          let ctx: ClipboardContext        = this.copierService.copy({
            componentList: [component],
            componentSubEntitiesList
          });

          // Change id if changing space
          const [comp] = ctx.componentList;
          if (comp.parentSlotId !== parentSlotId) {
            ctx = this.copierService.clone(ctx);
          }

          return [
            this.remapperService.remap(ctx, parentSlotId, position),
            component,
            componentSubEntitiesList,
            parentSlotId
          ];
        }
      ),
      mergeMap(
        ([remappedCtx, component, componentSubEntitiesList, parentSlotId]: [
          ClipboardContext,
          PuffComponent,
          ComponentSubEntities[],
          string,
        ]) =>
          this.componentHelper.canPaste(parentSlotId, remappedCtx).pipe(
            filter((canPaste: boolean) => canPaste),
            map(() => [remappedCtx, component, componentSubEntitiesList, parentSlotId])
          )
      ),
      mergeMap(
        ([remappedCtx, component, componentSubEntitiesList, parentSlotId]: [
          ClipboardContext,
          PuffComponent,
          ComponentSubEntities[],
          string,
        ]) => {
          const { componentList, slotList }: { componentList: PuffComponent[]; slotList: PuffSlot[] } =
                  this.componentHelper.extractComponentAndSlotList(remappedCtx);
          return [
            ...this.componentHelper.removeCuttedComponent([component], componentSubEntitiesList),
            ...this.componentHelper.pasteNewComponent(componentList, slotList, remappedCtx.componentList, parentSlotId),
            ...this.componentHelper.sync()
          ];
        }
      )
    ),
    { dispatch: true }
  );

  moveItemInArray = createEffect(actions => actions.pipe(
      ofType(ComponentActions.MoveItemInArrayComponent),
      combineWith((action) => getComponentById(action.componentId)),
      mergeMap(([action, component]: [any, PuffComponent]) => {
          return [
            ComponentActions.MoveItemInArray(action.parentSlotId, action.currentIndex, action.targetIndex),
            ComponentActions.SelectComponent([component.id]),
            ...this.componentHelper.sync()
          ];
        }
      )
    ),
    { dispatch: true }
  );

  transferItemArray = createEffect(actions => actions.pipe(
      ofType(ComponentActions.TransferArrayItemComponent),
      combineWith((action) =>
        combineLatest(
          [
            getSlotById(action.currentSlotId),
            getSlotById(action.targetSlotId)
          ]
        )
      ),
      filter((
        [action, [currentSlot, targetSlot]]: [any, [PuffSlot, PuffSlot]]) => !!currentSlot && !!targetSlot
      ),
      mergeMap((
          [
            action, [currentSlot, targetSlot]
          ]: [any, [PuffSlot, PuffSlot]]) => {
          return [
            ComponentActions.TransferArrayItem(
              action.componentId,
              currentSlot.id, targetSlot.id,
              action.currentIndex, action.targetIndex
            ),
            ComponentActions.SelectComponent([action.componentId]),
            ...this.componentHelper.sync()
          ];
        }
      )
    ),
    { dispatch: true }
  );
}

