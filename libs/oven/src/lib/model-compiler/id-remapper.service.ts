import { Injectable } from '@angular/core';
import { OvenComponent, OvenSlot } from '@common';

const UIBAKERY_SEQUENCE_ID_POSTFIX = '__UIBAKERY_SEQUENCE_ID_POSTFIX__';

@Injectable({ providedIn: 'root' })
export class IdRemapperService {
  remapComponentsIds(components: OvenComponent[], parentIndex: number = null): OvenComponent[] {
    return components.map((component: OvenComponent, index: number) => {
      const realIndex = typeof parentIndex === 'number' ? parentIndex : index;
      const componentWithRemappedId: OvenComponent = {
        ...component,
        id: component.id + UIBAKERY_SEQUENCE_ID_POSTFIX + realIndex,
        slots: this.remapSlotsIds(component.slots, realIndex)
      };

      return componentWithRemappedId;
    });
  }

  private remapSlotsIds(slots: { [name: string]: OvenSlot }, index: number): { [name: string]: OvenSlot } {
    let slotsWithRemappedIds: { [name: string]: OvenSlot } = {};

    for (const [name, slot] of Object.entries(slots)) {
      const slotWithRemappedId: OvenSlot = {
        ...slot,
        id: slot.id + UIBAKERY_SEQUENCE_ID_POSTFIX + index,
        componentList: this.remapComponentsIds(slot.componentList, index)
      };
      slotsWithRemappedIds = { ...slotsWithRemappedIds, [name]: slotWithRemappedId };
    }

    return slotsWithRemappedIds;
  }
}
