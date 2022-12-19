import { KitchenApp } from '@common/public-api';
import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { WorkingAreaMode, WorkingAreaWorkflowMode } from '@tools-state/working-area/working-area.model';
import { tap } from 'rxjs/operators';

export namespace fromWorkingArea {
  export interface State {
    mode: WorkingAreaMode;
    app: KitchenApp;
    workflowMode: WorkingAreaWorkflowMode;
  }

  const initialState: State = {
    mode        : WorkingAreaMode.BUILDER,
    app         : null,
    workflowMode: WorkingAreaWorkflowMode.FRONTEND
  };

  const { state, config } = createState(
    withProps<State>(initialState)
  );

  export const fromWorkingAreaStore = new Store({ name: 'kitchen-workingArea', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect(
      (actions) => actions.pipe(
        tap((action) => {
          switch (action.type) {
            case WorkingAreaActions.ActionTypes.ChangeMode:
              return fromWorkingAreaStore.update(state => ({ ...state, mode: action.mode }));
            case WorkingAreaActions.ActionTypes.SetKitchenState:
              return fromWorkingAreaStore.update(state => ({ ...state, app: action.app }));
            case WorkingAreaActions.ActionTypes.ChangeWorkflowMode:
              return fromWorkingAreaStore.update(state => ({ ...state, workflowMode: action.workflowMode }));
            default:
          }
        })
      )
    );
  }

  // export function reducer(state = initialState, action: WorkingAreaActions.ActionsUnion) {
  //   switch (action.type) {
  //     case WorkingAreaActions.ActionTypes.ChangeMode:
  //       return { ...state, mode: action.mode };
  //     case WorkingAreaActions.ActionTypes.SetKitchenState:
  //       return { ...state, app: action.app };
  //     case WorkingAreaActions.ActionTypes.ChangeWorkflowMode:
  //       return { ...state, workflowMode: action.workflowMode };
  //     default:
  //       return state;
  //   }
  // }
}
