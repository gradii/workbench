import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, KitchenComponent, KitchenSlot, KitchenType, nextComponentId } from '@common/public-api';
import { CardComponent, TriCardModule } from '@gradii/triangle/card';
import { TriDndModule } from '@gradii/triangle/dnd';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { stringValidator } from '../../definition-utils/data-validators';
import { spaceFeatureFactory } from '../../features-definitions/space-feature/space-feature-definition';
import { headingFactory } from '../heading/heading-definition.module';
import {
  CardBodySlotDirective, CardDefinitionComponent, CardDefinitionDirective, CardFooterSlotDirective,
  CardHeaderSlotDirective
} from './card-definition';

export function cardFactory(): KitchenComponent {
  return {
    id: nextComponentId(),
    type: KitchenType.Component,
    definitionId: 'card',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size: {
          widthValue: 100,
          widthUnit: '%',
          widthAuto: false,
          heightValue: 300,
          heightUnit: 'px',
          heightAuto: true
        },
        headerPadding: true,
        bodyPadding: true,
        footerPadding: true,
        accent: '',
        status: '',
        background: {
          color: 'default',
          imageSrc: {
            url: '',
            uploadUrl: '',
            name: '',
            active: 'upload'
          },
          imageSize: 'auto'
        }
      }
    },
    properties: {
      showHeader: true,
      showFooter: true,
      container: true,
      name: 'Card'
    },
    actions: {
      init: []
    },
    slots: {
      header: new KitchenSlot(
        [headingFactory('Card Header', 'h6')],
        undefined,
        [spaceFeatureFactory()]
      ),
      body  : new KitchenSlot(
        [],
        undefined,
        [spaceFeatureFactory()]
      ),
      footer: new KitchenSlot(
        [],
        undefined,
        [spaceFeatureFactory()]
      )
    }
  };
}

const cardDefinition: Definition = {
  id: 'card',
  componentType: CardComponent,
  definition: CardDefinitionComponent,
  dataConsumer: true,
  dataValidator: stringValidator,
  factory: cardFactory
};

const cardMetaDefinition: MetaDefinition = {
  definition: cardDefinition,
  name: 'Card',
  icon: 'workbench:card',
  order: 100,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['space', 'blank']
};

@NgModule({
  imports: [TriCardModule, DefinitionUtilsModule, CommonModule, ScrollingModule, TriDndModule],
  exports: [CardDefinitionComponent],
  declarations: [
    CardDefinitionDirective,
    CardHeaderSlotDirective,
    CardBodySlotDirective,
    CardFooterSlotDirective,
    CardDefinitionComponent
  ],
  providers: [createDefinitionProvider(cardDefinition), createMetaDefinitionProvider(cardMetaDefinition)]
})
export class CardDefinitionModule {
}
