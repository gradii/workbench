import { ComponentLogicPropName, KitchenType, SequenceProperty, uiDataSourceElements } from '@common/public-api';
import { select } from '@ngneat/elf';
import { selectAllEntities } from '@ngneat/elf-entities';
import { PuffComponentOrDirective } from '@tools-state/common.model';

import { PuffComponent } from '@tools-state/component/component.model';
import { fromComponents } from '@tools-state/component/component.reducer';
import { isSpace } from '@tools-state/component/utils';
import { PuffFeature } from '@tools-state/feature/feature.model';
import { getFeatureList } from '@tools-state/feature/feature.selectors';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { getSlotById, getSlotList, getSlotMap, getSlotState } from '@tools-state/slot/slot.selectors';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface ComponentSubEntities {
  componentList: PuffComponent[];
  featureList: PuffFeature[];
  slotList: PuffSlot[];
}

export const getComponentsState = fromComponents.fromComponentsStore;

export const getComponentList = getComponentsState.pipe(selectAllEntities());
export const getComponentMap  = getComponentsState.pipe(select((state: fromComponents.State) => state.entities));

export const getRootComponentIdAndSlotIdLists = (pageIdList: string[]) => combineLatest(
  [
    getComponentList,
    getSlotList
  ]).pipe(
  map(([componentList, slotList]: [PuffComponent[], PuffSlot[]]) => {
      const slotIdList: string[]      = slotList
        .filter(slot => pageIdList.includes(slot.parentPageId))
        .map((slot: PuffSlot) => slot.id);
      const componentIdList: string[] = componentList
        .filter(component => slotIdList.includes(component.parentSlotId))
        .map((component: PuffComponent) => component.id);
      return { slotIdList, componentIdList };
    }
  ));

export const getComponentSlotByComponentId = (parentId: string) => combineLatest(
  [
    getComponentById(parentId),
    getSlotList
  ]).pipe(
  map(([component, slotList]: [PuffComponent, PuffSlot[]]) => {
    if (component.type == KitchenType.Feature) {
      return component.parentSlotId;
    } else {
      return slotList.find((slot: PuffSlot) => slot.parentComponentId === parentId);
    }
  }));

// Returns all component's sub entities ids including passed component id
export const getSubComponentIds = ({ componentIdList, slotIdList }) => combineLatest(
  [
    getComponentList,
    getComponentMap,
    getSlotList
  ]).pipe(
  map(([
         getComponentList,
         getComponentMap,
         getSlotList
       ]) => getSubComponentIdsProjector(
      getComponentList,
      getComponentMap,
      getSlotList,
      { componentIdList, slotIdList }
    )
  )
);

// Returns all component's sub entities ids including passed component id
export const getSubComponentIdsList = (dataList: { componentIdList: string[]; slotIdList: string[] }[]) => (
  combineLatest(
    [
      getComponentList,
      getComponentMap,
      getSlotList
    ]
  ).pipe(
    map((
      [componentList, componentMap, slotList]: [PuffComponent[], Partial<PuffComponent>, PuffSlot[]]
    ) => {
      return dataList.map(dataItem => getSubComponentIdsProjector(componentList, componentMap, slotList, dataItem));
    })
  )
);

