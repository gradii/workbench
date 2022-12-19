import { KitchenComponent } from '@common/public-api';
import { isBoolean, isString } from '@gradii/check-type';
import { BaseVisitor } from '../base-visitor';
import { PureElementNode } from '../builder/builder-node/pure-node';
import { binding } from '../builder/template-builder';
import { Constructor, escapeHtml } from '../helper';

export interface Button {
  visitButton(node: KitchenComponent): void;

  visitElementButton(node: KitchenComponent): PureElementNode;
}

export type ButtonCtor = Constructor<Button>;

export function mixinButton<T extends Constructor<BaseVisitor | any>>(base: T): ButtonCtor & T {
  return class _Self extends base {

    _resolveKeyValuePair(key, value) {
    }

    visitElementButton(node: KitchenComponent) {
      const { id, definitionId, parentSlotId } = node;
      const { name, text, ...props }           = node.properties;

      const elementNode = this.templateBuilder.newElementNode('button');
      elementNode.addAttribute('triButton');
      elementNode.addAttribute('uid', name);
      elementNode.addAttribute('_kitchenRuntime');
      elementNode.addAttribute('_kitchenRuntimeComponentId', id);
      elementNode.addAttribute('_kitchenRuntimeDefinitionId', definitionId);
      elementNode.addAttribute('triDrag');
      elementNode.addInputAttribute('triDragData', {
        id, name, parentSlotId
      });

      for (const [key, val] of Object.entries(props)) {
        if (isString(val)) {
          elementNode.addAttribute(key, val);
        } else if (isBoolean(val)) {
          elementNode.addInputAttribute(key, binding(val));
        } else {
          elementNode.addAttribute(key, val);
        }
      }

      if (text) {
        elementNode.addTextContent(escapeHtml(text));
      }

      return elementNode;
    }
  };
}
