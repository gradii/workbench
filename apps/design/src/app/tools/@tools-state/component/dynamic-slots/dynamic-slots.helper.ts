import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { UpdateStr } from '@ngrx/entity/src/models';
import { Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { BakeryComponent, BakeryComponentUpdate } from '@tools-state/component/component.model';
import { getComponentById } from '@tools-state/component/component.selectors';
import { fromTools } from '@tools-state/tools.reducer';
import { Slot } from '@tools-state/slot/slot.model';
import { getComponentSlotList } from '@tools-state/slot/slot.selectors';
import { TableSlotsHelper } from '@tools-state/component/dynamic-slots/table-slots.helper';
import { CardSlotsHelper } from '@tools-state/component/dynamic-slots/card-slots.helper';
import { DynamicUtilsService } from '@tools-state/component/dynamic-slots/dynamic-utils.service';

import { ListSlotsHelper } from './list-slots.helper';

// TODO rethink
// Synchronize bindings and slots
@Injectable({ providedIn: 'root' })
export class DynamicSlotsHelper {
  private requiresSlotSyncing = ['tabs', 'stepper', 'card', 'accordion', 'table', 'list'];

  constructor(
    private store: Store<fromTools.State>,
    private dynamicUtils: DynamicUtilsService,
    private cardSlotsHelper: CardSlotsHelper,
    private listSlotsHelper: ListSlotsHelper,
    private tableSlotsHelper: TableSlotsHelper
  ) {
  }

  getSyncSlotActionsIfNeeded(update: BakeryComponentUpdate) {
    return this.store.pipe(
      select(getComponentById, update.id),
      take(1),
      mergeMap((component: BakeryComponent) => {
        if (this.requiresSlotSyncing.includes(component.definitionId) && update.changes.properties) {
          return this.getSyncSlotActions(component, update);
        } else {
          return of([]);
        }
      })
    );
  }

  getSyncSlotActions(component: BakeryComponent, update: UpdateStr<BakeryComponent>): Observable<Action[]> {
    return this.store.pipe(
      select(getComponentSlotList, component.id),
      take(1),
      mergeMap((slotList: Slot[]) => {
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
