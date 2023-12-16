import { Injectable } from '@angular/core';
import {
  BreakpointWidth,
  DivideSpace,
  DivideSpaceType,
  nextComponentId,
  nextSlotId,
  OvenComponent,
  SpaceWidth,
  SpaceWidthType
} from '@common';
import { Action, select, Store } from '@ngrx/store';
import { getComponentById, getSlotComponents } from '@tools-state/component/component.selectors';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap, take, withLatestFrom } from 'rxjs/operators';

import { StateConverterService } from '@shared/communication/state-converter.service';
import { ComponentNameService } from '@tools-state/component/component-name.service';
import { ComponentActions } from '@tools-state/component/component.actions';
import { BakeryComponent } from '@tools-state/component/component.model';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { Slot } from '@tools-state/slot/slot.model';
import { getSlotByParentId, getSlotParent } from '@tools-state/slot/slot.selectors';
import { fromTools } from '@tools-state/tools.reducer';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { defaultSpaceProperties, defaultSpaceStyles } from '@tools-state/util/instance-creation.helper';

@Injectable({ providedIn: 'root' })
export class DivideSpaceService {
  constructor(
    private store: Store<fromTools.State>,
    private componentContainerService: ComponentNameService,
    private stateConverter: StateConverterService
  ) {
  }

  divide({ id: spaceId, type }: DivideSpace) {
    this.store
      .pipe(
        select(getSlotByParentId, spaceId),
        take(1),
        mergeMap((slot: Slot) => {
          const {
            slotList,
            spaceList
          }: { slotList: Slot[]; spaceList: BakeryComponent[] } = this.createSpaceWithSlotList(type, slot.id);
          return forkJoin({
            spaceList: this.componentContainerService.addComponentIndexIfNeeded(spaceList),
            slotList: of(slotList),
            parentSpace: this.store.pipe(select(getComponentById, spaceId), take(1))
          });
        })
      )
      .subscribe((data: { slotList: Slot[]; spaceList: BakeryComponent[]; parentSpace: BakeryComponent }) => {
        this.store.dispatch(
          new ComponentActions.UpdateComponent({
            id: data.parentSpace.id,
            changes: {
              styles: { ...data.parentSpace.styles },
              properties: { ...data.parentSpace.properties }
            }
          })
        );
        this.store.dispatch(new ComponentActions.AddComponentList(data.spaceList));
        this.store.dispatch(new SlotActions.AddSlotList(data.slotList));
        this.store.dispatch(new WorkingAreaActions.SyncState());
        this.store.dispatch(new ComponentActions.SelectComponent([data.spaceList[0].id]));
        this.store.dispatch(new ProjectActions.UpdateProject());
        this.store.dispatch(new HistoryActions.Persist());
      });
  }

  updateParentContainerOnDelete(parentSlotId: string, removedComponentDefinitionId: string): Observable<Action> {
    return this.store.pipe(
      select(getSlotComponents, parentSlotId),
      take(1),
      withLatestFrom(this.store.pipe(select(getSlotParent, parentSlotId))),
      map(([componentList, parent]: [BakeryComponent[], BakeryComponent]) => {
        if (!parent || removedComponentDefinitionId !== 'space' || componentList.length !== 1) {
          return null;
        }
        return new ComponentActions.UpdateComponent({
          id: parent.id,
          changes: {
            styles: { ...parent.styles },
            properties: { ...parent.properties }
          }
        });
      })
    );
  }

  private createSpaceWithSlotList(
    type: DivideSpaceType,
    parentSlotId: string
  ): { slotList: Slot[]; spaceList: BakeryComponent[] } {
    const ovenRootComponent: OvenComponent = this.createSpace(0, 0, parentSlotId);
    if (type === DivideSpaceType.COL_1_1) {
      ovenRootComponent.slots.content.componentList.push(this.createSpace(12, 0));
      ovenRootComponent.slots.content.componentList.push(this.createSpace(12, 1));
    }
    if (type === DivideSpaceType.ROW_1_1) {
      ovenRootComponent.slots.content.componentList.push(this.createSpace(6, 0));
      ovenRootComponent.slots.content.componentList.push(this.createSpace(6, 1));
    }
    if (type === DivideSpaceType.ROW_2_2) {
      ovenRootComponent.slots.content.componentList.push(this.createSpace(6, 0));
      ovenRootComponent.slots.content.componentList.push(this.createSpace(6, 1));
      ovenRootComponent.slots.content.componentList.push(this.createSpace(6, 2));
      ovenRootComponent.slots.content.componentList.push(this.createSpace(6, 3));
    }
    if (type === DivideSpaceType.COL_2_1) {
      ovenRootComponent.slots.content.componentList.push(this.createSpace(6, 0));
      ovenRootComponent.slots.content.componentList.push(this.createSpace(6, 1));
      ovenRootComponent.slots.content.componentList.push(this.createSpace(12, 2));
    }
    if (type === DivideSpaceType.COL_1_2) {
      ovenRootComponent.slots.content.componentList.push(this.createSpace(12, 0));
      ovenRootComponent.slots.content.componentList.push(this.createSpace(6, 1));
      ovenRootComponent.slots.content.componentList.push(this.createSpace(6, 2));
    }
    if (type === DivideSpaceType.ROW_1_2) {
      ovenRootComponent.slots.content.componentList.push(this.createSpace(6, 0));
      const dividedSpace = this.createSpace(6, 1, nextSlotId());
      dividedSpace.slots.content.componentList.push(this.createSpace(12, 0));
      dividedSpace.slots.content.componentList.push(this.createSpace(12, 1));
      ovenRootComponent.slots.content.componentList.push(dividedSpace);
    }
    if (type === DivideSpaceType.ROW_2_1) {
      const dividedSpace = this.createSpace(6, 0, nextSlotId());
      dividedSpace.slots.content.componentList.push(this.createSpace(12, 0));
      dividedSpace.slots.content.componentList.push(this.createSpace(12, 1));
      ovenRootComponent.slots.content.componentList.push(dividedSpace);
      ovenRootComponent.slots.content.componentList.push(this.createSpace(6, 1));
    }
    const { slots, components }: { slots: Slot[]; components: BakeryComponent[] } = this.stateConverter.getSubEntities(
      ovenRootComponent
    );
    // remove first slot from ovenRootComponent
    const slotList = slots.slice(1);
    return { spaceList: components, slotList };
  }

  private createSpace(cols: number, index: number, slotId: string = nextSlotId()): OvenComponent {
    const width: SpaceWidth = {
      type: SpaceWidthType.CUSTOM,
      customUnit: 'col',
      customValue: cols
    };

    return {
      id: nextComponentId(),
      definitionId: 'space',
      styles: { [BreakpointWidth.Desktop]: { ...defaultSpaceStyles, width } },
      properties: { ...defaultSpaceProperties },
      index,
      slots: {
        content: {
          id: slotId,
          componentList: []
        }
      },
      actions: {
        init: []
      }
    };
  }
}
