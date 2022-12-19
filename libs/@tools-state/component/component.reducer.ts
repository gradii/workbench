import { ResizeSpace } from '@common/public-api';
import { Actions, createEffect } from '@ngneat/effects';
import { createState, Reducer, Store, withProps } from '@ngneat/elf';
import {
  addEntities, deleteEntities, EntitiesState, setEntities, updateEntities, upsertEntities, withEntities
} from '@ngneat/elf-entities';

import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponent } from '@tools-state/component/component.model';
import { tap } from 'rxjs/operators';

declare const ngDevMode: boolean;

/**
 * Moves an item one index in an array to another.
 * @param array Array in which to move the item.
 * @param fromIndex Starting index of the item.
 * @param toIndex Index to which the item should be moved.
 */
function moveItemInArray<T = any>(array: T[], fromIndex: number, toIndex: number): void {
  const from = clamp(fromIndex, array.length - 1);
  const to   = clamp(toIndex, array.length - 1);

  if (from === to) {
    return;
  }

  const target = array[from];
  const delta  = to < from ? -1 : 1;

  for (let i = from; i !== to; i += delta) {
    array[i] = array[i + delta];
  }

  array[to] = target;
}


/**
 * Moves an item from one array to another.
 * @param currentArray Array from which to transfer the item.
 * @param targetArray Array into which to put the item.
 * @param currentIndex Index of the item in its current array.
 * @param targetIndex Index at which to insert the item.
 */
function transferArrayItem<T = any>(currentArray: T[],
                                    targetArray: T[],
                                    currentIndex: number,
                                    targetIndex: number): void {
  const from = clamp(currentIndex, currentArray.length - 1);
  const to   = clamp(targetIndex, targetArray.length);

  if (currentArray.length) {
    targetArray.splice(to, 0, currentArray.splice(from, 1)[0]);
  }
}

/**
 * Copies an item from one array to another, leaving it in its
 * original position in current array.
 * @param currentArray Array from which to copy the item.
 * @param targetArray Array into which is copy the item.
 * @param currentIndex Index of the item in its current array.
 * @param targetIndex Index at which to insert the item.
 *
 */
function copyArrayItem<T = any>(currentArray: T[],
                                targetArray: T[],
                                currentIndex: number,
                                targetIndex: number): void {
  const to = clamp(targetIndex, targetArray.length);

  if (currentArray.length) {
    targetArray.splice(to, 0, currentArray[currentIndex]);
  }
}

/** Clamps a number between zero and a maximum. */
function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}


export namespace fromComponents {

  export interface State {
    ids: string[];
    activeComponentIdList: string[];
    entities: EntitiesState<PuffComponent>;
  }

  // const adapter: EntityAdapter<BakeryComponent> = createEntityAdapter<BakeryComponent>();

  const initialState: Omit<State, 'entities'> = {
    ids                  : [],
    activeComponentIdList: []
  };

  const { state, config } = createState(
    withProps<Omit<State, 'entities'>>(initialState),
    withEntities<PuffComponent>()
  );

