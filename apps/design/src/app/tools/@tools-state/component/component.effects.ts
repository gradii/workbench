import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { combineWith } from '@common';
import { filter, map, mergeMap } from 'rxjs/operators';

import { ClipboardContext } from '@tools-state/clipboard/clipboard';
import { fromTools } from '@tools-state/tools.reducer';
import { ComponentNameService } from '@tools-state/component/component-name.service';
import {
  ComponentSubEntities,
  getComponentById,
  getSubEntitiesByComponentList
} from '@tools-state/component/component.selectors';
import { BakeryComponent } from '@tools-state/component/component.model';
import { Slot } from '@tools-state/slot/slot.model';
import { ComponentActions } from '@tools-state/component/component.actions';
import { CopierService } from '@tools-state/util/copier.service';
import { ComponentHelper } from '@tools-state/util/component.helper';
import { RemapperService } from '@tools-state/util/remapper.service';

@Injectable()
export class ComponentEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromTools.State>,
    private componentContainerService: ComponentNameService,
    private copierService: CopierService,
    private componentHelper: ComponentHelper,
    private remapperService: RemapperService
  ) {
  }

  @Effect()
  move = this.actions$.pipe(
    ofType(ComponentActions.ActionTypes.MoveComponent),
    combineWith((action: ComponentActions.MoveComponent) => this.store.pipe(select(getComponentById, action.compId))),
    combineWith(([, component]: [ComponentActions.MoveComponent, BakeryComponent]) =>
      this.store.pipe(select(getSubEntitiesByComponentList, [component]))
    ),
    map(
      ([[action, component], componentSubEntitiesList]: [
        [ComponentActions.MoveComponent, BakeryComponent],
        ComponentSubEntities[],
      ]) => {
        const { parentSlotId, position } = action;
        let ctx: ClipboardContext = this.copierService.copy({
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
        BakeryComponent,
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
        BakeryComponent,
        ComponentSubEntities[],
        string,
      ]) => {
        const {
          componentList,
          slotList
        }: { componentList: BakeryComponent[]; slotList: Slot[] } = this.componentHelper.extractComponentAndSlotList(
          remappedCtx
        );
        return [
          ...this.componentHelper.removeCuttedComponent([component], componentSubEntitiesList),
          ...this.componentHelper.pasteNewComponent(componentList, slotList, remappedCtx.componentList, parentSlotId),
          ...this.componentHelper.sync()
        ];
      }
    )
  );
}
