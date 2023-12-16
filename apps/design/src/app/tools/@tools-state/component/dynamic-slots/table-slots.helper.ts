import { Injectable } from '@angular/core';
import { UpdateStr } from '@ngrx/entity/src/models';
import { forkJoin, Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { map, mergeMap, switchMap } from 'rxjs/operators';

import { Slot } from '@tools-state/slot/slot.model';
import { BakeryComponent, BakeryStyles } from '@tools-state/component/component.model';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { ComponentActions } from '@tools-state/component/component.actions';
import { DynamicUtilsService } from '@tools-state/component/dynamic-slots/dynamic-utils.service';
import { InstanceCreationHelper } from '@tools-state/util/instance-creation.helper';

@Injectable({ providedIn: 'root' })
export class TableSlotsHelper {
  constructor(private dynamicUtils: DynamicUtilsService, private stateHelper: InstanceCreationHelper) {
  }

  determineUpdate(slotList: Slot[], update: UpdateStr<BakeryComponent>): Observable<Action[]> {
    const resultActions = [];
    const columns = update.changes.properties.columns;
    const rows = update.changes.properties.rows;
    // Collect cells
    const cells = rows
      .map(row => {
        return row.cells.filter(cell => cell.id.startsWith('cell'));
      })
      .flat();

    const slotsToChangeAmount = columns.length + cells.length;
    if (!columns || !cells || slotsToChangeAmount === slotList.length) {
      return of([]);
    }

    // Get `header` and `cell` slots
    const columnSlots = slotList.filter((header: Slot) => header.name.startsWith('header'));
    const cellSlots = slotList.filter((row: Slot) => row.name.startsWith('cell'));

    // Creating new column
    if (columns.length > columnSlots.length) {
      const createColumnAction = this.handleCreatingColumn(columns, update, columnSlots);
      resultActions.push(createColumnAction);
    }

    // Removing column
    if (columns.length < columnSlots.length) {
      const removeColumnAction = this.handleRemovingColumn(columns, columnSlots);
      resultActions.push(removeColumnAction);
    }

    // Creating new cells
    if (cells.length > cellSlots.length) {
      const columnsLength = columns.length;
      const isNewColumn = columnsLength > columnSlots.length;

      const createCellActions = this.handleCreatingCells(cells, cellSlots, update, isNewColumn, columnsLength);
      resultActions.push(...createCellActions);
    }

    // Removing cells
    if (cells.length < cellSlots.length) {
      const removeCellActions = this.handleRemovingCells(cells, cellSlots);
      resultActions.push(...removeCellActions);
    }

    return forkJoin(...resultActions).pipe(
      map(resultArrays => resultArrays.flat()),
      mergeMap((actions: Action[]) => {
        const addActions = actions.filter(action => action.type === ComponentActions.ActionTypes.AddComponent);
        return this.stateHelper
          .addComponentsUniqueName(addActions.map((action: ComponentActions.AddComponent) => action.component))
          .pipe(
            map(components => {
              for (let i = 0; i < components.length; i++) {
                addActions[i]['component'] = components[i];
              }
              return actions;
            })
          );
      })
    );
  }

  private handleCreatingColumn(columns, update, columnSlots): Observable<Action[]> {
    const columnsLength = columns.length - 1;
    const newColumn = columns[columnsLength];
    const slot = this.stateHelper.createComponentSlot(update.id, newColumn.id);

    // Put `space` with `text` insideAction[]
    return this.getStylesPreviousHeaderCell(columns, columnSlots).pipe(
      mergeMap(styles => this.stateHelper.createSpace(slot.id, styles)),
      mergeMap((space: BakeryComponent) => {
        const spaceSlot: Slot = this.stateHelper.createComponentSlot(space.id);
        // We need to put `text` component into created space slot
        return forkJoin({
          parentCmp: of(space),
          parentSlot: of(spaceSlot),
          heading: this.stateHelper.createText(spaceSlot.id, { text: `Header ${columnsLength}`, type: 'subtitle' })
        });
      }),
      mergeMap(({ parentCmp, parentSlot, heading }) => {
        return of([
          new SlotActions.AddSlot(slot),
          new ComponentActions.AddComponent(parentCmp),
          new SlotActions.AddSlot(parentSlot),
          new ComponentActions.AddComponent(heading)
        ]);
      })
    );
  }

  private handleRemovingColumn(columns, columnSlots): Observable<Action[]> {
    const removedColumn = columnSlots.find(slot => !columns.find(option => option.id === slot.name));
    return this.dynamicUtils.removeSlot(removedColumn);
  }

  handleCreatingCells(cells, cellSlots, update, isNewColumn: boolean, columnsLength: number): Observable<Action[]>[] {
    const oldCells = cellSlots.map(item => item.name);

    return cells
      .map((cell, index) => {
        // we cannot filter as we need original index
        if (oldCells.includes(cell.id)) {
          return null;
        }
        const styles$ = isNewColumn
          ? this.getStylesForSameRowCell(cells, cellSlots, index)
          : this.getStylesForSameColumnCell(cells, cellSlots, index, columnsLength);

        return styles$.pipe(
          switchMap(styles => {
            return this.dynamicUtils.createSlot(update.id, cell.id, styles);
          })
        );
      })
      .filter(action => !!action);
  }

  private handleRemovingCells(cells, cellSlots): Observable<Action[]>[] {
    const cellsToDelete = cellSlots.filter(cell => {
      return !cells.map(item => item.id).includes(cell.name);
    });

    return cellsToDelete.map(cell => this.dynamicUtils.removeSlot(cell));
  }

  private getStylesPreviousHeaderCell(columns, columnSlots: Slot[]) {
    // this should be a column header cell "to the left" of current cell index
    const cell = columns[columns.length - 2];

    return this.resolveCellSpaceStyles(columnSlots, cell);
  }

  private getStylesForSameColumnCell(cells, cellSlots: Slot[], index: number, columnsLength: number) {
    // this should be a cell "on top" of current cell index
    const cell = cells[index - columnsLength];

    return this.resolveCellSpaceStyles(cellSlots, cell);
  }

  private getStylesForSameRowCell(cells, cellSlots: Slot[], index: number) {
    // this should be a cell "to the left" of current cell index
    const cell = cells[index - 1];

    return this.resolveCellSpaceStyles(cellSlots, cell);
  }

  private resolveCellSpaceStyles(slots: Slot[], cell): Observable<BakeryStyles> {
    const result = slots.find(slot => slot.name === cell.id);
    return this.resolveSpaceStyles(result);
  }

  private resolveSpaceStyles(slot: Slot): Observable<BakeryStyles> {
    if (slot) {
      return this.dynamicUtils.selectSlotSpace(slot).pipe(map(component => component.styles));
    }
    return of({});
  }
}
