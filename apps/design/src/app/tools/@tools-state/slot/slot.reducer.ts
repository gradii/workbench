import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Slot } from '@tools-state/slot/slot.model';
import { SlotActions } from '@tools-state/slot/slot.actions';

export namespace fromSlots {
  export interface State extends EntityState<Slot> {
    ids: string[];
  }

  const adapter: EntityAdapter<Slot> = createEntityAdapter<Slot>();

  const initialState: State = adapter.getInitialState({
    ids: []
  });

  export function reducer(state = initialState, action: SlotActions.ActionsUnion) {
    switch (action.type) {
      case SlotActions.ActionTypes.AddSlot:
        return adapter.addOne(action.slot, state);
      case SlotActions.ActionTypes.AddSlotList:
        return adapter.addMany(action.slotList, state);
      case SlotActions.ActionTypes.ReplaceWithSlotList:
        return adapter.setAll(action.slotList, state);
      case SlotActions.ActionTypes.RemoveSlot:
        return adapter.removeOne(action.slotId, state);
      case SlotActions.ActionTypes.RemoveSlotList:
        return adapter.removeMany(action.slotsIds, state);
      default:
        return state;
    }
  }

  export const { selectAll } = adapter.getSelectors();
}