export const getNearestSiblingOrParentComponentId = (props: { componentIdList: string[] }) => (
  combineLatest(
    [
      getComponentList,
      getComponentMap,
      getSlotList,
      getSlotMap
    ]
  ).pipe(
    map((
        [componentList, componentMap, slotList, slotMap]: [PuffComponent[], Partial<PuffComponent>, PuffSlot[], Partial<PuffSlot>]
      ) => {
        const { componentIdList } = props;

        for (const componentId of componentIdList) {
          const parent: PuffComponent      = getParent(componentList, componentMap, slotMap, componentId);
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

        return null;
      }
    )));

function getParent(
  componentList: PuffComponent[],
  componentMap: Partial<PuffComponent>,
  slotMap: Partial<PuffSlot>,
  componentId: string
): PuffComponent {
  const component: PuffComponent = componentMap[componentId];

  if (!component) {
    return null;
  }

  const parentSlotId: string = component.parentSlotId;
  const slot: PuffSlot       = slotMap[parentSlotId];
  return componentMap[slot.parentComponentId];
}

function getNearestSibling(
  componentList: PuffComponent[],
  componentMap: Partial<PuffComponent>,
  slotMap: Partial<PuffSlot>,
  componentId: string
): PuffComponent[] {
  const siblings: PuffComponent[] = getSiblings(componentList, componentMap, slotMap, componentId);

  if (!siblings) {
    return [];
  }

  const currentIndex: number       = siblings.findIndex((component: PuffComponent) => component.id === componentId);
  const prevSibling: PuffComponent = siblings[currentIndex - 1];
  const nextSibling: PuffComponent = siblings[currentIndex + 1];

  return [prevSibling, nextSibling];
}

function getSiblings(
  componentList: PuffComponent[],
  componentMap: Partial<PuffComponent>,
  slotMap: Partial<PuffSlot>,
  componentId: string
): PuffComponent[] {
  const component: PuffComponent = componentMap[componentId];

  if (!component) {
    return null;
  }

  const parentSlotId: string = component.parentSlotId;
  return componentList.filter((c: PuffComponent) => c.parentSlotId === parentSlotId);
}

function getSubComponentIdsProjector(
  componentList: PuffComponent[],
  componentMap: Partial<PuffComponent>,
  slotList: PuffSlot[],
  { componentIdList, slotIdList }
) {
  const slotsIds: string[]            = [...slotIdList];
  const childIds: string[]            = [];
  const componentIdsToCheck: string[] = [...componentIdList];

  for (const componentId of componentIdsToCheck) {
    childIds.push(componentId);

    const slots: PuffSlot[] = slotList.filter((slot: PuffSlot) => slot.parentComponentId === componentId);

    for (const slot of slots) {
      const childrenIds = componentList
        .filter((comp: PuffComponent) => comp.parentSlotId === slot.id)
        .map((component: PuffComponent) => component.id);
      componentIdsToCheck.push(...childrenIds);
      slotsIds.push(slot.id);
    }
  }
  return { componentIdList: childIds, slotIdList: slotsIds };
}

export const getSubEntitiesByComponentList = (targetList: PuffComponent[]) => (
  combineLatest([
    getComponentList,
    getComponentMap,
    getFeatureList,
    getSlotList
  ]).pipe(
    map((
        [
          componentList, componentMap, featureList, slotList
        ]: [
          PuffComponent[], Partial<PuffComponent>, PuffFeature[], PuffSlot[]
        ]
      ) => {
        return targetList.map((c: PuffComponent) =>
          getSubEntitiesByComponentIdProjector(componentList, componentMap, featureList, slotList, c.id)
        );
      }
    )
  )
);

export const getSlotComponentList = (slotId: string) => (
  getComponentList.pipe(
    select((componentList: PuffComponent[]) =>
      componentList.filter((component: PuffComponent) => component.parentSlotId === slotId)
    )
  )
);

export const getActiveComponentList = getComponentsState.pipe(
  select((state: fromComponents.State) => {
    return state.activeComponentIdList.map((id: string) => state.entities[id]);
  })
);

export const getClosestSpaceSlotByComponent = (componentId: string) => (
  combineLatest(
    [
      getComponentList,
      getSlotList
    ]
  ).pipe(
    select((
        [componentList, slotList]: [PuffComponent[], PuffSlot[]]
      ) => {
        const slot  = slotList.find((s: PuffSlot) => s.parentComponentId === componentId);
        const space = componentList.find((c: PuffComponent) => c.parentSlotId === slot.id);
        return slotList.find((s: PuffSlot) => s.parentComponentId === space.id);
      }
    )
  )
);

export const getActiveComponentIdList = getComponentsState.pipe(select((state: fromComponents.State) => {
  return state.activeComponentIdList;
}));

export const getActiveComponent = getActiveComponentList.pipe(select((componentList: PuffComponent[]) => {
  return componentList.length === 1 ? componentList[0] : null;
}));

export const getActiveSlot = getActiveComponentIdList.pipe(
  switchMap((activeComponentIds) => {
    if (activeComponentIds && activeComponentIds.length) {
      return getSlotById(activeComponentIds[0]);
    } else {
      return EMPTY;
    }
  })
);


export const getSlotComponents = (slotId: string) => getComponentList.pipe(select(
  (componentList: PuffComponent[]) => {
    return componentList.filter((component: PuffComponent) => component.parentSlotId === slotId);
  }
));

export const getRootSlotComponent = (slotId: string) => getComponentList.pipe(select(
  (componentList: PuffComponent[]) => {
    return componentList.filter((component: PuffComponent) => component.parentSlotId === slotId)[0];
  }
));

export const getComponentById = (id: string) => getComponentsState.pipe(
  select((state: fromComponents.State) => state.entities[id])
);

export const linkDefinitions   = ['link', 'buttonLink'];
export const getLinkComponents = getComponentList.pipe(select((componentList: PuffComponent[]) => {
  return componentList.filter((component: PuffComponent) => linkDefinitions.includes(component.definitionId));
}));

export const getUiDataSourceComponents = getComponentList.pipe(select((componentList: PuffComponent[]) => {
  return componentList.filter((component: PuffComponent) => uiDataSourceElements.includes(component.definitionId));
}));

export const canRemoveSpace = (spaceId: string) => combineLatest([
  getComponentsState,
  getSlotState
]).pipe(
  select(([components, slots]) => {
    const space: PuffComponent = components.entities[spaceId];

    if (!space) {
      return false;
    }

    const parentSlot: PuffSlot = slots.entities[space.parentSlotId];

    // space can be deleted if its last space inside other space
    if (parentSlot.parentComponentId) {
      const parentComponent = components.entities[parentSlot.parentComponentId];
      if (parentComponent.definitionId === 'space') {
        return true;
      }
    }

    const friends: PuffComponent[] = components.ids
      .map(id => components.entities[id])
      .filter((component: PuffComponent) => component.parentSlotId === space.parentSlotId);

    // last root space cannot be removed
    return friends.length > 1;
  })
);

// Returns all component's sub entities including passed component
export function getSubEntitiesByComponentIdProjector(
  componentList: PuffComponentOrDirective[],
  componentMap: Partial<PuffComponent>,
  featureList: PuffFeature[],
  slotList: PuffSlot[],
  id: string
) {
  const childSlots: PuffSlot[]           = [];
  const childComponents: PuffComponent[] = [];
  const componentsToCheck: PuffComponent[] = [];

  const features: PuffFeature[] = featureList.filter((feature: PuffFeature) => feature.hostId === id);
  const slots: PuffSlot[]       = slotList.filter((slot: PuffSlot) => slot.parentComponentId === id);

  // region slot children component
  // todo maybe can be removed
  for (const slot of slots) {
    const childrenIds = componentList.filter<PuffComponent>(
      (comp: PuffComponent): comp is PuffComponent => comp.parentSlotId === slot.id);
    componentsToCheck.push(...childrenIds);
    childSlots.push(slot);
  }

  for (const child of componentsToCheck) {
    childComponents.push(child);

    const slotsToCheck: PuffSlot[] = slotList.filter((slot: PuffSlot) => slot.parentComponentId === child.id);

    for (const slot of slotsToCheck) {
      const childrenIds = componentList.filter(
        (comp: PuffComponent): comp is PuffComponent => comp.parentSlotId === slot.id);
      componentsToCheck.push(...childrenIds);
      childSlots.push(slot);
    }
  }

  // endregion

  return {
    componentList: childComponents,
    featureList  : features,
    slotList     : childSlots
  };
}

export const isRootComponent = (child: PuffComponent) => (
  combineLatest(
    [getComponentList, getSlotList]
  ).pipe(
    map(([componentList, slotList]: [PuffComponent[], PuffSlot[]]) => {
      const parentSlot: PuffSlot = slotList.find((slot: PuffSlot) => child.parentSlotId === slot.id);

      // It's a root component if it lays directly at the page
      if (parentSlot.parentPageId || parentSlot.headerSlot) {
        return true;
      }

      const parent: PuffComponent = componentList.find(
        (component: PuffComponent) => parentSlot.parentComponentId === component.id
      );

      // Otherwise, it's root, if it lays in another component which is not space
      return parent && !isSpace(parent);
    })
  ));

export const getParentListComponent = (initialComponentId: string): Observable<PuffComponent[]> => {
  return combineLatest([
    getComponentList,
    getFeatureList,
    getSlotList
  ]).pipe(map(([
                 componentEntities,
                 featureEntities,
                 slotEntities
               ]) => {
    const componentsToCheck = [initialComponentId];

    const sequenceList: PuffComponent[] = [];

    for (const componentId of componentsToCheck) {
      const component = componentEntities[componentId];
      if (!component) {
        continue;
      }

      const sequence: SequenceProperty = component.properties[ComponentLogicPropName.SEQUENCE_PROPERTY];
      if (sequence && sequence.code) {
        sequenceList.push(component);
      }

      const parentSlot: PuffSlot = slotEntities[component.parentSlotId];
      // It could be undefined in case a component moved as it first removed and then added back.
      if (!parentSlot) {
        continue;
      }
      const parent = parentSlot.parentComponentId;
      componentsToCheck.push(parent);
    }

    return sequenceList;
  }));
};
