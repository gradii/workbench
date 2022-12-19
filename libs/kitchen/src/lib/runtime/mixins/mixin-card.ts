import { KitchenComponent } from '@common/public-api';
import { BaseVisitor } from '../base-visitor';
import { PureElementNode } from '../builder/builder-node/pure-node';
import { Constructor } from '../helper';

export interface Card {
  visitCard(node: KitchenComponent): void;

  visitElementCard(node: KitchenComponent): PureElementNode;
}

export type CardCtor = Constructor<Card>;

export function mixinCard<T extends Constructor<BaseVisitor | any>>(base: T): CardCtor & T {
  return class _Self extends base {
    visitElementCard(this: _Self & BaseVisitor, node: KitchenComponent) {
      const slotHeader = node.slots?.header;
      const slotBody   = node.slots?.body;
      const slotFooter = node.slots?.footer;

      const { id, definitionId, parentSlotId }          = node;
      const { name, container, showHeader, showFooter } = node.properties;
      const { size }                                    = node.styles.xl;

      const element: PureElementNode = this.templateBuilder.newElementNode('tri-card', false);

      element.addAttribute('uid', name);
      element.addAttribute('_kitchenRuntime');
      element.addAttribute('_kitchenRuntimeComponentId', id);
      element.addAttribute('_kitchenRuntimeDefinitionId', definitionId);
      element.addAttribute('triDrag');
      element.addInputAttribute('triDragData', {
        id, name, parentSlotId
      });

      if (size) {
        element.addInputAttribute('kitchenWithSize', size);
      }

      if (showHeader && slotHeader) {
        const headerElement = this.visitElementSlot(slotHeader, {
          name    : 'header',
          selector: 'tri-card-header'
        });

        element.children.push(headerElement);
      }

      if (slotBody) {
        const bodyElement = this.visitElementSlot(slotBody, {
          name    : 'body',
          selector: 'tri-card-body'
        });

        element.children.push(bodyElement);
      }

      if (showFooter && slotFooter) {
        const footerElement = this.visitElementSlot(slotFooter, {
          name    : 'footer',
          selector: 'tri-card-footer'
        });

        element.children.push(footerElement);
      }

      return element;
    }
  };
}
