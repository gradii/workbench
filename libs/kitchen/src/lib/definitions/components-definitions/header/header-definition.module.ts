import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, nextComponentId, KitchenComponent, KitchenType } from '@common/public-api';
import { TriButtonModule } from '@gradii/triangle/button';

import { createDefinitionProvider, Definition } from '../../definition';
import { HeaderDefinitionComponent, HeaderDefinitionDirective, HeaderSlotDirective } from './header-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { TriLayoutModule, Header } from '@gradii/triangle/layout';

export function headerFactory(): KitchenComponent {
  return {
    id: nextComponentId(),
    type: KitchenType.Component,
    definitionId: 'header',
    styles: {
      [BreakpointWidth.Desktop]: {
        size: {
          heightValue: 80,
          heightUnit: 'px',
          heightAuto: false
        },
        paddings: {
          paddingTop: 16,
          paddingTopUnit: 'px',
          paddingRight: 16,
          paddingRightUnit: 'px',
          paddingBottom: 16,
          paddingBottomUnit: 'px',
          paddingLeft: 16,
          paddingLeftUnit: 'px'
        },
        background: {
          color: 'default',
          imageSrc: '',
          imageSize: 'auto'
        }
      }
    },
    properties: {
      name: 'Header',
      fixed: false
    }
  };
}

const headerDefinition: Definition = {
  id: 'header',
  componentType: Header,
  definition: HeaderDefinitionComponent,
  factory: headerFactory
};

@NgModule({
    imports: [TriLayoutModule, DefinitionUtilsModule, CommonModule, TriButtonModule],
    exports: [HeaderDefinitionComponent],
    declarations: [HeaderDefinitionDirective, HeaderSlotDirective, HeaderDefinitionComponent],
    providers: [createDefinitionProvider(headerDefinition)]
})
export class HeaderDefinitionModule {
}
