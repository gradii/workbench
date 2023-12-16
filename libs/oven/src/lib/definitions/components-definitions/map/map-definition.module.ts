import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointWidth, nextComponentId, OvenComponent } from '@common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { MapDefinitionComponent, MapDefinitionDirective } from './map-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { BkMapComponent } from './map.component';

export function mapFactory(): OvenComponent {
  return {
    id: nextComponentId(),
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
  icon: 'map-component',
  order: 2000,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['geo']
};

@NgModule({
  imports: [DefinitionUtilsModule, CommonModule, LeafletModule],
  exports: [MapDefinitionComponent],
  declarations: [MapDefinitionDirective, MapDefinitionComponent, BkMapComponent],
  entryComponents: [MapDefinitionComponent],
  providers: [createDefinitionProvider(mapDefinition), createMetaDefinitionProvider(mapMetaDefinition)]
})
export class MapDefinitionModule {
}
