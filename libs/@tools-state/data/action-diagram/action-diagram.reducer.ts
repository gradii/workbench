import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import {
  deleteEntities, EntitiesState, setEntities, updateEntities, upsertEntities, withEntities
} from '@ngneat/elf-entities';
import { ActionDiagram } from '@common/public-api';
import { tap } from 'rxjs/operators';
import { ActionDiagramActions } from '@tools-state/data/action-diagram/action-diagram.actions';

export namespace fromActionDiagram {
  export interface State {
    ids: string[];
    activeActionDiagramId: string;
    activeNodeId: string;
    // activeNodeSelection?: any;
    entities: EntitiesState<ActionDiagram>;
  }

  // const adapter: EntityAdapter<ActionDiagram> = createEntityAdapter<ActionDiagram>();

  const initialState: State = {
    ids                  : [],
    activeActionDiagramId: '',
    activeNodeId         : undefined,
    entities             : {}
  };

  const { state, config } = createState(
    withProps<State>(initialState),
    withEntities<ActionDiagram>()
  );

  export const fromActionDiagramStore = new Store({ name: 'kitchen-action-diagram', state, config });


  export class ReducerEffect {
    reducerEffect = createEffect(
      (actions) => actions.pipe(
        tap((action) => {
          switch (action.type) {
            case ActionDiagramActions.ActionTypes.AddActionDiagramList:
              const { actionDiagramList } = action;
              let activeActionDiagramId   = state.activeActionDiagramId;
              let activeStepId            = state.activeNodeId;

              fromActionDiagramStore.update(setEntities(actionDiagramList));

              return fromActionDiagramStore.update((state) => ({
                ...state,
                activeActionDiagramId,
                activeNodeId: activeStepId
              }));
            case ActionDiagramActions.ActionTypes.UpdateActionDiagramList:
              return action.list.forEach(it => {
                fromActionDiagramStore.update(updateEntities(it.id, {
                  ...it,
                  reversion: (++it.reversion) % 10000000 || 0
                }));
              });
            case ActionDiagramActions.ActionTypes.UpsertActionDiagram:
              return fromActionDiagramStore.update(upsertEntities({
                ...action.actionDiagram,
                reversion: (++action.actionDiagram.reversion) % 10000000 || 0
              }));
            case ActionDiagramActions.ActionTypes.DeleteActionDiagram:
              return fromActionDiagramStore.update(deleteEntities(action.id));
            case ActionDiagramActions.ActionTypes.SelectActionDiagram:
              return fromActionDiagramStore.update((state) => ({
                ...state,
                activeActionDiagramId: action.id,
                activeNodeId         : undefined
              }));
            case ActionDiagramActions.ActionTypes.SelectActionDiagramAndNode:
              return fromActionDiagramStore.update((state) => ({
                ...state,
                activeActionDiagramId: action.actionDiagramId,
                activeNodeId         : action.stepId
              }));
            case ActionDiagramActions.ActionTypes.SelectNode:
              return fromActionDiagramStore.update((state) => ({
                ...state,
                activeNodeId: action.activeNodeId,
                // activeNodeSelection: action.activeNodeSelection
              }));
            default:
          }
        })
      )
    );
  }
}
