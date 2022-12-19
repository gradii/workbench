import { KitchenComponent } from '@common';
import { isBoolean, isString } from '@gradii/check-type';
import { BaseVisitor } from '../base-visitor';
import { Constructor, escapeHtml } from '../helper';

export interface Button {
  visitButton(node: KitchenComponent): void;
}

export type ButtonCtor = Constructor<Button>;

export function mixinButton<T extends Constructor<BaseVisitor | any>>(base: T): ButtonCtor & T {
  return class _Self extends base {
    // _resolveProperty(properties: Record<string, any>): string[] {
    //   let rst = [];
    //   for (let [key, val] of Object.entries(properties)) {
    //     // if(isBinding(val)) {
    //     //   return `[${key}]="${val}"`;
    //     // }
    //     rst.push(`${key}="${val}"`);
    //   }
    //   return rst;
    // }

    _resolveKeyValuePair(key, value) {
    }

    visitButton(node: KitchenComponent) {
      const id                       = node.id;
      const { name, text, ...props } = node.properties;

      let output = `<button triButton uid="${name}"`;

      output += ` triDrag [triDragData]="{id: '${id}', name: '${name}'}"`;
      for (const [key, val] of Object.entries(props)) {
        if (isString(val)) {
          output += ` ${key}="${val}"`;
        } else if (isBoolean(val)) {
          output += ` [${key}]="${val}"`;
        } else {
          output += ` ${key}="${val}"`;
        }
      }
      output += '>';
      if (text) {
        output += escapeHtml(text);
      }
      output += '</button>';

      this.writeLn(output);
    }
  };
}
