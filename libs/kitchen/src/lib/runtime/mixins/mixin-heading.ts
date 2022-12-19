import { KitchenComponent } from '@common/public-api';
import { BaseVisitor } from '../base-visitor';
import { PureElementNode } from '../builder/builder-node/pure-node';
import { Constructor } from '../helper';

export interface Heading {
  visitHeading(node: KitchenComponent): void;

  visitElementHeading(node: KitchenComponent): PureElementNode;
}

export type HeadingCtor = Constructor<Heading>;

export function mixinHeading<T extends Constructor<BaseVisitor | any>>(base: T): HeadingCtor & T {
  return class _Self extends base {

    visitElementHeading(this: _Self & BaseVisitor, node: KitchenComponent) {
      const { id, definitionId, parentSlotId } = node;
      const { name, type }                     = node.properties;

      const elementNode = this.templateBuilder.newElementNode(type);
      elementNode.addAttribute('uid', name);
      elementNode.addAttribute('_kitchenRuntime');
      elementNode.addAttribute('_kitchenRuntimeComponentId', id);
      elementNode.addAttribute('_kitchenRuntimeDefinitionId', definitionId);
      elementNode.addAttribute('triDrag');
      elementNode.addInputAttribute('triDragData', { id, name, parentSlotId });
      if (node.properties.alignment !== 'left') {
        elementNode.addClass(`text-${node.properties.alignment}`);
      }
      if (node.properties.italic) {
        elementNode.addClass(`text-${node.properties.italic}`);
      }
      if (node.properties.transform && node.properties.transform !== 'none') {
        elementNode.addAttribute('transform', node.properties.transform);
      }
      if (node.properties.text) {
        elementNode.addTextContent(node.properties.text);
      }

      return elementNode;
    }
  };
}