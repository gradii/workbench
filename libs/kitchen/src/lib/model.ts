import { IterableDiffer } from '@angular/core';
import { KitchenComponent, KitchenSlot, RootComponentType } from '@common/public-api';

import { View } from './definitions';
import { DevUIRef } from './dev-ui/dev-ui-ref';

export class VirtualComponent {
  readonly slotsDiffers = new Map<string, IterableDiffer<KitchenComponent>>();
  readonly view: View<any>;

  index: number;
  parentSlot: KitchenSlot;
  component: KitchenComponent;
  parentComponent: VirtualComponent;
  rootType: RootComponentType;

  constructor(virtualComponent: Partial<VirtualComponent>) {
    Object.assign(this, virtualComponent);
  }
}


/**
 * @deprecated
 */
export class FlourComponent {
  /**
   * @deprecated
   */
  readonly view: View<any>;

  htmlElement: HTMLElement;
  index: number;
  parentSlot: KitchenSlot | null;
  component: KitchenComponent;
  // todo add parentComponent
  parentComponent: FlourComponent;
  rootType: RootComponentType;
  readonly slotsDiffers = new Map<string, IterableDiffer<KitchenComponent>>();

  constructor(virtualComponent: Partial<FlourComponent>) {
    Object.assign(this, virtualComponent);
  }
}


export class FlourSelectableComponent {

}