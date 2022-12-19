import { KitchenComponent } from '@common';
import { BaseVisitor } from '../base-visitor';
import { Constructor } from '../helper';

export interface Accordion {
  visitAccordion(node: KitchenComponent): void;
}

export type AccordionCtor = Constructor<Accordion>;

export function mixinAccordion<T extends Constructor<BaseVisitor | any>>(base: T): AccordionCtor & T {
  return class _Self extends base {
    visitAccordion(node: KitchenComponent) {
      const { name } = node.properties;
      let output     = `<tri-accordion uid="${name}" triDrag`;
      output += '>';
      this.writeLn(output);
      this.writeLn(`</tri-accordion>`);
    }
  };
}
