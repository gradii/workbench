import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbButtonComponent, NbButtonModule, NbIconModule } from '@nebular/theme';
import { BreakpointWidth, FormFieldWidthType, nextComponentId, OvenComponent } from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { ButtonDefinitionComponent, ButtonDefinitionDirective } from './button-definition';
import { DefinitionUtilsModule } from '../../definition-utils';

export function buttonFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'button',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size: 'medium',
        width: {
          type: FormFieldWidthType.AUTO,
          customValue: 220,
          customUnit: 'px'
        },
        iconPlacement: 'none'
      }
    },
    properties: {
      text: 'Button',
      status: 'primary',
      appearance: 'filled',
      disabled: false,
      icon: 'star',
      name: 'Button'
    },
    actions: {
      click: []
    }
  };
}

const buttonDefinition: Definition = {
  id: 'button',
  componentType: NbButtonComponent,
  definition: ButtonDefinitionComponent,
  dataTrigger: true,
  factory: buttonFactory
};

const buttonMetaDefinition: MetaDefinition = {
  definition: buttonDefinition,
  name: 'Button',
  icon: 'button',
  order: 200,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['form', 'control']
};

@NgModule({
  imports: [NbButtonModule, NbIconModule, DefinitionUtilsModule, CommonModule],
  exports: [ButtonDefinitionComponent],
  declarations: [ButtonDefinitionDirective, ButtonDefinitionComponent],
  entryComponents: [ButtonDefinitionComponent],
  providers: [createDefinitionProvider(buttonDefinition), createMetaDefinitionProvider(buttonMetaDefinition)]
})
export class ButtonDefinitionModule {
}
