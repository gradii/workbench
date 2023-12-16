import { Action } from '@ngrx/store';

import { Slot } from '@tools-state/slot/slot.model';

export namespace SlotActions {
  export enum ActionTypes {
    AddSlot = '[Slot] Add Slot',
    AddSlotList = '[Slot] Add Slot List',
    ReplaceWithSlotList = '[Slot] Replace With Slot List',
    RemoveSlot = '[Slot] Remove Slot',
    RemoveSlotList = '[Slot] Remove Slot List',
  }

  export class AddSlot implements Action {
    readonly type = ActionTypes.AddSlot;

    constructor(public slot: Slot) {
    }
  }

  export class AddSlotList implements Action {
    readonly type = ActionTypes.AddSlotList;

    constructor(public slotList: Slot[]) {
    }
  }

  export class ReplaceWithSlotList implements Action {
    readonly type = ActionTypes.ReplaceWithSlotList;

    constructor(public slotList: Slot[]) {
    }
  }

  export class RemoveSlot implements Action {
    readonly type = ActionTypes.RemoveSlot;

    constructor(public slotId: string) {
    }
  }

  export class RemoveSlotList implements Action {
    readonly type = ActionTypes.RemoveSlotList;

    constructor(public slotsIds: string[]) {
    }
  }

  export type ActionsUnion = AddSlot | AddSlotList | ReplaceWithSlotList | RemoveSlot | RemoveSlotList;
}
