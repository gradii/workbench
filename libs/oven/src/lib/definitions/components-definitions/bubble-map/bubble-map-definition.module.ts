import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, bubbleMapSample, nextComponentId, OvenComponent } from '@common';
import { HttpClientModule } from '@angular/common/http';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { BubbleMapDefinitionComponent, BubbleMapDefinitionDirective } from './bubble-map-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { BkBubbleMapComponent } from './bubble-map.component';
import { EchartsModule } from '../../../directives/echarts/echarts.module';
import { dataValidator } from './data-validator';
import { dataPropsFactory } from '../../../workflow/data/data-factory';

export function bubbleMapFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'bubbleMap',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size: {
          widthValue: 100,
          widthUnit: '%',
          widthAuto: false,
          heightValue: 100,
          heightUnit: '%',
          heightAuto: false
        }
      }
    },
    properties: {
      name: 'BubbleMap',
      ...dataPropsFactory(bubbleMapSample)
    },
    actions: {
      init: []
    }
  };
}

const bubbleMapDefinition: Definition = {
  id: 'bubbleMap',
  componentType: BkBubbleMapComponent,
  definition: BubbleMapDefinitionComponent,
  factory: bubbleMapFactory,
  dataTrigger: true,
  dataConsumer: true,
  dataValidator
};

const bubbleMapMetaDefinition: MetaDefinition = {
  definition: bubbleMapDefinition,
  name: 'Bubble Map',
  icon: 'bubble-map',
  order: 1900,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['graph', 'chart', 'map', 'diagram', 'histogram', 'bubble', 'geo']
};

@NgModule({
  imports: [DefinitionUtilsModule, CommonModule, EchartsModule, HttpClientModule],
  exports: [BubbleMapDefinitionComponent],
  declarations: [BubbleMapDefinitionDirective, BubbleMapDefinitionComponent, BkBubbleMapComponent],
  entryComponents: [BubbleMapDefinitionComponent],
  providers: [createDefinitionProvider(bubbleMapDefinition), createMetaDefinitionProvider(bubbleMapMetaDefinition)]
})
export class BubbleMapDefinitionModule {
}
