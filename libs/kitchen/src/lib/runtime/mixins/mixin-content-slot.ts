import { KitchenSlot } from '@common/public-api';
import { BaseVisitor } from '../base-visitor';
import { PureElementListNode, PureElementNode } from '../builder/builder-node/pure-node';
import { Constructor } from '../helper';

export interface ContentSlot {
  visitContentSlot(node: KitchenSlot): void;

  visitElementContentSlot(node: KitchenSlot): PureElementListNode | PureElementNode;
}

export type ContentSlotCtor = Constructor<ContentSlot>;

/**
 * slot is a special component
 * can't use drag and drop directly must enable space-feature in featureList
 * @param base
 */
export function mixinContentSlot<T extends Constructor<BaseVisitor | any>>(base: T): ContentSlotCtor & T {
  return class _Self extends base {
    visitContentSlot(node: KitchenSlot, ctx: any = {}) {
      const { id, direction }    = node;

      if (node.componentList.length) {
        node.componentList.forEach(it => {
          this.visit(it);
        });
      } else {
        this.writeLn('<div class="empty" style="min-height: 3rem"></div>');
      }
      // this.decIdent(1);

      // this.writeDec(`</${selector}>`);
    }

    visitElementContentSlot(node: KitchenSlot, ctx: any = {}): PureElementListNode | PureElementNode {
      const { id, direction } = node;

      if (node.componentList.length) {
        const elementNodeList = node.componentList.map(it => {
          return this.visitElement(it);
        });
        return new PureElementListNode(elementNodeList);
      } else {
        const elementNode = this.templateBuilder.newElementNode('div');
        elementNode.addClass('empty');
        elementNode.addStyle('min-height', '3rem');

        return elementNode;
      }
    }
  };
}
