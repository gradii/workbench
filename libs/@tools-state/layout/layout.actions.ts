import { createAction } from '@ngneat/effects';
import { BakeryLayout } from '@tools-state/layout/layout.model';

export namespace LayoutActions {
  export enum ActionTypes {
    SetLayout    = '[Layout] Set Layout',
    UpdateLayout = '[Layout] Update Layout',
  }

  export const SetLayout = createAction(
    ActionTypes.SetLayout,
    (layout: BakeryLayout) => ({ layout })
  );

  export const UpdateLayout = createAction(
    ActionTypes.UpdateLayout,
    (change: Partial<BakeryLayout>) => ({ change })
  );
}
