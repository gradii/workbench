import { Action } from '@ngrx/store';

export namespace HistoryActions {
  export enum ActionTypes {
    Forward = '[History] Forward',
    Back = '[History] Back',
    Persist = '[History] Persist',
  }

  export class Forward implements Action {
    readonly type = ActionTypes.Forward;
  }

  export class Back implements Action {
    readonly type = ActionTypes.Back;
  }

  export class Persist implements Action {
    readonly type = ActionTypes.Persist;
  }

  export type ActionsUnion = Forward | Back | Persist;
}
