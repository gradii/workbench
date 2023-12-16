import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbSidebarComponent, NbSidebarModule } from '@nebular/theme';
import { BreakpointWidth, nextComponentId, OvenComponent } from '@common';

import { createDefinitionProvider, Definition } from '../../definition';
import { SidebarDefinitionComponent, SidebarDefinitionDirective, SidebarSlotDirective } from './sidebar-definition';
import { DefinitionUtilsModule } from '../../definition-utils';

export function sidebarFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: '',
    styles: {
      [BreakpointWidth.Desktop]: {
        size: {
          widthValue: 256,
          widthUnit: 'px',
          widthAuto: false
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
      fixed: false,
      // NbSidebarComponent has 'responsive' input but it's used with ngOnChanges
      // that push us to create property with different name and control 'responsive' property manually
      name: 'Sidebar',
      responsiveValue: true,
      collapsedBreakpoints: ['xs', 'is', 'sm'],
      compactedBreakpoints: []
    }
  };
}

const sidebarDefinition: Definition = {
  id: 'sidebar',
  componentType: NbSidebarComponent,
  definition: SidebarDefinitionComponent,
  factory: sidebarFactory
};

@NgModule({
  imports: [DefinitionUtilsModule, CommonModule, NbSidebarModule, ScrollingModule],
  exports: [SidebarDefinitionComponent],
  declarations: [SidebarDefinitionDirective, SidebarSlotDirective, SidebarDefinitionComponent],
  entryComponents: [SidebarDefinitionComponent],
  providers: [createDefinitionProvider(sidebarDefinition)]
})
export class SidebarDefinitionModule {
}
