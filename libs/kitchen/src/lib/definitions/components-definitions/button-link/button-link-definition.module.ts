import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  BreakpointWidth, FormFieldWidthType, KitchenComponent, KitchenType, nextComponentId
} from '@common/public-api';
import { ButtonComponent, TriButtonModule } from '@gradii/triangle/button';
import { TriIconModule } from '@gradii/triangle/icon';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { stringValidator } from '../../definition-utils/data-validators';
import { ButtonLinkDefinitionComponent, ButtonLinkDefinitionDirective } from './button-link-definition';

export function buttonLinkFactory(): KitchenComponent {
  return {
    id: nextComponentId(),
    type: KitchenType.Component,
    definitionId: 'buttonLink',
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
      icon: 'star',
      text: 'Button Link',
      status: 'primary',
      appearance: 'filled',
      disabled: false,
      name: 'ButtonLink',
      url: {
        path: '',
        external: true
      }
    }
  };
}

const buttonLinkDefinition: Definition = {
  id: 'buttonLink',
  componentType: ButtonComponent,
  definition: ButtonLinkDefinitionComponent,
  dataConsumer: true,
  dataValidator: stringValidator,
  factory: buttonLinkFactory
};

const buttonLinkMetaDefinition: MetaDefinition = {
  definition: buttonLinkDefinition,
  name: 'Button Link',
  icon: 'workbench:button-link',
  order: 300,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['link', 'form', 'control', 'navigation']
};

@NgModule({
    imports: [TriButtonModule, TriIconModule, DefinitionUtilsModule, CommonModule],
    exports: [ButtonLinkDefinitionComponent],
    declarations: [ButtonLinkDefinitionDirective, ButtonLinkDefinitionComponent],
    providers: [createDefinitionProvider(buttonLinkDefinition), createMetaDefinitionProvider(buttonLinkMetaDefinition)]
})
export class ButtonLinkDefinitionModule {
}
