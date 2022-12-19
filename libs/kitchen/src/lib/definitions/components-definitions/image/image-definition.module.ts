import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, KitchenType, nextComponentId } from '@common/public-api';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { stringValidator } from '../../definition-utils/data-validators';
import { ImageDefinitionComponent, ImageDefinitionDirective } from './image-definition';
import { DefinitionUtilsModule } from '../../definition-utils';

export function createFactory(widthValue: number, heightValue: number) {
  return {
    id          : nextComponentId(),
    type        : KitchenType.Component,
    definitionId: 'image',
    styles      : {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size   : {
          widthValue,
          widthUnit : 'px',
          widthAuto : false,
          heightValue,
          heightUnit: 'px',
          heightAuto: false
        },
        fit    : 'fill',
        radius : {
          value: 0,
          unit : 'px'
        },
        src    : {
          url      : '',
          uploadUrl: '',
          name     : '',
          active   : 'upload'
        }
      }
    },
    properties  : {
      name: 'Image'
    }
  };
}

export function imageFactory() {
  return createFactory(200, 200);
}

export function inHeaderImageFactory() {
  return createFactory(48, 48);
}

export function inSidebarImageFactory() {
  return createFactory(48, 48);
}

const imageDefinition: Definition = {
  id              : 'image',
  componentType   : null,
  dataConsumer    : true,
  dataValidator   : stringValidator,
  definition      : ImageDefinitionComponent,
  factory         : imageFactory,
  inHeaderFactory : inHeaderImageFactory,
  inSidebarFactory: inSidebarImageFactory
};

const imageMetaDefinition: MetaDefinition = {
  definition    : imageDefinition,
  name          : 'Image',
  icon          : 'workbench:image',
  order         : 650,
  headerSupport : true,
  sidebarSupport: true,
  tags          : ['picture']
};

@NgModule({
  imports     : [DefinitionUtilsModule, CommonModule],
  exports     : [ImageDefinitionComponent],
  declarations: [ImageDefinitionDirective, ImageDefinitionComponent],
  providers   : [
    createDefinitionProvider(imageDefinition),
    createMetaDefinitionProvider(imageMetaDefinition)
  ]
})
export class ImageDefinitionModule {
}
