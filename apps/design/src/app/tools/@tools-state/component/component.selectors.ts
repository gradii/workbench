import { ComponentLogicPropName, SequenceProperty, uiDataSourceElements } from '@common';
import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { BakeryComponent } from '@tools-state/component/component.model';
import { fromComponents } from '@tools-state/component/component.reducer';
import { Slot } from '@tools-state/slot/slot.model';
import { getSlotList, getSlotMap } from '@tools-state/slot/slot.selectors';
import { fromTools } from '@tools-state/tools.reducer';
import { isSpace } from '@tools-state/component/utils';
import { getToolsState } from '@tools-state/tools.selector';

export interface ComponentSubEntities {
  componentList: BakeryComponent[];
  slotList: Slot[];
}

export const getComponentsState = createSelector(getToolsState, (state: fromTools.State) => state.components);

export const getComponentList = createSelector(getComponentsState, fromComponents.selectAll);
export const getComponentMap = createSelector(getComponentsState, (state: fromComponents.State) => state.entities);

export const getRootComponentIdAndSlotIdLists = createSelector(
  getComponentList,
  getSlotList,
  (componentList: BakeryComponent[], slotList: Slot[], pageIdList: string[]) => {
    const slotIdList: string[] = slotList
      .filter(slot => pageIdList.includes(slot.parentPageId))
      .map((slot: Slot) => slot.id);
    const componentIdList: string[] = componentList
      .filter(component => slotIdList.includes(component.parentSlotId))
      .map((component: BakeryComponent) => component.id);
    return { slotIdList, componentIdList };
  }
);

// Returns all component's sub entities ids including passed component id
export const getSubComponentIds = createSelector(
  getComponentList,
  getComponentMap,
  getSlotList,
  getSubComponentIdsProjector
);

// Returns all component's sub entities ids including passed component id
export const getSubComponentIdsList = createSelector(
  getComponentList,
  getComponentMap,
  getSlotList,
  (
    componentList: BakeryComponent[],
    componentMap: Dictionary<BakeryComponent>,
    slotList: Slot[],
    dataList: { componentIdList: string[]; slotIdList: string[] }[]
  ) => {
    return dataList.map(dataItem => getSubComponentIdsProjector(componentList, componentMap, slotList, dataItem));
  }
);

export const getNearestSiblingOrParentComponentId = createSelector(
  getComponentList,
  getComponentMap,
  getSlotList,
  getSlotMap,
  (
    componentList: BakeryComponent[],
    componentMap: Dictionary<BakeryComponent>,
    slotList: Slot[],
    slotMap: Dictionary<Slot>,
    props: { componentIdList: string[] }
  ) => {
    const { componentIdList } = props;

    for (const componentId of componentIdList) {
      const parent: BakeryComponent = getParent(componentList, componentMap, slotMap, componentId);
      const [prevSibling, nextSibling] = getNearestSibling(componentList, componentMap, slotMap, componentId);

      if (prevSibling && !componentIdList.includes(prevSibling.id)) {
        return prevSibling.id;
      }

      if (nextSibling && !componentIdList.includes(nextSibling.id)) {
        return nextSibling.id;
      }

      if (parent && !componentIdList.includes(parent.id)) {
        return parent.id;
      }
    }
  }
);

function getParent(
  componentList: BakeryComponent[],
  componentMap: Dictionary<BakeryComponent>,
  slotMap: Dictionary<Slot>,
  componentId: string
): BakeryComponent {
  const component: BakeryComponent = componentMap[componentId];

  if (!component) {
    return;
  }

  const parentSlotId: string = component.parentSlotId;
  const slot: Slot = slotMap[parentSlotId];
  return componentMap[slot.parentComponentId];
}

