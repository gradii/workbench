import { createAction } from '@ngneat/effects';

export namespace HistoryActions {
  export enum ActionTypes {
    Forward = '[History] Forward',
    Back = '[History] Back',
    Persist = '[History] Persist',
  }

  export const Forward = createAction(ActionTypes.Forward);

  export const Back = createAction(ActionTypes.Back);

  export const Persist = createAction(ActionTypes.Persist);
}
