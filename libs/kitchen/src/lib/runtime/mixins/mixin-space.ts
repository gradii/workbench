import { KitchenComponent } from '@common/public-api';
import { BaseVisitor } from '../base-visitor';
import { PureElementNode } from '../builder/builder-node/pure-node';
import { binding } from '../builder/template-builder';
import { Constructor } from '../helper';

export interface Space {
  visitSpace(node: KitchenComponent): void;
  visitElementSpace(node: KitchenComponent): PureElementNode;
}

export type SpaceCtor = Constructor<Space>;

export function mixinSpace<T extends Constructor<BaseVisitor | any>>(base: T): SpaceCtor & T {
  return class _Self extends base {

    visitElementSpace(this: _Self & BaseVisitor, node: KitchenComponent) {
      const { id, definitionId, parentSlotId, contentSlot } = node;

      const { name }      = node.properties;
      const { xl }        = node.styles;
      const { direction } = xl;

      const element = this.templateBuilder.newElementNode('div', false);

      element.addAttribute('cdkScrollable')
        .addAttribute('uid', id)
        .addAttribute('triDropFlexContainer')
        .addAttribute('id', id)

        .addAttribute('_kitchenRuntime')
        .addAttribute('_kitchenRuntimeComponentId', id)
        .addAttribute('_kitchenRuntimeDefinitionId', definitionId)

        .addAttribute('triDrag')
        .addInputAttribute('triDragData', {
          id, name, parentSlotId
        })
        .addAttribute('class', 'space');

      if (direction === 'column') {
        element.addClass('direction-column');
        element.addInputAttribute('triDropFlexContainerData', 'vertical');
      } else {
        element.addClass('direction-row');
        element.addInputAttribute('triDropFlexContainerData', 'horizontal');
      }

      element.addInputAttribute('triDropFlexContainerData', {
        id, name, parentSlotId
      });

      element.addOutputAttribute('triDropFlexContainerDropped', binding('onDragDropped($event)'));

      if (!contentSlot || !contentSlot.id) {
        throw new Error('space must have contentSlot');
      }

      const slotElement  = this.visitElementContentSlot(contentSlot);
      element.children.push(slotElement);

      return element;
    }
  };
}