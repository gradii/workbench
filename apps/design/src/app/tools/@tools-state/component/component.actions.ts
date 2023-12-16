import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { ResizeSpace } from '@common';

import { BakeryComponent } from '@tools-state/component/component.model';
import { Breakpoint } from '@core/breakpoint/breakpoint';

export namespace ComponentActions {
  export enum ActionTypes {
    AddComponent = '[Component] Add Component',
    UpdateComponent = '[Component] Update Component',
    UpdateComponentList = '[Component] Update Component List',
    SelectComponent = '[Component] Select Component',
    HoveredComponent = '[Component] Hovered Component',
    MoveComponent = '[Component] Move Component',
    AddComponentList = '[Component] Add Component List',
    ReplaceWithComponentList = '[Component] Replace With Component List',
    RemoveComponentList = '[Component] Remove Component List',
    ShiftForwardAfterIndex = '[Component] Shift Forward After Index',
    ResizeSpaces = '[Component] Resize Spaces',
  }

  export class AddComponent implements Action {
    readonly type = ActionTypes.AddComponent;

    constructor(public component: BakeryComponent) {
    }
  }

  export class UpdateComponent implements Action {
    readonly type = ActionTypes.UpdateComponent;

    constructor(public component: Update<BakeryComponent>) {
    }
  }

  export class UpdateComponentList implements Action {
    readonly type = ActionTypes.UpdateComponentList;

    constructor(public updateList: Update<BakeryComponent>[]) {
    }
  }

  export class SelectComponent implements Action {
    readonly type = ActionTypes.SelectComponent;

    constructor(public componentIdList: string[]) {
    }
  }

  export class HoveredComponent implements Action {
    readonly type = ActionTypes.HoveredComponent;

    constructor(public componentId: string) {
    }
  }

  export class MoveComponent implements Action {
    readonly type = ActionTypes.MoveComponent;

    constructor(public compId: string, public parentSlotId: string, public position: number) {
    }
  }

  export class AddComponentList implements Action {
    readonly type = ActionTypes.AddComponentList;

    constructor(public componentList: BakeryComponent[]) {
    }
  }

  export class ReplaceWithComponentList implements Action {
    readonly type = ActionTypes.ReplaceWithComponentList;

    constructor(public componentList: BakeryComponent[]) {
    }
  }

  export class RemoveComponentList implements Action {
    readonly type = ActionTypes.RemoveComponentList;

    constructor(public componentIdList: string[]) {
    }
  }

  export class ShiftForwardAfterComponent implements Action {
    readonly type = ActionTypes.ShiftForwardAfterIndex;

    constructor(public parentSlotId: string, public index: number, public shift: number) {
    }
  }

  export class ResizeSpaces implements Action {
    readonly type = ActionTypes.ResizeSpaces;

    constructor(public resize: ResizeSpace[], public breakpoint: Breakpoint) {
    }
  }

  export type ActionsUnion =
    | AddComponent
    | AddComponentList
    | ReplaceWithComponentList
    | RemoveComponentList
    | ShiftForwardAfterComponent
    | UpdateComponent
    | SelectComponent
    | MoveComponent
    | UpdateComponentList
    | ResizeSpaces;
}