  export const fromComponentsStore = new Store({ name: 'kitchen-components', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect((actions: Actions) => {
      return actions.pipe(
        tap((action) => {
          switch (action.type) {
            case ComponentActions.ActionTypes.AddComponent:
              return fromComponents.fromComponentsStore.update(
                addEntities(action.component)
              );
            case ComponentActions.ActionTypes.UpdateComponent:
              return fromComponents.fromComponentsStore.update(
                updateEntities(action.component.id, action.component)
              );
            case ComponentActions.ActionTypes.UpdateComponentList:
              return fromComponents.fromComponentsStore.update(
                updateEntities(action.componentList.map((component) => component.id), action.componentList)
              );
            case ComponentActions.ActionTypes.SelectComponent:
              return fromComponents.fromComponentsStore.update(
                (state) => ({
                  ...state,
                  activeComponentIdList: action.componentIdList
                })
              );
            case ComponentActions.ActionTypes.AddComponentList:
              return fromComponents.fromComponentsStore.update(
                addEntities(action.componentList)
              );
            case ComponentActions.ActionTypes.ReplaceWithComponentList:
              return fromComponents.fromComponentsStore.update(
                setEntities(action.componentList)
              );
            case ComponentActions.ActionTypes.RemoveComponentList:
              return fromComponents.fromComponentsStore.update(
                removeComponentList(action)
              );
            case ComponentActions.ActionTypes.ShiftForwardAfterIndex:
              const shiftForwardUpdate: Partial<PuffComponent>[] = Object.values(
                fromComponents.fromComponentsStore.query(
                  (state) => state.entities)
              ).filter((component: PuffComponent) => component.parentSlotId === action.parentSlotId)
                .filter((component: PuffComponent) => component.index >= action.index)
                .map((component: PuffComponent) => {
                  return { id: component.id, index: component.index + action.shift };
                });
              return fromComponents.fromComponentsStore.update(
                upsertEntities(shiftForwardUpdate)
              );
            case ComponentActions.ActionTypes.MoveItemInArray:
              const moveItems: Partial<PuffComponent>[] = Object.values(
                fromComponents.fromComponentsStore.query(
                  (state) => state.entities)
              ).filter((component: PuffComponent) => component.parentSlotId === action.parentSlotId)
                .sort((a: PuffComponent, b: PuffComponent) => a.index - b.index);

              moveItemInArray(moveItems, action.currentIndex, action.targetIndex);
              moveItems.forEach((component: PuffComponent, idx: number) => {
                component.index = idx;
              });

              return fromComponents.fromComponentsStore.update(
                upsertEntities(moveItems)
              );
            case ComponentActions.ActionTypes.TransferArrayItem:
              const transferSourceItems: Partial<PuffComponent>[] = Object.values(
                fromComponents.fromComponentsStore.query(
                  (state) => state.entities)
              ).filter((component: PuffComponent) => component.parentSlotId === action.currentSlotId)
                .sort((a: PuffComponent, b: PuffComponent) => a.index - b.index);

              const transferTargetItems: Partial<PuffComponent>[] = Object.values(
                fromComponents.fromComponentsStore.query(
                  (state) => state.entities)
              ).filter((component: PuffComponent) => component.parentSlotId === action.targetSlotId)
                .sort((a: PuffComponent, b: PuffComponent) => a.index - b.index);

              if (ngDevMode) {
                transferSourceItems.forEach((it, idx) => {
                  if (it.index !== idx) {
                    throw new Error(`transferSourceItems[${idx}].index !== ${idx}`);
                  }
                });
                const item = transferSourceItems.find(it => it.id === action.currentComponentId);
                if (!item) {
                  throw new Error(
                    `Component with id ${action.currentComponentId} not found in source slot ${action.currentSlotId}`);
                }
              }

              const component = transferSourceItems[action.currentIndex];

              //change index
              transferArrayItem(transferSourceItems, transferTargetItems, action.currentIndex, action.targetIndex);
              transferSourceItems.forEach((component: PuffComponent, idx: number) => {
                component.index = idx;
              });
              transferTargetItems.forEach((component: PuffComponent, idx: number) => {
                component.index = idx;
              });

              //change parent slot
              component.parentSlotId = action.targetSlotId;

              return fromComponents.fromComponentsStore.update(
                upsertEntities([...transferSourceItems, ...transferTargetItems])
              );
            case ComponentActions.ActionTypes.ResizeSpaces:
              return resizeSpaces(state, action);
            default:
              return state;
          }
        })
      );
    });
  }

  // export function reducer(state = initialState, action: ComponentActions.ActionsUnion) {
  //   switch (action.type) {
  //     case ComponentActions.ActionTypes.AddComponent:
  //       return adapter.addOne(action.component, state);
  //     case ComponentActions.ActionTypes.UpdateComponent:
  //       return adapter.updateOne(action.component, state);
  //     case ComponentActions.ActionTypes.UpdateComponentList:
  //       return adapter.updateMany(action.updateList, state);
  //     case ComponentActions.ActionTypes.SelectComponent:
  //       return { ...state, activeComponentIdList: action.componentIdList };
  //     case ComponentActions.ActionTypes.AddComponentList:
  //       return adapter.addMany(action.componentList, state);
  //     case ComponentActions.ActionTypes.ReplaceWithComponentList:
  //       return adapter.setAll(action.componentList, state);
  //     case ComponentActions.ActionTypes.RemoveComponentList:
  //       return removeComponentList(state, action);
  //     case ComponentActions.ActionTypes.ShiftForwardAfterIndex:
  //       const shiftForwardUpdate: Update<BakeryComponent>[] = Object.values(state.entities)
  //         .filter((component: BakeryComponent) => component.parentSlotId === action.parentSlotId)
  //         .filter((component: BakeryComponent) => component.index >= action.index)
  //         .map((component: BakeryComponent) => {
  //           return { id: component.id, changes: { index: component.index + action.shift } };
  //         });
  //       return adapter.updateMany(shiftForwardUpdate, state);
  //     case ComponentActions.ActionTypes.ResizeSpaces:
  //       return resizeSpaces(state, action);
  //     default:
  //       return state;
  //   }
  // }

  // export const { selectAll } = adapter.getSelectors();

  function removeComponentList(action/*: ComponentActions.RemoveComponentList*/
  ): Reducer<any> {
    return (state, ctx) => {
      let newState: State = state;

      for (const componentId of action.componentIdList) {
        const component = newState.entities[componentId];

        /**
         * In case of removing nested components, it might happen if we remove parent component first of all
         * including all it's children and then trying to remove its child (we selected parent and it's
         * children and then pressed delete button). In that case, we still have id in the list of ids to remove however,
         * we have no instance and no need to remove it again.
         * */
        if (!component) {
          continue;
        }

        newState = removeComponent(component)(newState, ctx);
      }

      return newState;
    };
  }

  function removeComponent(component: PuffComponent): Reducer<any> {
    return (state, ctx) => {
      const shiftBackwardUpdate: Partial<PuffComponent>[] = Object.values(state.entities)
        .filter((c: PuffComponent) => c.parentSlotId === component.parentSlotId)
        .filter((c: PuffComponent) => c.index >= component.index)
        .map((c: PuffComponent) => ({ id: c.id, index: c.index - 1 }));

      const newState = deleteEntities(component.id)(state, ctx);
      return upsertEntities(shiftBackwardUpdate)(newState, ctx);
    };
  }

  function resizeSpaces(state: State, action/*: ComponentActions.ResizeSpaces*/): Reducer<any> {
    const resizeSpacesUpdate: Partial<PuffComponent>[] = action.resize.map((resize: ResizeSpace) =>
      createResizeSpaceUpdate(state, action, resize)
    );

    return upsertEntities(resizeSpacesUpdate);
  }

  function createResizeSpaceUpdate(
    state: State,
    action/*: ComponentActions.ResizeSpaces*/,
    resize: ResizeSpace
  ): Partial<PuffComponent> {
    const component: PuffComponent = state.entities[resize.id];
    const changes                  = {
      styles: {
        ...component.styles,
        [action.breakpoint.width]: {
          ...component.styles[action.breakpoint.width],
          width : resize.width,
          height: resize.height
        }
      }
    };

    return { ...changes, id: resize.id };
  }
}
