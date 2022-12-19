import { Injectable } from '@angular/core';
import { KitchenBreakpointStyles } from '@common/public-api';
import { Action } from '@ngneat/effects/lib/actions.types';
import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponent } from '@tools-state/component/component.model';

import {
  getRootSlotComponent, getSlotComponentList, getSubComponentIds
} from '@tools-state/component/component.selectors';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { InstanceCreationHelper } from '@tools-state/util/instance-creation.helper';
import { Observable, of } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DynamicUtilsService {
  constructor(private stateHelper: InstanceCreationHelper) {
  }

  removeSlot(slot: PuffSlot): Observable<Action[]> {
    return getSlotComponentList(slot.id).pipe(
      take(1),
      mergeMap((componentList: PuffComponent[]) => {
        const componentIdList = componentList.map((component: PuffComponent) => component.id);
        return getSubComponentIds({ componentIdList, slotIdList: [slot.id] }).pipe(take(1));
      }),
      map(idsToRemove => [
        ComponentActions.RemoveComponentList(idsToRemove.componentIdList),
        SlotActions.RemoveSlotList(idsToRemove.slotIdList)
      ])
    );
  }

  selectSlotSpace(slot: PuffSlot): Observable<PuffComponent> {
    return getRootSlotComponent(slot.id).pipe(take(1));
  }

  createSlot(componentId: string, slotName: string, styles?: KitchenBreakpointStyles): Observable<Action[]> {
    const slot = this.stateHelper.createComponentSlot(componentId, slotName);
    return this.stateHelper.createSpace(slot.id, styles).pipe(
      map((space: PuffComponent) => {
        const spaceSlot = this.stateHelper.createComponentSlot(space.id);
        return [
          SlotActions.AddSlot(slot),
          ComponentActions.AddComponent(space),
          SlotActions.AddSlot(spaceSlot)
        ];
      })
    );
  }

  determineCommonUpdate(slotList: PuffSlot[], update: Partial<PuffComponent>) {
    const options = update.properties && update.properties.options;
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
