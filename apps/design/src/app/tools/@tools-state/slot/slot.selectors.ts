import { createSelector } from '@ngrx/store';

import { Slot } from '@tools-state/slot/slot.model';
import { fromSlots } from '@tools-state/slot/slot.reducer';
import { fromTools } from '@tools-state/tools.reducer';
import { getToolsState } from '@tools-state/tools.selector';

export const getSlotState = createSelector(getToolsState, (state: fromTools.State) => state.slots);

export const getSlotList = createSelector(getSlotState, fromSlots.selectAll);

export const getSlotMap = createSelector(getSlotState, (state: fromSlots.State) => state.entities);

export const getComponentSlotList = createSelector(getSlotList, (slotList: Slot[], componentId: string) => {
  return slotList.filter((slot: Slot) => componentId === slot.parentComponentId);
});

export const getSlotByParentId = createSelector(getSlotList, (slotList: Slot[], parentId: string) => {
  return slotList.find((slot: Slot) => slot.parentComponentId === parentId);
});

export const getSlotByParentPageId = createSelector(getSlotList, (slotList: Slot[], parentId: string) => {
  return slotList.find((slot: Slot) => slot.parentPageId === parentId);
});

export const getSlotById = createSelector(getSlotState, (state: fromSlots.State, slotId: string) => {
  return state.entities[slotId];
});

export const getSlotParent = createSelector(getToolsState, (state: fromTools.State, slotId: string) => {
  const slot: Slot = state.slots.entities[slotId];
  return state.components.entities[slot.parentComponentId];
});

// returns true if slot doesn't located in header or sidebar,
export const isSlotInPage = createSelector(getToolsState, (state: fromTools.State, id: string) => {
  let parentSlot: Slot = state.slots.entities[id];
  while (parentSlot.parentComponentId) {
    parentSlot = state.slots.entities[state.components.entities[parentSlot.parentComponentId].parentSlotId];
  }
  return !(parentSlot.headerSlot || parentSlot.sidebarSlot);
});
