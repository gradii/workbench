import { Action } from '@ngrx/store';

import { BakeryLayout } from '@tools-state/layout/layout.model';

export namespace LayoutActions {
  export enum ActionTypes {
    SetLayout = '[Layout] Set Layout',
    UpdateLayout = '[Layout] Update Layout',
  }

  export class SetLayout implements Action {
    readonly type = ActionTypes.SetLayout;

    constructor(public layout: BakeryLayout) {
    }
  }

  export class UpdateLayout implements Action {
    readonly type = ActionTypes.UpdateLayout;

    constructor(public change: Partial<BakeryLayout>) {
    }
  }

  export type ActionsUnion = SetLayout | UpdateLayout;
}