function getNearestSibling(
  componentList: BakeryComponent[],
  componentMap: Dictionary<BakeryComponent>,
  slotMap: Dictionary<Slot>,
  componentId: string
): BakeryComponent[] {
  const siblings: BakeryComponent[] = getSiblings(componentList, componentMap, slotMap, componentId);

  if (!siblings) {
    return [];
  }

  const currentIndex: number = siblings.findIndex((component: BakeryComponent) => component.id === componentId);
  const prevSibling: BakeryComponent = siblings[currentIndex - 1];
  const nextSibling: BakeryComponent = siblings[currentIndex + 1];

  return [prevSibling, nextSibling];
}

function getSiblings(
  componentList: BakeryComponent[],
  componentMap: Dictionary<BakeryComponent>,
  slotMap: Dictionary<Slot>,
  componentId: string
): BakeryComponent[] {
  const component: BakeryComponent = componentMap[componentId];

  if (!component) {
    return;
  }

  const parentSlotId: string = component.parentSlotId;
  return componentList.filter((c: BakeryComponent) => c.parentSlotId === parentSlotId);
}

function getSubComponentIdsProjector(
  componentList: BakeryComponent[],
  componentMap: Dictionary<BakeryComponent>,
  slotList: Slot[],
  { componentIdList, slotIdList }
) {
  const slotsIds: string[] = [...slotIdList];
  const childIds: string[] = [];
  const componentIdsToCheck: string[] = [...componentIdList];

  for (const componentId of componentIdsToCheck) {
    childIds.push(componentId);

    const slots: Slot[] = slotList.filter((slot: Slot) => slot.parentComponentId === componentId);

    for (const slot of slots) {
      const childrenIds = componentList
        .filter((comp: BakeryComponent) => comp.parentSlotId === slot.id)
        .map((component: BakeryComponent) => component.id);
      componentIdsToCheck.push(...childrenIds);
      slotsIds.push(slot.id);
    }
  }
  return { componentIdList: childIds, slotIdList: slotsIds };
}

export const getSubEntitiesByComponentList = createSelector(
  getComponentList,
  getComponentMap,
  getSlotList,
  (
    componentList: BakeryComponent[],
    componentMap: Dictionary<BakeryComponent>,
    slotList: Slot[],
    targetList: BakeryComponent[]
  ) => {
    return targetList.map((c: BakeryComponent) =>
      getSubEntitiesByComponentIdProjector(componentList, componentMap, slotList, c.id)
    );
  }
);
export const getSlotComponentList = createSelector(
  getComponentList,
  (componentList: BakeryComponent[], slotId: string) => {
    return componentList.filter((component: BakeryComponent) => component.parentSlotId === slotId);
  }
);

export const getActiveComponentList = createSelector(getComponentsState, (state: fromComponents.State) => {
  return state.activeComponentIdList.map((id: string) => state.entities[id]);
});

export const getClosestSpaceSlotByComponent = createSelector(
  getComponentList,
  getSlotList,
  (componentList: BakeryComponent[], slotList: Slot[], componentId: string) => {
    const slot = slotList.find((s: Slot) => s.parentComponentId === componentId);
    const space = componentList.find((c: BakeryComponent) => c.parentSlotId === slot.id);
    return slotList.find((s: Slot) => s.parentComponentId === space.id);
  }
);

export const getActiveComponentIdList = createSelector(getComponentsState, (state: fromComponents.State) => {
  return state.activeComponentIdList;
});

export const getActiveComponent = createSelector(getActiveComponentList, (componentList: BakeryComponent[]) => {
  return componentList.length === 1 ? componentList[0] : null;
});

export const getSlotComponents = createSelector(
  getComponentList,
  (componentList: BakeryComponent[], slotId: string) => {
    return componentList.filter((component: BakeryComponent) => component.parentSlotId === slotId);
  }
);

export const getRootSlotComponent = createSelector(
  getComponentList,
  (componentList: BakeryComponent[], slotId: string) => {
    return componentList.filter((component: BakeryComponent) => component.parentSlotId === slotId)[0];
  }
);

export const getComponentById = createSelector(
  getComponentsState,
  (state: fromComponents.State, id: string) => state.entities[id]
);

