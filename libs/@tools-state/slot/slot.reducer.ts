import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { addEntities, EntitiesState, setEntities, withEntities } from '@ngneat/elf-entities';
import { deleteEntities } from '@ngneat/elf-entities';
import { SlotActions } from '@tools-state/slot/slot.actions';

import { PuffSlot } from '@tools-state/slot/slot.model';
import { tap } from 'rxjs/operators';

export namespace fromSlots {
  export interface State {
    ids: string[];
    entities: EntitiesState<PuffSlot>;
  }

  const initialState: Partial<State> = {
    ids: []
  };

  const { state, config } = createState(
    withProps<Partial<State>>(initialState),
    withEntities<PuffSlot>()
  );

  export const fromSlotsStore = new Store({ name: 'kitchen-slots', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect(
      (actions) => actions.pipe(
        tap((action) => {
          switch (action.type) {
            case SlotActions.ActionTypes.AddSlot:
              return fromSlotsStore.update(addEntities(action.slot));
            case SlotActions.ActionTypes.AddSlotList:
              return fromSlotsStore.update(addEntities(action.slotList));
            case SlotActions.ActionTypes.ReplaceWithSlotList:
              return fromSlotsStore.update(setEntities(action.slotList));
            case SlotActions.ActionTypes.RemoveSlot:
              return fromSlotsStore.update(deleteEntities(action.slotId));
            case SlotActions.ActionTypes.RemoveSlotList:
              return fromSlotsStore.update(deleteEntities(action.slotsIds));
            default:
              return state;
          }
        })
      )
    );
  }

  // export function reducer(state = initialState, action) {
  //   switch (action.type) {
  //     case SlotActions.ActionTypes.AddSlot:
  //       return adapter.addOne(action.slot, state);
  //     case SlotActions.ActionTypes.AddSlotList:
  //       return adapter.addMany(action.slotList, state);
  //     case SlotActions.ActionTypes.ReplaceWithSlotList:
  //       return adapter.setAll(action.slotList, state);
  //     case SlotActions.ActionTypes.RemoveSlot:
  //       return adapter.removeOne(action.slotId, state);
  //     case SlotActions.ActionTypes.RemoveSlotList:
  //       return adapter.removeMany(action.slotsIds, state);
  //     default:
  //       return state;
  //   }
  // }
}
