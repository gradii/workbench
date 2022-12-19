import { KitchenSlot } from '@common';
import { BaseVisitor } from '../base-visitor';
import { Constructor } from '../helper';

export interface Slot {
  visitSlot(node: KitchenSlot): void;
}

export type SlotCtor = Constructor<Slot>;

export function mixinSlot<T extends Constructor<BaseVisitor | any>>(base: T): SlotCtor & T {
  return class _Self extends base {
    visitSlot(node: KitchenSlot) {
      this.incIdent(1);
      node.componentList.forEach(it => {
        this.visit(it);
      });
      this.decIdent(1);
    }
  };
}
