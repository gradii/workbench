import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, FormFieldWidthType, nextComponentId } from '@common';
import { NbButtonComponent } from '@nebular/theme';

import { createMetaDefinitionProvider, MetaDefinition } from '../../definition';
import { ButtonDefinitionComponent } from '../button/button-definition';

export function sidebarToggleFactory() {
  return {
    id: nextComponentId(),
    definitionId: 'button',
    styles: {
      [BreakpointWidth.Desktop]: {
        size: 'medium',
        width: {
          type: FormFieldWidthType.AUTO,
          customValue: 220,
          customUnit: 'px'
        },
        iconPlacement: 'center',
        visible: true
      }
    },
    properties: {
      text: '',
      status: 'primary',
      appearance: 'ghost',
      disabled: false,
      icon: 'menu',
      name: 'SidebarToggle'
    },
    actions: {
      click: [{ action: 'toggleSidebar', paramCode: '' }]
    }
  };
}

const sidebarToggleDefinition = {
  id: 'button',
  componentType: NbButtonComponent,
  definition: ButtonDefinitionComponent,
  dataTrigger: true,
  factory: sidebarToggleFactory
};

const sidebarToggleMetaDefinition: MetaDefinition = {
  definition: sidebarToggleDefinition,
  name: 'Sidebar Toggle',
  icon: 'sidebar-toggle-component',
  order: 1650,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['button', 'sidebar']
};

@NgModule({
  imports: [CommonModule],
  providers: [createMetaDefinitionProvider(sidebarToggleMetaDefinition)]
})
export class SidebarToggleDefinitionModule {
}
