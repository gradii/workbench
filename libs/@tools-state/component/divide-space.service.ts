import { Injectable } from '@angular/core';
import {
  BreakpointWidth, DivideSpace, DivideSpaceType, KitchenComponent, KitchenType, nextComponentId, nextSlotId, SpaceWidth,
  SpaceWidthType
} from '@common/public-api';
import { dispatch } from '@ngneat/effects';
import { Action } from '@ngneat/effects/lib/actions.types';

import { StateConverterService } from '@shared/communication/state-converter.service';
import { ComponentNameService } from '@tools-state/component/component-name.service';
import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponent } from '@tools-state/component/component.model';
import { getComponentById, getSlotComponents } from '@tools-state/component/component.selectors';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { getSlotByParentId, getSlotParent } from '@tools-state/slot/slot.selectors';
import { defaultSpaceProperties, defaultSpaceStyles } from '@tools-state/util/instance-creation.helper';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap, take, withLatestFrom } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DivideSpaceService {
  constructor(
    private componentContainerService: ComponentNameService,
    private stateConverter: StateConverterService
  ) {
  }

  divide({ id: spaceId, type }: DivideSpace) {
    getSlotByParentId(spaceId)
      .pipe(
        take(1),
        mergeMap((slot: PuffSlot) => {
          const {
                  slotList,
                  spaceList
                }: { slotList: PuffSlot[]; spaceList: PuffComponent[] } = this.createSpaceWithSlotList(type, slot.id);
          return forkJoin({
            spaceList  : this.componentContainerService.addComponentIndexIfNeeded(spaceList),
            slotList   : of(slotList),
            parentSpace: getComponentById(spaceId).pipe(take(1))
          });
        })
      )
      .subscribe((data: { slotList: PuffSlot[]; spaceList: PuffComponent[]; parentSpace: PuffComponent }) => {
        dispatch(
          ComponentActions.UpdateComponent({
            styles    : { ...data.parentSpace.styles },
            properties: { ...data.parentSpace.properties },
            id        : data.parentSpace.id
          })
        );
        dispatch(ComponentActions.AddComponentList(data.spaceList));
        dispatch(SlotActions.AddSlotList(data.slotList));
        dispatch(WorkingAreaActions.SyncState());
        dispatch(ComponentActions.SelectComponent([data.spaceList[0].id]));
        dispatch(ProjectActions.UpdateProject());
        dispatch(HistoryActions.Persist());
      });
  }

  /**
   * @deprecated no use to update parent space
   * @param parentSlotId
   * @param removedComponentDefinitionId
   */
  updateParentContainerOnDelete(parentSlotId: string, removedComponentDefinitionId: string): Observable<Action> {
    return getSlotComponents(parentSlotId).pipe(
      take(1),
      withLatestFrom(getSlotParent(parentSlotId)),
      map(([componentList, parent]: [PuffComponent[], PuffComponent]) => {
        if (!parent || removedComponentDefinitionId !== 'space' || componentList.length !== 1) {
          return null;
        }
        return ComponentActions.UpdateComponent({
          styles    : { ...parent.styles },
          properties: { ...parent.properties },
          id        : parent.id
        });
      })
    );
  }

  private createSpaceWithSlotList(
    type: DivideSpaceType,
    parentSlotId: string
  ): { slotList: PuffSlot[]; spaceList: PuffComponent[] } {
    const kitchenRootComponent: KitchenComponent = this.createSpace(0, 0, parentSlotId);
    if (type === DivideSpaceType.COL_1_1) {
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(12, 0));
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(12, 1));
    }
    if (type === DivideSpaceType.ROW_1_1) {
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(6, 0));
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(6, 1));
    }
    if (type === DivideSpaceType.ROW_2_2) {
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(6, 0));
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(6, 1));
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(6, 2));
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(6, 3));
    }
    if (type === DivideSpaceType.COL_2_1) {
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(6, 0));
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(6, 1));
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(12, 2));
    }
    if (type === DivideSpaceType.COL_1_2) {
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(12, 0));
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(6, 1));
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(6, 2));
    }
    if (type === DivideSpaceType.ROW_1_2) {
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(6, 0));
      const dividedSpace = this.createSpace(6, 1, nextSlotId());
      dividedSpace.slots.content.componentList.push(this.createSpace(12, 0));
      dividedSpace.slots.content.componentList.push(this.createSpace(12, 1));
      kitchenRootComponent.slots.content.componentList.push(dividedSpace);
    }
    if (type === DivideSpaceType.ROW_2_1) {
      const dividedSpace = this.createSpace(6, 0, nextSlotId());
      dividedSpace.slots.content.componentList.push(this.createSpace(12, 0));
      dividedSpace.slots.content.componentList.push(this.createSpace(12, 1));
      kitchenRootComponent.slots.content.componentList.push(dividedSpace);
      kitchenRootComponent.slots.content.componentList.push(this.createSpace(6, 1));
    }
    const { slots, components }: { slots: PuffSlot[]; components: PuffComponent[] } = this.stateConverter.getSubEntities(
      kitchenRootComponent
    );
    // remove first slot from kitchenRootComponent
    const slotList                                                              = slots.slice(1);
    return { spaceList: components, slotList };
  }

  private createSpace(cols: number, index: number, slotId: string = nextSlotId()): KitchenComponent {
    const width: SpaceWidth = {
      type       : SpaceWidthType.CUSTOM,
      customUnit : 'col',
      customValue: cols
    };

    return {
      id          : nextComponentId(),
      type        : KitchenType.Component,
      definitionId: 'space',
      styles      : { [BreakpointWidth.Desktop]: { ...defaultSpaceStyles, width } },
      properties  : { ...defaultSpaceProperties },
      index,
      contentSlot : {
        id           : slotId,
        componentList: []
      },
      slots       : {},
      actions     : {
        init: []
      }
    };
  }
}
