import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { ResizeSpace } from '@common';

import { ComponentActions } from '@tools-state/component/component.actions';
import { BakeryComponent } from '@tools-state/component/component.model';

export namespace fromComponents {
  export interface State extends EntityState<BakeryComponent> {
    ids: string[];
    activeComponentIdList: string[];
  }

  const adapter: EntityAdapter<BakeryComponent> = createEntityAdapter<BakeryComponent>();

  const initialState: State = adapter.getInitialState({
    ids: [],
    activeComponentIdList: []
  });

  export function reducer(state = initialState, action: ComponentActions.ActionsUnion) {
    switch (action.type) {
      case ComponentActions.ActionTypes.AddComponent:
        return adapter.addOne(action.component, state);
      case ComponentActions.ActionTypes.UpdateComponent:
        return adapter.updateOne(action.component, state);
      case ComponentActions.ActionTypes.UpdateComponentList:
        return adapter.updateMany(action.updateList, state);
      case ComponentActions.ActionTypes.SelectComponent:
        return { ...state, activeComponentIdList: action.componentIdList };
      case ComponentActions.ActionTypes.AddComponentList:
        return adapter.addMany(action.componentList, state);
      case ComponentActions.ActionTypes.ReplaceWithComponentList:
        return adapter.setAll(action.componentList, state);
      case ComponentActions.ActionTypes.RemoveComponentList:
        return removeComponentList(state, action);
      case ComponentActions.ActionTypes.ShiftForwardAfterIndex:
        const shiftForwardUpdate: Update<BakeryComponent>[] = Object.values(state.entities)
          .filter((component: BakeryComponent) => component.parentSlotId === action.parentSlotId)
          .filter((component: BakeryComponent) => component.index >= action.index)
          .map((component: BakeryComponent) => {
            return { id: component.id, changes: { index: component.index + action.shift } };
          });
        return adapter.updateMany(shiftForwardUpdate, state);
      case ComponentActions.ActionTypes.ResizeSpaces:
        return resizeSpaces(state, action);
      default:
        return state;
    }
  }

  export const { selectAll } = adapter.getSelectors();

  function removeComponentList(state: State, action: ComponentActions.RemoveComponentList): State {
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

      newState = removeComponent(newState, component);
    }

    return newState;
  }

  function removeComponent(state: State, component: BakeryComponent): State {
    const shiftBackwardUpdate: Update<BakeryComponent>[] = Object.values(state.entities)
      .filter((c: BakeryComponent) => c.parentSlotId === component.parentSlotId)
      .filter((c: BakeryComponent) => c.index >= component.index)
      .map((c: BakeryComponent) => ({ id: c.id, changes: { index: c.index - 1 } }));

    const newState = adapter.removeOne(component.id, state);
    return adapter.updateMany(shiftBackwardUpdate, newState);
  }

  function resizeSpaces(state: State, action: ComponentActions.ResizeSpaces): State {
    const resizeSpacesUpdate: Update<BakeryComponent>[] = action.resize.map((resize: ResizeSpace) =>
      createResizeSpaceUpdate(state, action, resize)
    );

    return adapter.updateMany(resizeSpacesUpdate, state);
  }

  function createResizeSpaceUpdate(
    state: State,
    action: ComponentActions.ResizeSpaces,
    resize: ResizeSpace
  ): Update<BakeryComponent> {
    const component: BakeryComponent = state.entities[resize.id];
    const changes = {
      styles: {
        ...component.styles,
        [action.breakpoint.width]: {
          ...component.styles[action.breakpoint.width],
          width: resize.width,
          height: resize.height
        }
      }
    };

    return { id: resize.id, changes };
  }
}
