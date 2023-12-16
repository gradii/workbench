import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbLayoutHeaderComponent, NbLayoutModule } from '@nebular/theme';
import { BreakpointWidth, nextComponentId, OvenComponent } from '@common';

import { createDefinitionProvider, Definition } from '../../definition';
import { HeaderDefinitionComponent, HeaderDefinitionDirective, HeaderSlotDirective } from './header-definition';
import { DefinitionUtilsModule } from '../../definition-utils';

export function headerFactory(): OvenComponent {
  return {
    id: nextComponentId(),
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
  componentType: NbLayoutHeaderComponent,
  definition: HeaderDefinitionComponent,
  factory: headerFactory
};

@NgModule({
  imports: [NbLayoutModule, DefinitionUtilsModule, CommonModule],
  exports: [HeaderDefinitionComponent],
  declarations: [HeaderDefinitionDirective, HeaderSlotDirective, HeaderDefinitionComponent],
  entryComponents: [HeaderDefinitionComponent],
  providers: [createDefinitionProvider(headerDefinition)]
})
export class HeaderDefinitionModule {
}
