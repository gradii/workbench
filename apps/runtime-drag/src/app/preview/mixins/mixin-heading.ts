import { KitchenComponent } from '@common';
import { BaseVisitor } from '../base-visitor';
import { Constructor } from '../helper';

export interface Heading {
  visitHeading(node: KitchenComponent): void;
}

export type HeadingCtor = Constructor<Heading>;

export function mixinHeading<T extends Constructor<BaseVisitor | any>>(base: T): HeadingCtor & T {
  return class _Self extends base {
    visitHeading(node: KitchenComponent) {
      const id             = node.id;
      const { name, type } = node.properties;

      let output = `<${type} uid="${name}"`;

      output += ` triDrag [triDragData]="{id: '${id}', name: '${name}'}"`;
      let clazzList = [];
      if (node.properties.alignment !== 'left') {
        clazzList.push(`text-${node.properties.alignment}`);
      }
      if (node.properties.italic) {
        clazzList.push(`text-${node.properties.italic}`);
      }
      if (clazzList.length) {
        output += ` class="${clazzList.join(' ')}"`;
      }
      if (node.properties.transform && node.properties.transform !== 'none') {
        output += ` transform=${node.properties.transform}`;
      }
      output += '>';
      this.writeLn(output);
      if (node.properties.text) {
        this.incWrite(node.properties.text);
        this.decIdent();
      }
      this.writeLn(`</${type}>`);
    }
  };
}