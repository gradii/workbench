import { KitchenComponent } from '@common';
import { BaseVisitor } from '../base-visitor';
import { Constructor } from '../helper';

export interface Space {
  visitSpace(node: KitchenComponent): void;
}

export type SpaceCtor = Constructor<Space>;

export function mixinSpace<T extends Constructor<BaseVisitor | any>>(base: T): SpaceCtor & T {
  return class _Self extends base {
    visitSpace(node: KitchenComponent) {
      const slotContent   = node.slots?.content;
      const id            = node.id;
      const { name }      = node.properties;
      const { xl }        = node.styles;
      const { direction } = xl;

      let output = `<div triDropFlexContainer uid="${name}"`;
      output += ` class="space`;
      if (direction === 'column') {
        output += ` flex-column`;
      } else {
        output += ` flex-row`;
      }
      output += `"`;
      if (direction === 'column') {
        output += ` triDropFlexContainerOrientation="vertical"`;
      } else {
        output += ` triDropFlexContainerOrientation="horizontal"`;
      }

      output += ` [triDropFlexContainerData]="{id: '${id}', name: '${name}'}"`;
      output += ` (triDropFlexContainerDropped)="onDragDropped($event)"`;

      output += `>`;
      this.incWrite(output);
      if (slotContent) {
        this.visit(slotContent);
      }
      this.writeDec(`</div>`);
    }
  };
}