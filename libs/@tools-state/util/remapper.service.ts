import { Injectable } from '@angular/core';
import { nextComponentId } from '@common/public-api';

import { PuffComponent } from '@tools-state/component/component.model';
import { ComponentSubEntities } from '@tools-state/component/component.selectors';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { ClipboardContext } from '@tools-state/clipboard/clipboard';

@Injectable({ providedIn: 'root' })
export class RemapperService {
  /**
   * Copy components by regenerating ids.
   * */
  copy(clipboard: ClipboardContext): ClipboardContext {
    for (let i = 0; i < clipboard.componentList.length; i++) {
      this.recalculateComponentsIds(clipboard.componentList[i], clipboard.componentSubEntitiesList[i]);
    }
    return clipboard;
  }

  remap(data: ClipboardContext, parentSlotId: string, position: number): ClipboardContext {
    for (const component of data.componentList) {
      component.parentSlotId = parentSlotId;
      component.index = position++;
    }
    return data;
  }

  private recalculateComponentsIds(rootComponent: PuffComponent, componentSubEntities: ComponentSubEntities) {
    const componentsToCheck: PuffComponent[] = [rootComponent];

    for (const component of componentsToCheck) {
      const newComponentId = nextComponentId();
      const slotsToCheck: PuffSlot[] = [];
      for (const slot of componentSubEntities.slotList) {
        if (slot.parentComponentId === component.id) {
          slot.parentComponentId = newComponentId;
          slotsToCheck.push(slot);
        }
      }

      component.id = newComponentId;

      componentsToCheck.push(...this.recalculateSlotsIds(slotsToCheck, componentSubEntities));
    }
  }

  private recalculateSlotsIds(slotsToCheck: PuffSlot[], componentSubEntities: ComponentSubEntities) {
    const componentsToCheck: PuffComponent[] = [];

    for (const slot of slotsToCheck) {
      const newSlotId = nextComponentId();

      for (const comp of componentSubEntities.componentList) {
        if (comp.parentSlotId === slot.id) {
          comp.parentSlotId = newSlotId;
          componentsToCheck.push(comp);
        }
      }

      slot.id = newSlotId;
    }

    return componentsToCheck;
  }
}
