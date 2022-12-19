import { Injectable } from '@angular/core';
import { SyncReasonMsg } from '@common/public-api';
import { Action } from '@ngneat/effects/lib/actions.types';

import { ClipboardContext } from '@tools-state/clipboard/clipboard';
import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponent, onlyPageLegalComponents } from '@tools-state/component/component.model';
import { ComponentSubEntities } from '@tools-state/component/component.selectors';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { isSlotInPage } from '@tools-state/slot/slot.selectors';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ComponentHelper {
  constructor() {
  }

  extractComponentAndSlotList(copiedEntities: ClipboardContext) {
    const componentList      = copiedEntities.componentList;
    const subEntitiesList    = copiedEntities.componentSubEntitiesList;
    const componentListToAdd = [];
    const slotListToAdd      = [];
    componentList.forEach((_, i: number) => {
      componentListToAdd.push(componentList[i], ...subEntitiesList[i].componentList);
      slotListToAdd.push(...subEntitiesList[i].slotList);
    });
    return { componentList: componentListToAdd, slotList: slotListToAdd };
  }

  pasteNewComponent(
    componentListToAdd: PuffComponent[],
    slotListToAdd: PuffSlot[],
    topLevelComponentList: PuffComponent[],
    parentSlotId: string
  ): Action[] {
    return [
      ComponentActions.ShiftForwardAfterComponent(
        parentSlotId,
        componentListToAdd[0].index,
        topLevelComponentList.length
      ),
      ComponentActions.AddComponentList(componentListToAdd),
      SlotActions.AddSlotList(slotListToAdd),
      ComponentActions.SelectComponent(topLevelComponentList.map((c: PuffComponent) => c.id))
    ];
  }

  removeCuttedComponent(componentList: PuffComponent[], subEntitiesList: ComponentSubEntities[]): Action[] {
    const actionsPerComponent = componentList.map((_, i: number) => {
      const componentsIdsToRemove: string[] = subEntitiesList[i].componentList.map((comp: PuffComponent) => comp.id);
      const slotsIdsToRemove: string[]      = subEntitiesList[i].slotList.map((slot: PuffSlot) => slot.id);
      const componentIdsToRemove            = [componentList[i].id, ...componentsIdsToRemove];
      return [
        ComponentActions.RemoveComponentList(componentIdsToRemove),
        SlotActions.RemoveSlotList(slotsIdsToRemove)
      ];
    });
    return [].concat.apply([], actionsPerComponent);
  }

  canPaste(parentSlotId: string, pasted: ClipboardContext): Observable<boolean> {
    return isSlotInPage(parentSlotId).pipe(
      take(1),
      map((inPage: boolean) => {
        const pastedComponents: PuffComponent[] = this.extractComponentAndSlotList(pasted).componentList;
        const pasteIllegalComponents              =
                !inPage &&
                pastedComponents.some((component: PuffComponent) =>
                  onlyPageLegalComponents.includes(component.definitionId)
                );
        return !pasteIllegalComponents;
      })
    );
  }

  sync(syncReason?: SyncReasonMsg): Action[] {
    return [
      WorkingAreaActions.SyncState(syncReason),
      ProjectActions.UpdateProject(),
      HistoryActions.Persist()
    ];
  }
}
