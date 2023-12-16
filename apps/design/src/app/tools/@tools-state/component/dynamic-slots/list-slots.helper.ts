import { Injectable } from '@angular/core';
import { UpdateStr } from '@ngrx/entity/src/models';
import { Action } from '@ngrx/store';
import { ComponentActions } from '@tools-state/component/component.actions';
import { BakeryComponent } from '@tools-state/component/component.model';
import { DynamicUtilsService } from '@tools-state/component/dynamic-slots/dynamic-utils.service';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { Slot } from '@tools-state/slot/slot.model';
import { InstanceCreationHelper } from '@tools-state/util/instance-creation.helper';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ListSlotsHelper {
  constructor(private dynamicUtils: DynamicUtilsService, private stateHelper: InstanceCreationHelper) {
  }

  determineUpdate(slotList: Slot[], update: UpdateStr<BakeryComponent>): Observable<Action[]> {
    const resultActions = [];
    const rows = update.changes.properties && update.changes.properties.rows;

    if (!rows || rows.length === slotList.length) {
      return of([]);
    }
    if (rows.length > slotList.length) {
      const createRowActions = this.handleCreatingRows(rows, slotList, update);
      resultActions.push(...createRowActions);
    }
    if (rows.length < slotList.length) {
      const removeRowActions = this.handleRemovingRows(rows, slotList);
      resultActions.push(...removeRowActions);
    }

    return forkJoin(...resultActions).pipe(map(resultArrays => resultArrays.flat()));
  }

  private handleRemovingRows(rows, rowSlots: Slot[]): Observable<Action[]>[] {
    return rowSlots
      .filter(row => !rows.map(item => item.id).includes(row.name))
      .map(row => this.dynamicUtils.removeSlot(row));
  }

  private handleCreatingRows(rows, rowSlots: Slot[], update: UpdateStr<BakeryComponent>): Observable<Action[]>[] {
    return rows
      .filter(row => !rowSlots.map(item => item.name).includes(row.id))
      .map(row => this.createSlot(update.id, row.id));
  }

  private createSlot(componentId: string, slotName: string): Observable<Action[]> {
    const slot = this.stateHelper.createComponentSlot(componentId, slotName);

    return this.stateHelper.createSpace(slot.id).pipe(
      mergeMap((space: BakeryComponent) => {
        const spaceSlot: Slot = this.stateHelper.createComponentSlot(space.id);
        // We need to put `text` component into created space slot
        return forkJoin({
          parentCmp: of(space),
          parentSlot: of(spaceSlot),
          newItemText: this.stateHelper.createText(spaceSlot.id, { text: 'New item' })
        });
      }),
      mergeMap(
        ({
           parentCmp,
           parentSlot,
           newItemText
         }: {
          parentCmp: BakeryComponent;
          parentSlot: Slot;
          newItemText: BakeryComponent;
        }) => {
          return of([
            new SlotActions.AddSlot(slot),
            new ComponentActions.AddComponent(parentCmp),
            new SlotActions.AddSlot(parentSlot),
            new ComponentActions.AddComponent(newItemText)
          ]);
        }
      )
    );
  }
}
