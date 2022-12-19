import { KitchenComponent } from '@common';
import { BaseVisitor } from '../base-visitor';
import { Constructor } from '../helper';

export interface Card {
  visitCard(node: KitchenComponent): void;
}

export type CardCtor = Constructor<Card>;

export function mixinCard<T extends Constructor<BaseVisitor | any>>(base: T): CardCtor & T {
  return class _Self extends base {
    visitCard(node: KitchenComponent) {
      const slotHeader = node.slots?.header;
      const slotBody   = node.slots?.body;
      const slotFooter = node.slots?.footer;

      const id       = node.id;
      const { name } = node.properties;

      let output = `<tri-card`;
      output += ` triDrag [triDragData]="{id: '${id}', name: '${name}'}"`;
      output += `>`;
      this.writeLn(output);

      this.incWrite(`<tri-card-header>`);
      if (slotHeader) {
        slotHeader.componentList.forEach(it => {
          this.visit(it);
        });
      }
      this.writeDec(`</tri-card-header>`);

      this.incWrite(`<tri-card-body>`);
      if (slotBody) {
        slotBody.componentList.forEach(it => {
          this.visit(it);
        });
      }
      this.writeDec(`</tri-card-body>`);

      this.incWrite(`<tri-card-footer>`);
      if (slotFooter) {
        slotFooter.componentList.forEach(it => {
          this.visit(it);
        });
      }
      this.writeDec(`</tri-card-footer>`);

      this.writeLn(`</tri-card>`);
    }
  };
}
