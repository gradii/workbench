import { ResizeSpace } from '@common/public-api';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { createAction } from '@ngneat/effects';
import { PuffComponentOrDirective } from '@tools-state/common.model';

import { PuffComponent } from '@tools-state/component/component.model';

export namespace ComponentActions {
  export enum ActionTypes {
    AddComponent               = '[Component] Add Component',
    UpdateComponent            = '[Component] Update Component',
    UpdateComponentList        = '[Component] Update Component List',
    SelectComponent            = '[Component] Select Component',
    HoveredComponent           = '[Component] Hovered Component',
    MoveComponent              = '[Component] Move Component',
    MoveItemInArrayComponent   = '[Component] Move Item In Array Component',
    TransferArrayItemComponent = '[Component] Transfer Array Item Component',
    AddComponentList           = '[Component] Add Component List',
    ReplaceWithComponentList   = '[Component] Replace With Component List',
    RemoveComponentList        = '[Component] Remove Component List',
    ShiftForwardAfterIndex     = '[Component] Shift Forward After Index',
    MoveItemInArray            = '[Component] Move Item In Array',
    TransferArrayItem          = '[Component] Transfer Array Item',
    ResizeSpaces               = '[Component] Resize Spaces',
  }

  export const AddComponent = createAction(
    ActionTypes.AddComponent,
    (component: PuffComponent) => ({ component })
  );

  export const UpdateComponent = createAction(
    ActionTypes.UpdateComponent,
    (component: Partial<PuffComponent>) => ({ component })
  );

  export const UpdateComponentList = createAction(
    ActionTypes.UpdateComponentList,
    (updateList: Partial<PuffComponent>[]) => ({ updateList })
  );

  export const SelectComponent = createAction(
    ActionTypes.SelectComponent,
    (componentIdList: string[]) => ({ componentIdList })
  );

  export const HoveredComponent = createAction(
    ActionTypes.HoveredComponent,
    (componentId: string) => ({ componentId })
  );

  export const MoveComponent = createAction(
    ActionTypes.MoveComponent,
    (componentId: string, parentSlotId: string, position: number) => ({ componentId, parentSlotId, position })
  );

  export const MoveItemInArrayComponent = createAction(
    ActionTypes.MoveItemInArrayComponent,
    (componentId: string, parentSlotId: string, currentIndex: number, targetIndex: number, currentContainer?: any) => ({
      componentId, parentSlotId, currentIndex, targetIndex, currentContainer
    })
  );

  export const TransferArrayItemComponent = createAction(
    ActionTypes.TransferArrayItemComponent,
    (
      componentId: string,
      currentSlotId: string, targetSlotId: string,
      currentIndex: number, targetIndex: number) => ({
      componentId, currentSlotId, targetSlotId, currentIndex, targetIndex
    })
  );

  export const AddComponentList = createAction(
    ActionTypes.AddComponentList,
    (componentList: PuffComponentOrDirective[]) => ({ componentList })
  );

  export const ReplaceWithComponentList = createAction(
    ActionTypes.ReplaceWithComponentList,
    (componentList: PuffComponentOrDirective[]) => ({ componentList })
  );

  export const RemoveComponentList = createAction(
    ActionTypes.RemoveComponentList,
    (componentIdList: string[]) => ({ componentIdList })
  );

  export const ShiftForwardAfterComponent = createAction(
    ActionTypes.ShiftForwardAfterIndex,
    (parentSlotId: string, index: number, shift: number) => ({ parentSlotId, index, shift })
  );

  export const MoveItemInArray = createAction(
    ActionTypes.MoveItemInArray,
    (parentSlotId: string, currentIndex: number, targetIndex: number) => ({ parentSlotId, currentIndex, targetIndex })
  );

  export const TransferArrayItem = createAction(
    ActionTypes.TransferArrayItem,
    (
      currentComponentId: string,
      currentSlotId: string, targetSlotId: string,
      currentIndex: number, targetIndex: number) => ({
      currentComponentId,
      currentSlotId, targetSlotId,
      currentIndex, targetIndex
    })
  );

  export const ResizeSpaces = createAction(
    ActionTypes.ResizeSpaces,
    (resize: ResizeSpace[], breakpoint: Breakpoint) => ({ resize, breakpoint })
  );
}
