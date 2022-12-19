import { createAction } from '@ngneat/effects';

import { PuffSlot } from '@tools-state/slot/slot.model';

export namespace SlotActions {
  export enum ActionTypes {
    AddSlot             = '[Slot] Add Slot',
    AddSlotList         = '[Slot] Add Slot List',
    ReplaceWithSlotList = '[Slot] Replace With Slot List',
    RemoveSlot          = '[Slot] Remove Slot',
    RemoveSlotList      = '[Slot] Remove Slot List',
  }

  export const AddSlot = createAction(
    ActionTypes.AddSlot,
    (slot: PuffSlot) => ({ slot })
  );

  export const AddSlotList = createAction(
    ActionTypes.AddSlotList,
    (slotList: PuffSlot[]) => ({ slotList })
  );

  export const ReplaceWithSlotList = createAction(
    ActionTypes.ReplaceWithSlotList,
    (slotList: PuffSlot[]) => ({ slotList })
  );

  export const RemoveSlot = createAction(
    ActionTypes.RemoveSlot,
    (slotId: PuffSlot) => ({ slotId })
  );

  export const RemoveSlotList = createAction(
    ActionTypes.RemoveSlotList,
    (slotsIds: string[]) => ({ slotsIds })
  );

}
