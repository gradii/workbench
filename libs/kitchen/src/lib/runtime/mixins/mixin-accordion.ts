import { KitchenComponent } from '@common/public-api';
import { BaseVisitor } from '../base-visitor';
import { PureElementNode } from '../builder/builder-node/pure-node';
import { Constructor } from '../helper';

export interface Accordion {
  visitAccordion(node: KitchenComponent): void;

  visitElementAccordion(node: KitchenComponent): PureElementNode;
}

export type AccordionCtor = Constructor<Accordion>;

export function mixinAccordion<T extends Constructor<BaseVisitor | any>>(base: T): AccordionCtor & T {
  return class _Self extends base {
    visitElementAccordion(this: _Self & BaseVisitor, node: KitchenComponent) {
      const { id, definitionId, parentSlotId, contentSlot } = node;

      const { name } = node.properties;

      const elementNode = this.templateBuilder.newElementNode('tri-accordion');
      elementNode.addAttribute('uid', name);
      elementNode.addAttribute('triDrag');
      elementNode.addInputAttribute('triDragData', { id, name, parentSlotId });
      elementNode.addAttribute('_kitchenRuntime');
      elementNode.addAttribute('_kitchenRuntimeComponentId', id);
      elementNode.addAttribute('_kitchenRuntimeDefinitionId', definitionId);

      if (contentSlot) {
        const contentNode = this.visitElementContentSlot(contentSlot);
        elementNode.children.push(contentNode);
      }
      return elementNode;
    }
  };
}
