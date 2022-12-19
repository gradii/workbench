import { Injectable } from '@angular/core';
import { KitchenComponent, KitchenSlot } from '@common/public-api';

const UIBAKERY_SEQUENCE_ID_POSTFIX = '__UIBAKERY_SEQUENCE_ID_POSTFIX__';

@Injectable({ providedIn: 'root' })
export class IdRemapperService {
  remapComponentsIds(components: KitchenComponent[], parentIndex: number = null): KitchenComponent[] {
    return components.map((component: KitchenComponent, index: number) => {
      const realIndex = typeof parentIndex === 'number' ? parentIndex : index;
      const componentWithRemappedId: KitchenComponent = {
        ...component,
        id: component.id + UIBAKERY_SEQUENCE_ID_POSTFIX + realIndex,
        slots: this.remapSlotsIds(component.slots, realIndex)
      };

      return componentWithRemappedId;
    });
  }

  private remapSlotsIds(slots: { [name: string]: KitchenSlot }, index: number): { [name: string]: KitchenSlot } {
    let slotsWithRemappedIds: { [name: string]: KitchenSlot } = {};

    for (const [name, slot] of Object.entries(slots)) {
      const slotWithRemappedId: KitchenSlot = {
        ...slot,
        id: slot.id + UIBAKERY_SEQUENCE_ID_POSTFIX + index,
        componentList: this.remapComponentsIds(slot.componentList, index)
      };
      slotsWithRemappedIds = { ...slotsWithRemappedIds, [name]: slotWithRemappedId };
    }

    return slotsWithRemappedIds;
  }
}
