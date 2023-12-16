import { IterableDiffer } from '@angular/core';
import { OvenComponent, OvenSlot, RootComponentType } from '@common';

import { View } from './definitions';
import { DevUIRef } from './dev-ui/dev-ui-ref';

export class VirtualComponent {
  readonly slotsDiffers = new Map<string, IterableDiffer<OvenComponent>>();
  readonly view: View<any>;

  index: number;
  parentSlot: OvenSlot;
  component: OvenComponent;
  parentComponent: VirtualComponent;
  rootType: RootComponentType;

  constructor(virtualComponent: Partial<VirtualComponent>) {
    Object.assign(this, virtualComponent);
  }
}
