import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointWidth, nextComponentId, KitchenComponent, KitchenType } from '@common/public-api';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { MapDefinitionComponent, MapDefinitionDirective } from './map-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { BkMapComponent } from './map.component';

export function mapFactory(): KitchenComponent {
  return {
    id: nextComponentId(), type: KitchenType.Component,
    definitionId: 'map',
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
      name: 'Map'
    }
  };
}

const mapDefinition: Definition = {
  id: 'map',
  componentType: BkMapComponent,
  definition: MapDefinitionComponent,
  factory: mapFactory
};

const mapMetaDefinition: MetaDefinition = {
  definition: mapDefinition,
  name: 'Map',
  icon: 'workbench:map-component',
  order: 2000,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['geo']
};

@NgModule({
    imports: [DefinitionUtilsModule, CommonModule, LeafletModule],
    exports: [MapDefinitionComponent],
    declarations: [MapDefinitionDirective, MapDefinitionComponent, BkMapComponent],
    providers: [createDefinitionProvider(mapDefinition), createMetaDefinitionProvider(mapMetaDefinition)]
})
export class MapDefinitionModule {
}
