import { KitchenSlot } from '@common/public-api';
import { BaseVisitor } from '../base-visitor';
import { PureElementListNode, PureElementNode } from '../builder/builder-node/pure-node';
import { Constructor } from '../helper';

export interface Slot {
  visitSlot(node: KitchenSlot, ctx?: any): void;

  visitElementSlot(node: KitchenSlot, ctx?: any): PureElementNode;
}

export type SlotCtor = Constructor<Slot>;

/**
 * slot is a special component
 * can't use drag and drop directly must enable space-feature in featureList
 * @param base
 */
export function mixinSlot<T extends Constructor<BaseVisitor | any>>(base: T): SlotCtor & T {
  return class _Self extends base {

    visitElementSlot(this: _Self & BaseVisitor, node: KitchenSlot, ctx: any = {}) {
      const { id, direction }    = node;
      const { selector = 'div' } = ctx;

      const elementNode = this.templateBuilder.newElementNode(selector, true);
      if (node.featureList) {
        this.elementNode = elementNode;
        node.featureList.forEach(it => {
          this.visitElement(it);
        });
        this.elementNode = null;
      }

      if (node.featureList.length > 0 && node.featureList.find(it => it.definitionId === 'space-feature')) {
        elementNode.addAttribute('cdkScrollable');
        elementNode.addAttribute('uid', id);
      } else {
        elementNode.addAttribute('cdkScrollable');
        elementNode.addAttribute('uid', id);
        elementNode.addAttribute('triDropFlexContainer');
        elementNode.addAttribute('id', id);
        if (direction === 'horizontal') {
          elementNode.addAttribute('triDropFlexContainerOrientation', 'horizontal');
        } else {
          elementNode.addAttribute('triDropFlexContainerOrientation', 'vertical');
        }
        elementNode.addClass('space');
        if (direction === 'horizontal') {
          elementNode.addClass('direction-row');
        } else {
          elementNode.addClass('direction-column');
        }
      }

      elementNode.addAttribute('_kitchenRuntime');
      elementNode.addAttribute('_kitchenRuntimeComponentId', id);
      elementNode.addAttribute('_kitchenRuntimeDefinitionId', 'slot');


      if (node.componentList.length) {
        const elementNodeList = new PureElementListNode(
          node.componentList.map(it => {
            return this.visitElement(it);
          })
        );
        elementNode.children.push(elementNodeList);
      }

      return elementNode;
    }
  };
}
