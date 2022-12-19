import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, KitchenComponent, KitchenType, nextComponentId } from '@common/public-api';
import { SidenavContainerComponent, TriSidenavModule } from '@gradii/triangle/sidenav';


import { createDefinitionProvider, Definition } from '../../definition';
import { SidebarDefinitionComponent, SidebarDefinitionDirective, SidebarSlotDirective } from './sidebar-definition';
import { DefinitionUtilsModule } from '../../definition-utils';

export function sidebarFactory(): KitchenComponent {
  return {
    id          : nextComponentId(),
    type: KitchenType.Component,
    definitionId: '',
    styles      : {
      [BreakpointWidth.Desktop]: {
        size      : {
          widthValue: 256,
          widthUnit : 'px',
          widthAuto : false
        },
        paddings  : {
          paddingTop       : 16,
          paddingTopUnit   : 'px',
          paddingRight     : 16,
          paddingRightUnit : 'px',
          paddingBottom    : 16,
          paddingBottomUnit: 'px',
          paddingLeft      : 16,
          paddingLeftUnit  : 'px'
        },
        background: {
          color    : 'default',
          imageSrc : '',
          imageSize: 'auto'
        }
      }
    },
    properties  : {
      fixed: false,
      // NbSidebarComponent has 'responsive' input but it's used with ngOnChanges
      // that push us to create property with different name and control 'responsive' property manually
      name                : 'Sidebar',
      responsiveValue     : true,
      collapsedBreakpoints: ['xs', 'is', 'sm'],
      compactedBreakpoints: []
    }
  };
}

const sidebarDefinition: Definition = {
  id           : 'sidebar',
  componentType: SidenavContainerComponent,
  definition   : SidebarDefinitionComponent,
  factory      : sidebarFactory
};

@NgModule({
    imports: [DefinitionUtilsModule, CommonModule, TriSidenavModule, ScrollingModule],
    exports: [SidebarDefinitionComponent],
    declarations: [SidebarDefinitionDirective, SidebarSlotDirective, SidebarDefinitionComponent],
    providers: [createDefinitionProvider(sidebarDefinition)]
})
export class SidebarDefinitionModule {
}
