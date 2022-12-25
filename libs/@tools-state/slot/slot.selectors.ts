import { select } from '@ngneat/elf';
import { selectAllEntities } from '@ngneat/elf-entities';
import { fromComponents } from '@tools-state/component/component.reducer';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { fromSlots } from '@tools-state/slot/slot.reducer';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import fromSlotsStore = fromSlots.fromSlotsStore;

export const getSlotState = fromSlots.fromSlotsStore;

export const getSlotList = getSlotState.pipe(selectAllEntities());

export const getSlotMap = getSlotState.pipe(select((state: fromSlots.State) => state.entities));

export const getRootSlot = getSlotList.pipe(select((slotList: PuffSlot[]) => {
  return;
}));

export const getComponentSlotList = (componentId: string) => getSlotList.pipe(select((slotList: PuffSlot[]) => {
  return slotList.filter((slot: PuffSlot) => componentId === slot.parentComponentId);
}));

export const getSlotByParentId = (parentId: string) => getSlotList.pipe(select((slotList: PuffSlot[]) => {
  return slotList.find((slot: PuffSlot) => slot.parentComponentId === parentId);
}));

export const getSlotByParentPageId = (parentId: string) => getSlotList.pipe(select((slotList: PuffSlot[]) => {
  return slotList.find((slot: PuffSlot) => slot.parentPageId === parentId);
}));

export const getSlotById = (slotId: string) => getSlotState.pipe(select((state: fromSlots.State) => {
  return state.entities[slotId];
}));

export const getSlotParent = (slotId: string) => combineLatest(
  [getSlotById(slotId), fromComponents.fromComponentsStore]
).pipe(map(([slot, components]) => {
  return components.entities[slot.parentComponentId];
}));

// returns true if slot doesn't located in header or sidebar,
export const isSlotInPage = (slotId: string) => combineLatest(
  [getSlotById(slotId), fromComponents.fromComponentsStore]
).pipe(map(([parentSlot, components]) => {
  let maxLoop = 1000;
  while (parentSlot.parentComponentId && --maxLoop > 0) {
    parentSlot = fromSlotsStore.query(
      (state) => state.entities[components.entities[parentSlot.parentComponentId].parentSlotId]
    );
  }
  return !(parentSlot.headerSlot || parentSlot.sidebarSlot);
}));
