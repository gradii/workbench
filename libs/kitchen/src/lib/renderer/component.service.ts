import {
  Injectable, IterableChangeRecord, IterableChanges, IterableDiffer, IterableDifferFactory, IterableDiffers
} from '@angular/core';
import { KitchenComponent, KitchenSlot, RootComponentType, SyncReasonMsg } from '@common/public-api';

import { FlourComponent } from '../model';
import { Slot, View } from '../definitions';
import { RendererService } from './renderer.service';

export interface CookRes {
  virtualComponents: Map<string, FlourComponent>;
  updates: FlourComponent[];
}

export interface CookFlourRes {
  virtualComponents: Map<string, FlourComponent>;
  updates: FlourComponent[];
}

export const NOOP_BAKE_RES = { virtualComponents: new Map(), updates: [] };

/**
 * @deprecated
 */
@Injectable()
export class ComponentService {
  private readonly differFactory: IterableDifferFactory;
  private rootDiffer: IterableDiffer<KitchenComponent>;

  private readonly virtualComponents  = new Map<string, FlourComponent>();
  private updates: FlourComponent[] = [];

  constructor(private renderer: RendererService, differs: IterableDiffers) {
    this.differFactory = differs.find([]);
  }

  cook(slot: Slot,
       rootSlot: KitchenSlot,
       rootType: RootComponentType,
       syncReason: SyncReasonMsg): CookRes {
    if (!this.rootDiffer) {
      this.rootDiffer = this.differFactory.create(this.componentTrackBy);
    }

    this.clearUpdates();
    this.checkAndUpdateComponentList(
      null, slot, rootSlot,
      this.rootDiffer, rootType, syncReason
    );
    return this.getBakeRes();
  }

  clear() {
    this.virtualComponents.clear();
    this.rootDiffer = null;
  }

  private checkAndUpdateComponentList(
    parentComponent: FlourComponent,
    slot: Slot,
    parentSlot: KitchenSlot,
    differ: IterableDiffer<KitchenComponent>,
    rootType: RootComponentType,
    syncReason: SyncReasonMsg
  ) {
    const { componentList }                          = parentSlot;
    const changes: IterableChanges<KitchenComponent> = differ.diff(componentList);

    if (changes) {
      this.resolveComponentPositionChanges(changes, slot, parentSlot, syncReason, rootType);
    }

    for (const component of componentList) {
      this.checkAndUpdateComponent(parentComponent, component, parentSlot, rootType, syncReason);
    }
  }

  private checkAndUpdateComponent(
    parentComponent: FlourComponent,
    component: KitchenComponent,
    parentSlot: KitchenSlot,
    rootType: RootComponentType,
    syncReason: SyncReasonMsg
  ) {
    const virtualComponent: FlourComponent = this.virtualComponents.get(component.id);

    const isBindingsChanged = this.bindingsChanged(component, virtualComponent.component, syncReason);

    if (isBindingsChanged) {
      this.renderer.performBinding(virtualComponent.view, component);
    }

    virtualComponent.parentComponent = parentComponent;
    virtualComponent.parentSlot      = parentSlot;
    virtualComponent.component       = component;
    virtualComponent.index           = component.index;

    if (component.slots && Object.entries(component.slots).length) {
      virtualComponent.slotsDiffers.forEach((differ, slotName: string) => {
        if (!component.slots[slotName]) {
          virtualComponent.slotsDiffers.delete(slotName);
        }
      });

      this.checkAndUpdateSlots(virtualComponent, component, rootType, syncReason);
    }

    if (isBindingsChanged) {
      this.updates.push(virtualComponent);
    }
  }

  private checkAndUpdateSlots(
    virtualComponent: FlourComponent,
    component: KitchenComponent,
    rootType: RootComponentType,
    syncReason: SyncReasonMsg
  ) {
    this.renderer.updateSlots(virtualComponent.view);
    for (const [slotId, slot] of Object.entries(component.slots)) {
      const slotDiffer: IterableDiffer<KitchenComponent> = this.getSlotDiffer(virtualComponent, slotId);
      const virtualSlot: Slot                            = virtualComponent.view.slots[slotId];
      this.checkAndUpdateComponentList(virtualComponent, virtualSlot, slot, slotDiffer, rootType, syncReason);
    }
  }

  private resolveComponentPositionChanges(
    changes: IterableChanges<KitchenComponent>,
    slot: Slot,
    parentSlot: KitchenSlot,
    syncReason: SyncReasonMsg,
    rootType: RootComponentType
  ) {
    changes.forEachOperation(
      (change: IterableChangeRecord<KitchenComponent>, previousIndex: number | null, currentIndex: number | null) => {
        const component = change.item;

        if (previousIndex === null) {
          this.createComponent(component, slot, parentSlot, currentIndex, syncReason, rootType);
        } else if (currentIndex === null) {
          this.removeComponent(component, previousIndex, slot);
        } else {
          this.moveComponent(component, currentIndex, slot);
        }
      }
    );
  }

  private createComponent(
    component: KitchenComponent,
    slot: Slot,
    parentSlot: KitchenSlot,
    index: number,
    syncReason: SyncReasonMsg,
    rootType: RootComponentType
  ) {
    const view: View<any>      = this.renderer.create(component, slot, syncReason);
    const vc: FlourComponent = new FlourComponent({
      component: {
        ...component,
        styles    : { ...component.styles },
        properties: { ...component.properties }
      },
      view,
      parentSlot,
      index,
      rootType
    });

    this.virtualComponents.set(component.id, vc);
  }

  private removeComponent(component: KitchenComponent, index: number, slot: Slot) {
    this.renderer.remove(index, slot);
    this.removeDevUI(component);
  }

  private removeDevUI(component: KitchenComponent) {
    this.virtualComponents.delete(component.id);

    if (!component.slots) {
      return;
    }

    Object.values(component.slots).forEach((slot: KitchenSlot) => {
      slot.componentList.forEach((child: KitchenComponent) => this.removeDevUI(child));
    });
  }

  private moveComponent<T>(component: KitchenComponent, index: number, slot: Slot) {
    const vc = this.virtualComponents.get(component.id);
    this.renderer.move(vc.view, index, slot);
    vc.index = index;
  }

  private getSlotDiffer(virtualComponent: FlourComponent, slotId: string) {
    if (!virtualComponent.slotsDiffers.has(slotId)) {
      const slotDiffer: IterableDiffer<KitchenComponent> = this.differFactory.create(this.componentTrackBy);
      virtualComponent.slotsDiffers.set(slotId, slotDiffer);
    }

    return virtualComponent.slotsDiffers.get(slotId);
  }

  private bindingsChanged(component1: KitchenComponent, component2: KitchenComponent,
                          syncReason?: SyncReasonMsg): boolean {
    if (!component1.styles && !component2.styles && !component1.properties && !component2.properties) {
      return false;
    }

    if (syncReason && syncReason.reason === 'breakpointChange') {
      return true;
    }

    // TODO do we really need to use JSON.stringify here?
    return (
      JSON.stringify(component1.styles) !== JSON.stringify(component2.styles) ||
      JSON.stringify(component1.properties) !== JSON.stringify(component2.properties) ||
      JSON.stringify(component1.actions) !== JSON.stringify(component2.actions)
    );
  }

  private componentTrackBy(index: number, component: KitchenComponent): string {
    return component.id;
  }

  private clearUpdates(): void {
    this.updates = [];
  }

  private getBakeRes(): CookRes {
    return {
      virtualComponents: this.virtualComponents,
      updates          : this.updates
    };
  }
}
