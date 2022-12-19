import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, ComponentMargins, KitchenType, nextComponentId, SlotDirection } from '@common/public-api';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DividerDefinitionComponent, DividerDefinitionDirective } from './divider-definition';
import { DefinitionUtilsModule } from '../../definition-utils';

export function createFactory(
  direction: SlotDirection,
  size = {
    widthValue: 100,
    widthUnit: '%',
    widthAuto: false,
    heightValue: 2,
    heightUnit: 'px',
    heightAuto: false
  },
  margins: ComponentMargins = {
    marginTop: 4,
    marginTopUnit: 'px',
    marginBottom: 4,
    marginBottomUnit: 'px',
    marginRight: 0,
    marginRightUnit: 'px',
    marginLeft: 0,
    marginLeftUnit: 'px'
  }
) {
  return {
    id: nextComponentId(),
    type: KitchenType.Component,
    definitionId: 'divider',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        direction,
        size,
        margins,
        background: {
          color: 'disabled'
        }
      }
    },
    properties: {
      name: 'Divider'
    }
  };
}

export function dividerFactory() {
  return createFactory('row');
}

export function inHeaderDividerFactory() {
  return createFactory(
    'column',
    {
      widthValue: 2,
      widthUnit: 'px',
      widthAuto: false,
      heightValue: 48,
      heightUnit: 'px',
      heightAuto: false
    },
    {
      marginTop: 0,
      marginTopUnit: 'px',
      marginBottom: 0,
      marginBottomUnit: 'px',
      marginLeft: 4,
      marginLeftUnit: 'px',
      marginRight: 4,
      marginRightUnit: 'px'
    }
  );
}

export function inSidebarDividerFactory() {
  return createFactory('row');
}

const dividerDefinition: Definition = {
  id: 'divider',
  componentType: null,
  definition: DividerDefinitionComponent,
  factory: dividerFactory,
  inHeaderFactory: inHeaderDividerFactory,
  inSidebarFactory: inSidebarDividerFactory
};

const dividerMetaDefinition: MetaDefinition = {
  definition: dividerDefinition,
  name: 'Divider',
  icon: 'workbench:divider',
  order: 2002,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['divider', 'line', 'separator']
};

@NgModule({
    imports: [DefinitionUtilsModule, CommonModule],
    exports: [DividerDefinitionComponent],
    declarations: [DividerDefinitionDirective, DividerDefinitionComponent],
    providers: [createDefinitionProvider(dividerDefinition), createMetaDefinitionProvider(dividerMetaDefinition)]
})
export class DividerDefinitionModule {
}
