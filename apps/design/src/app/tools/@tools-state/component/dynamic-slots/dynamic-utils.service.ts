import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { UpdateStr } from '@ngrx/entity/src/models';
import { OvenBreakpointStyles } from '@common';
import { map, mergeMap, take } from 'rxjs/operators';

import {
  getRootSlotComponent,
  getSlotComponentList,
  getSubComponentIds
} from '@tools-state/component/component.selectors';
import { Slot } from '@tools-state/slot/slot.model';
import { BakeryComponent } from '@tools-state/component/component.model';
import { ComponentActions } from '@tools-state/component/component.actions';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { fromTools } from '@tools-state/tools.reducer';
import { InstanceCreationHelper } from '@tools-state/util/instance-creation.helper';

@Injectable({ providedIn: 'root' })
export class DynamicUtilsService {
  constructor(private store: Store<fromTools.State>, private stateHelper: InstanceCreationHelper) {
  }

  removeSlot(slot: Slot): Observable<Action[]> {
    return this.store.pipe(
      select(getSlotComponentList, slot.id),
      take(1),
      mergeMap((componentList: BakeryComponent[]) => {
        const componentIdList = componentList.map((component: BakeryComponent) => component.id);
        return this.store.pipe(select(getSubComponentIds, { componentIdList, slotIdList: [slot.id] }), take(1));
      }),
      map(idsToRemove => [
        new ComponentActions.RemoveComponentList(idsToRemove.componentIdList),
        new SlotActions.RemoveSlotList(idsToRemove.slotIdList)
      ])
    );
  }

  selectSlotSpace(slot: Slot): Observable<BakeryComponent> {
    return this.store.pipe(select(getRootSlotComponent, slot.id), take(1));
  }

  createSlot(componentId: string, slotName: string, styles?: OvenBreakpointStyles): Observable<Action[]> {
    const slot = this.stateHelper.createComponentSlot(componentId, slotName);
    return this.stateHelper.createSpace(slot.id, styles).pipe(
      map((space: BakeryComponent) => {
        const spaceSlot = this.stateHelper.createComponentSlot(space.id);
        return [
          new SlotActions.AddSlot(slot),
          new ComponentActions.AddComponent(space),
          new SlotActions.AddSlot(spaceSlot)
        ];
      })
    );
  }

  determineCommonUpdate(slotList: Slot[], update: UpdateStr<BakeryComponent>) {
    const options = update.changes.properties && update.changes.properties.options;
    if (!options || options.length === slotList.length) {
      return of([]);
    }
    if (options.length > slotList.length) {
      const newOption = options[options.length - 1];
      return this.createSlot(update.id, newOption.id);
    }
    if (options.length < slotList.length) {
      const removedSlot = slotList.find(slot => !options.find(option => option.id === slot.name));
      return this.removeSlot(removedSlot);
    }
  }
}
