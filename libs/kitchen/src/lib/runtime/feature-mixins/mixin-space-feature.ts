import { KitchenComponent, KitchenFeature, KitchenType } from '@common/public-api';
import { BaseVisitor } from '../base-visitor';
import { PureElementNode } from '../builder/builder-node/pure-node';
import { binding } from '../builder/template-builder';
import { Constructor } from '../helper';

export interface SpaceFeature {
  visitSpaceFeature(node: KitchenComponent): void;

  visitElementSpaceFeature(node: KitchenComponent): PureElementNode;
}

export type SpaceFeatureCtor = Constructor<SpaceFeature>;

export function mixinSpaceFeature<T extends Constructor<BaseVisitor | any>>(base: T): SpaceFeatureCtor & T {
  return class _Self extends base {
    visitSpaceFeature(node: KitchenFeature) {
      // const slotContent                        = node.slots?.content;
      const { id, definitionId, hostId } = node;
      // const { name }                     = node.properties;
      const name                         = 'space-feature';
      const { xl }                       = node.styles;
      const { direction, wrap }          = xl;

      let output = '';
      if (wrap === 'wrap') {
        output += ' [class.flex-wrap]="true"';
      } else {
        output += ' [class.flex-nowrap]="true"';
      }
      // feature use host id
      output += ` triDropFlexContainer id="${hostId}"`;
      // remove space style because flex: 1 is not work for card header
      // output += ` class="space"`;
      if (direction === 'column') {
        output += ` [class.direction-column]="true"`;
      } else {
        output += ` [class.direction-row]="true"`;
      }
      output += ``;
      if (direction === 'column') {
        output += ` triDropFlexContainerOrientation="vertical"`;
      } else {
        output += ` triDropFlexContainerOrientation="horizontal"`;
      }

      output += ` [triDropFlexContainerData]="{id: '${id}', name: '${name}', hostId: '${hostId}', parentSlotId: '${hostId}', slotId: '${hostId}'}"`;
      output += ` (triDropFlexContainerDropped)="onDragDropped($event)"`;

      if (node.type == KitchenType.Component) {
        output += `>`;

        this.incWrite(output);
        // if (slotContent) {
        //   this.visit(slotContent);
        // }

        this.writeDec(`</div>`);
      } else {
        this.incWrite(output);
      }
    }

    visitElementSpaceFeature(this: _Self & BaseVisitor, node: KitchenFeature) {
      const { id, definitionId, hostId } = node;

      const name                = 'space-feature';
      const { xl }              = node.styles;
      const { direction, wrap } = xl;

      // const element = this.templateBuilder.newElementBuilder('div', false);
      const elementBuilder: PureElementNode = this.elementNode;

      if (!elementBuilder) {
        throw new Error('must run in element context');
      }
      if (wrap === 'wrap') {
        elementBuilder.addClassBinding('flex-wrap', true);
      } else {
        elementBuilder.addClassBinding('flex-nowrap', true);
      }
      elementBuilder.addAttribute('triDropFlexContainer');
      elementBuilder.addAttribute('id', hostId);

      if (direction === 'column') {
        elementBuilder.addClassBinding('direction-column', true);
      } else {
        elementBuilder.addClassBinding('direction-row', true);
      }
      if (direction === 'column') {
        elementBuilder.addInputAttribute('triDropFlexContainerOrientation', 'vertical');
      } else {
        elementBuilder.addInputAttribute('triDropFlexContainerOrientation', 'horizontal');
      }

      elementBuilder.addInputAttribute('triDropFlexContainerData', {
        id          : id,
        name        : name,
        hostId      : hostId,
        parentSlotId: hostId,
        slotId      : hostId
      });

      elementBuilder.addOutputAttribute('triDropFlexContainerDropped', binding('onDragDropped($event)'));

      return elementBuilder;
    }
  };
}