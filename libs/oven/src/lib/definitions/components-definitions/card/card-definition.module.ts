import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardComponent, NbCardModule } from '@nebular/theme';
import { BreakpointWidth, nextComponentId, OvenComponent, OvenSlot } from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { stringValidator } from '../../definition-utils/data-validators';
import {
  CardBodySlotDirective,
  CardDefinitionComponent,
  CardDefinitionDirective,
  CardFooterSlotDirective,
  CardHeaderSlotDirective
} from './card-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { spaceFactory } from '../space/space-definition.module';
import { headingFactory } from '../heading/heading-definition.module';

export function cardFactory(): OvenComponent {
  return {
    id: nextComponentId(),
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
      header: new OvenSlot([spaceFactory([headingFactory('Card Header', 'h6')], 'center', true)]),
      body: new OvenSlot([spaceFactory([], 'flex-start', true)]),
      footer: new OvenSlot([spaceFactory([], 'flex-start', true)])
    }
  };
}

const cardDefinition: Definition = {
  id: 'card',
  componentType: NbCardComponent,
  definition: CardDefinitionComponent,
  dataConsumer: true,
  dataValidator: stringValidator,
  factory: cardFactory
};

const cardMetaDefinition: MetaDefinition = {
  definition: cardDefinition,
  name: 'Card',
  icon: 'card',
  order: 100,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['space', 'blank']
};

@NgModule({
  imports: [NbCardModule, DefinitionUtilsModule, CommonModule, ScrollingModule],
  exports: [CardDefinitionComponent],
  declarations: [
    CardDefinitionDirective,
    CardHeaderSlotDirective,
    CardBodySlotDirective,
    CardFooterSlotDirective,
    CardDefinitionComponent
  ],
  entryComponents: [CardDefinitionComponent],
  providers: [createDefinitionProvider(cardDefinition), createMetaDefinitionProvider(cardMetaDefinition)]
})
export class CardDefinitionModule {
}
