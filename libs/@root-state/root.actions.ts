import { createAction } from "@ngneat/effects";

export namespace RootActions {
  export enum ActionTypes {
    ClearStore = '[Root] Clear Store',
  }

  export const ClearStore = createAction(ActionTypes.ClearStore);
}
