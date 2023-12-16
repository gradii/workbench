import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, FormFieldWidthType, nextComponentId, OvenComponent } from '@common';
import { NbButtonComponent, NbButtonModule, NbIconModule } from '@nebular/theme';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { ButtonLinkDefinitionComponent, ButtonLinkDefinitionDirective } from './button-link-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { stringValidator } from '../../definition-utils/data-validators';

export function buttonLinkFactory(): OvenComponent {
  return {
    id: nextComponentId(),
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
  componentType: NbButtonComponent,
  definition: ButtonLinkDefinitionComponent,
  dataConsumer: true,
  dataValidator: stringValidator,
  factory: buttonLinkFactory
};

const buttonLinkMetaDefinition: MetaDefinition = {
  definition: buttonLinkDefinition,
  name: 'Button Link',
  icon: 'button-link',
  order: 300,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['link', 'form', 'control', 'navigation']
};

@NgModule({
  imports: [NbButtonModule, NbIconModule, DefinitionUtilsModule, CommonModule],
  exports: [ButtonLinkDefinitionComponent],
  declarations: [ButtonLinkDefinitionDirective, ButtonLinkDefinitionComponent],
  entryComponents: [ButtonLinkDefinitionComponent],
  providers: [createDefinitionProvider(buttonLinkDefinition), createMetaDefinitionProvider(buttonLinkMetaDefinition)]
})
export class ButtonLinkDefinitionModule {
}
