import { KitchenComponent } from '@common/public-api';
import { BaseVisitor } from '../base-visitor';
import { PureElementNode } from '../builder/builder-node/pure-node';
import { Constructor } from '../helper';

export interface Icon {
  visitIcon(node: KitchenComponent): void;

  visitElementIcon(node: KitchenComponent): PureElementNode;
}

export type IconCtor = Constructor<Icon>;

export function mixinIcon<T extends Constructor<BaseVisitor | any>>(base: T): IconCtor & T {
  return class _Self extends base {
    visitElementIcon(node: KitchenComponent) {
      const { id, definitionId, parentSlotId } = node;
      const { icon, name }                     = node.properties;

      const elementNode = this.templateBuilder.newElementNode('tri-icon');
      elementNode.addAttribute('uid', name);
      elementNode.addAttribute('_kitchenRuntime');
      elementNode.addAttribute('_kitchenRuntimeComponentId', id);
      elementNode.addAttribute('_kitchenRuntimeDefinitionId', definitionId);
      elementNode.addAttribute('triDrag');
      elementNode.addAttribute('triDragData', { id, name, parentSlotId });
      elementNode.addAttribute('svgIcon', icon);

      return elementNode;
    }
  };
}
