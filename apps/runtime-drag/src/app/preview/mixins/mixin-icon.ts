import { KitchenComponent } from '@common';
import { BaseVisitor } from '../base-visitor';
import { Constructor } from '../helper';

export interface Icon {
  visitIcon(node: KitchenComponent): void;
}

export type IconCtor = Constructor<Icon>;

export function mixinIcon<T extends Constructor<BaseVisitor | any>>(base: T): IconCtor & T {
  return class _Self extends base {
    visitIcon(node: KitchenComponent) {
      const id             = node.id;
      const { icon, name } = node.properties;

      let output = `<tri-icon uid="${name}" triDrag`;
      output += ` triDrag [triDragData]="{id: '${id}', name: '${name}'}"`;
      output += ` svgIcon="${icon}"`;
      output += '>';
      this.writeLn(output);
      this.writeLn(`</tri-icon>`);
    }
  };
}