export const linkDefinitions = ['link', 'buttonLink'];
export const getLinkComponents = createSelector(getComponentList, (componentList: BakeryComponent[]) => {
  return componentList.filter((component: BakeryComponent) => linkDefinitions.includes(component.definitionId));
});

export const getUiDataSourceComponents = createSelector(getComponentList, (componentList: BakeryComponent[]) => {
  return componentList.filter((component: BakeryComponent) => uiDataSourceElements.includes(component.definitionId));
});

export const canRemoveSpace = createSelector(getToolsState, (state: fromTools.State, spaceId: string) => {
  const space: BakeryComponent = state.components.entities[spaceId];

  if (!space) {
    return false;
  }

  const parentSlot: Slot = state.slots.entities[space.parentSlotId];

  // space can be deleted if its last space inside other space
  if (parentSlot.parentComponentId) {
    const parentComponent = state.components.entities[parentSlot.parentComponentId];
    if (parentComponent.definitionId === 'space') {
      return true;
    }
  }

  const friends: BakeryComponent[] = state.components.ids
    .map(id => state.components.entities[id])
    .filter((component: BakeryComponent) => component.parentSlotId === space.parentSlotId);

  // last root space cannot be removed
  return friends.length > 1;
});

// Returns all component's sub entities including passed component
export function getSubEntitiesByComponentIdProjector(
  componentList: BakeryComponent[],
  componentMap: Dictionary<BakeryComponent>,
  slotList: Slot[],
  id: string
) {
  const childSlots: Slot[] = [];
  const childComponents: BakeryComponent[] = [];
  const componentsToCheck: BakeryComponent[] = [];

  const slots: Slot[] = slotList.filter((slot: Slot) => slot.parentComponentId === id);

  for (const slot of slots) {
    const childrenIds = componentList.filter((comp: BakeryComponent) => comp.parentSlotId === slot.id);
    componentsToCheck.push(...childrenIds);
    childSlots.push(slot);
  }

  for (const child of componentsToCheck) {
    childComponents.push(child);

    const slotsToCheck: Slot[] = slotList.filter((slot: Slot) => slot.parentComponentId === child.id);

    for (const slot of slotsToCheck) {
      const childrenIds = componentList.filter((comp: BakeryComponent) => comp.parentSlotId === slot.id);
      componentsToCheck.push(...childrenIds);
      childSlots.push(slot);
    }
  }
  return { componentList: childComponents, slotList: childSlots };
}

export const isRootComponent = createSelector(
  getComponentList,
  getSlotList,
  (componentList: BakeryComponent[], slotList: Slot[], child: BakeryComponent) => {
    const parentSlot: Slot = slotList.find((slot: Slot) => child.parentSlotId === slot.id);

    // It's a root component if it lays directly at the page
    if (parentSlot.parentPageId || parentSlot.headerSlot) {
      return true;
    }

    const parent: BakeryComponent = componentList.find(
      (component: BakeryComponent) => parentSlot.parentComponentId === component.id
    );

    // Otherwise, it's root, if it lays in another component which is not space
    return parent && !isSpace(parent);
  }
);

export const getParentListComponent = createSelector(
  getToolsState,
  (toolState: fromTools.State, initialComponentId: string): BakeryComponent[] => {
    const componentEntities: Dictionary<BakeryComponent> = toolState.components.entities;
    const slotEntities: Dictionary<Slot> = toolState.slots.entities;

    const componentsToCheck = [initialComponentId];
    const sequenceList: BakeryComponent[] = [];

    for (const componentId of componentsToCheck) {
      const component = componentEntities[componentId];
      if (!component) {
        continue;
      }

      const sequence: SequenceProperty = component.properties[ComponentLogicPropName.SEQUENCE_PROPERTY];
      if (sequence && sequence.code) {
        sequenceList.push(component);
      }

      const parentSlot: Slot = slotEntities[component.parentSlotId];
      // It could be undefined in case a component moved as it first removed and then added back.
      if (!parentSlot) {
        continue;
      }
      const parent = parentSlot.parentComponentId;
      componentsToCheck.push(parent);
    }

    return sequenceList;
  }
);
