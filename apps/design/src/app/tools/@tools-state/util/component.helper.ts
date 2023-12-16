import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { SyncReasonMsg } from '@common';

import { ClipboardContext } from '@tools-state/clipboard/clipboard';
import { ComponentActions } from '@tools-state/component/component.actions';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { BakeryComponent, onlyPageLegalComponents } from '@tools-state/component/component.model';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ComponentSubEntities } from '@tools-state/component/component.selectors';
import { Slot } from '@tools-state/slot/slot.model';
import { isSlotInPage } from '@tools-state/slot/slot.selectors';
import { fromTools } from '@tools-state/tools.reducer';

@Injectable({ providedIn: 'root' })
export class ComponentHelper {
  constructor(private store: Store<fromTools.State>) {
  }

  extractComponentAndSlotList(copiedEntities: ClipboardContext) {
    const componentList = copiedEntities.componentList;
    const subEntitiesList = copiedEntities.componentSubEntitiesList;
    const componentListToAdd = [];
    const slotListToAdd = [];
    componentList.forEach((_, i: number) => {
      componentListToAdd.push(componentList[i], ...subEntitiesList[i].componentList);
      slotListToAdd.push(...subEntitiesList[i].slotList);
    });
    return { componentList: componentListToAdd, slotList: slotListToAdd };
  }

  pasteNewComponent(
    componentListToAdd: BakeryComponent[],
    slotListToAdd: Slot[],
    topLevelComponentList: BakeryComponent[],
    parentSlotId: string
  ): Action[] {
    return [
      new ComponentActions.ShiftForwardAfterComponent(
        parentSlotId,
        componentListToAdd[0].index,
        topLevelComponentList.length
      ),
      new ComponentActions.AddComponentList(componentListToAdd),
      new SlotActions.AddSlotList(slotListToAdd),
      new ComponentActions.SelectComponent(topLevelComponentList.map((c: BakeryComponent) => c.id))
    ];
  }

  removeCuttedComponent(componentList: BakeryComponent[], subEntitiesList: ComponentSubEntities[]): Action[] {
    const actionsPerComponent = componentList.map((_, i: number) => {
      const componentsIdsToRemove: string[] = subEntitiesList[i].componentList.map((comp: BakeryComponent) => comp.id);
      const slotsIdsToRemove: string[] = subEntitiesList[i].slotList.map((slot: Slot) => slot.id);
      const componentIdsToRemove = [componentList[i].id, ...componentsIdsToRemove];
      return [
        new ComponentActions.RemoveComponentList(componentIdsToRemove),
        new SlotActions.RemoveSlotList(slotsIdsToRemove)
      ];
    });
    return [].concat.apply([], actionsPerComponent);
  }

  canPaste(parentSlotId: string, pasted: ClipboardContext): Observable<boolean> {
    return this.store.pipe(
      select(isSlotInPage, parentSlotId),
      take(1),
      map((inPage: boolean) => {
        const pastedComponents: BakeryComponent[] = this.extractComponentAndSlotList(pasted).componentList;
        const pasteIllegalComponents =
          !inPage &&
          pastedComponents.some((component: BakeryComponent) =>
            onlyPageLegalComponents.includes(component.definitionId)
          );
        return !pasteIllegalComponents;
      })
    );
  }

  sync(syncReason?: SyncReasonMsg): Action[] {
    return [
      new WorkingAreaActions.SyncState(syncReason),
      new ProjectActions.UpdateProject(),
      new HistoryActions.Persist()
    ];
  }
}
