import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import {
  addEntities, deleteEntities, EntitiesState, setEntities, updateEntities, upsertEntities, withEntities
} from '@ngneat/elf-entities';
import { ActionFlow } from '@common/public-api';
import { tap } from 'rxjs/operators';
import { ActionFlowActions } from '@tools-state/data/action-flow/action-flow.actions';

export namespace fromActionFlow {
  export interface State {
    ids: string[];
    // activeNodeSelection?: any;
    entities: EntitiesState<ActionFlow>;
  }

  // const adapter: EntityAdapter<ActionFlow> = createEntityAdapter<ActionFlow>();

  const initialState: State = {
    ids     : [],
    entities: {}
  };

  const { state, config } = createState(
    withProps<State>(initialState),
    withEntities<ActionFlow>()
  );

  export const fromActionFlowStore = new Store({ name: 'kitchen-action-flow', state, config });


  export class ReducerEffect {
    reducerEffect = createEffect(
      (actions) => actions.pipe(
        tap((action) => {
          switch (action.type) {
            case ActionFlowActions.ActionTypes.AddActionFlow:
              return fromActionFlowStore.update(addEntities({ ...action.actionFlow, id: action.actionFlowId }));
            case ActionFlowActions.ActionTypes.AddActionFlowList:
              const { actionFlowList } = action;
              return fromActionFlowStore.update(setEntities(actionFlowList));
            case ActionFlowActions.ActionTypes.UpdateActionFlowList:
              return action.list.forEach(it => {
                fromActionFlowStore.update(updateEntities(it.id, {
                  ...it,
                  reversion: (++it.reversion) % 10000000 || 0
                }));
              });
            case ActionFlowActions.ActionTypes.UpsertActionFlow:
              return fromActionFlowStore.update(upsertEntities({
                ...action.actionDiagram,
                reversion: (++action.actionDiagram.reversion) % 10000000 || 0
              }));
            case ActionFlowActions.ActionTypes.DeleteActionFlow:
              return fromActionFlowStore.update(deleteEntities(action.id));
            case ActionFlowActions.ActionTypes.SelectActionFlow:
              return fromActionFlowStore.update((state) => ({
                ...state,
                activeActionFlowId: action.id,
                activeNodeId      : undefined
              }));
            default:
          }
        })
      )
    );
  }
}
