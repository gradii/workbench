import { Injectable } from '@angular/core';
import { Action } from '@ngneat/effects/lib/actions.types';
import { PuffComponent, PuffComponentUpdate } from '@tools-state/component/component.model';
import { getComponentById } from '@tools-state/component/component.selectors';
import { CardSlotsHelper } from '@tools-state/component/dynamic-slots/card-slots.helper';
import { DynamicUtilsService } from '@tools-state/component/dynamic-slots/dynamic-utils.service';
import { TableSlotsHelper } from '@tools-state/component/dynamic-slots/table-slots.helper';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { getComponentSlotList } from '@tools-state/slot/slot.selectors';
import { Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { ListSlotsHelper } from './list-slots.helper';

// Synchronize bindings and slots
@Injectable({ providedIn: 'root' })
export class DynamicSlotsHelper {
  private requiresSlotSyncing = ['tabs', 'stepper', 'card', 'accordion', 'table', 'list'];

  constructor(
    private dynamicUtils: DynamicUtilsService,
    private cardSlotsHelper: CardSlotsHelper,
    private listSlotsHelper: ListSlotsHelper,
    private tableSlotsHelper: TableSlotsHelper
  ) {
  }

  getSyncSlotActionsIfNeeded(update: PuffComponentUpdate) {
    return getComponentById(update.id).pipe(
      take(1),
      mergeMap((component: PuffComponent) => {
        if (this.requiresSlotSyncing.includes(component.definitionId) && update.properties) {
          return this.getSyncSlotActions(component, update);
        } else {
          return of([]);
        }
      })
    );
  }

  getSyncSlotActions(component: PuffComponent, update: Partial<PuffComponent>): Observable<Action[]> {
    return getComponentSlotList(component.id).pipe(
      take(1),
      mergeMap((slotList: PuffSlot[]) => {
        switch (component.definitionId) {
          case 'tabs':
            return this.dynamicUtils.determineCommonUpdate(slotList, update);
          case 'stepper':
            return this.dynamicUtils.determineCommonUpdate(slotList, update);
          case 'card':
            return this.cardSlotsHelper.determineUpdate(slotList, update);
          case 'accordion':
            return this.dynamicUtils.determineCommonUpdate(slotList, update);
          case 'list':
            return this.listSlotsHelper.determineUpdate(slotList, update);
          case 'table':
            return this.tableSlotsHelper.determineUpdate(slotList, update);
          default:
            return of([]);
        }
      })
    );
  }
}
