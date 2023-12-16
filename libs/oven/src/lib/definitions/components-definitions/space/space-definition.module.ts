import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  BreakpointWidth,
  ComponentPaddings,
  nextComponentId,
  OvenComponent,
  OvenSlot,
  SpaceHeightType,
  SpaceWidth,
  SpaceWidthType
} from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { stringValidator } from '../../definition-utils/data-validators';
import {
  SpaceDefinitionComponent,
  SpaceDefinitionDirective,
  SpaceDirective,
  SpaceSlotDirective
} from './space-definition';
import { DefinitionUtilsModule } from '../../definition-utils';

export function spaceFactory(
  content?: OvenComponent[],
  align?: string,
  fullWidth: boolean = false,
  paddings: ComponentPaddings = {}
): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'space',
    slots: { content: new OvenSlot(content) },
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        direction: 'row',
        justify: 'flex-start',
        align: align || 'flex-start',
        height: {
          type: SpaceHeightType.AUTO,
          customValue: 48,
          customUnit: 'px'
        },
        paddings,
        overflowX: 'visible',
        overflowY: 'visible',
        width: resolveWidth(fullWidth),
        background: {
          color: 'transparent',
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
      container: false,
      name: 'Space'
    },
    actions: {
      init: [],
      click: []
    }
  };
}

export function resolveWidth(fullWidth: boolean = false): SpaceWidth {
  return {
    type: fullWidth ? SpaceWidthType.AUTO : SpaceWidthType.CUSTOM,
    customValue: 48,
    customUnit: 'px'
  };
}

export const spaceDefinition: Definition = {
  id: 'space',
  componentType: SpaceDirective,
  definition: SpaceDefinitionComponent,
  dataConsumer: true,
  dataValidator: stringValidator,
  factory: spaceFactory
};

export const spaceMetaDefinition: MetaDefinition = {
  definition: spaceDefinition,
  name: 'Space',
  icon: 'space',
  order: 50,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['space', 'div', 'block', 'section', 'column', 'row']
};

@NgModule({
  imports: [DefinitionUtilsModule, CommonModule, ScrollingModule],
  exports: [SpaceDefinitionComponent],
  declarations: [SpaceDirective, SpaceSlotDirective, SpaceDefinitionDirective, SpaceDefinitionComponent],
  entryComponents: [SpaceDefinitionComponent],
  providers: [createDefinitionProvider(spaceDefinition), createMetaDefinitionProvider(spaceMetaDefinition)]
})
export class SpaceDefinitionModule {
}
