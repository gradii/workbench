import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbRadioGroupComponent, NbRadioModule } from '@nebular/theme';
import { BreakpointWidth, nextComponentId, OvenComponent } from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { RadioDefinitionComponent, RadioDefinitionDirective } from './radio-definition';

export function radioFactory(): OvenComponent {
  const id = nextComponentId();
  return {
    id,
    definitionId: 'radio',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        direction: 'column',
        justify: 'flex-start',
        align: 'flex-start',
        size: {
          widthValue: 200,
          widthUnit: 'px',
          widthAuto: true,
          heightValue: 36,
          heightUnit: 'px',
          heightAuto: true
        },
        overflowX: 'visible',
        overflowY: 'visible'
      }
    },
    properties: {
      name: 'Radio',
      status: 'basic',
      options: [{ value: 'option 1' }, { value: 'option 2' }]
    },
    actions: {
      change: []
    }
  };
}

const radioDefinition: Definition = {
  id: 'radio',
  componentType: NbRadioGroupComponent,
  definition: RadioDefinitionComponent,
  dataTrigger: true,
  factory: radioFactory
};

const radioMetaDefinition: MetaDefinition = {
  definition: radioDefinition,
  name: 'Radio',
  icon: 'radio-component',
  order: 800,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['form', 'control']
};

@NgModule({
  imports: [DefinitionUtilsModule, NbRadioModule, CommonModule],
  exports: [RadioDefinitionComponent],
  declarations: [RadioDefinitionDirective, RadioDefinitionComponent],
  entryComponents: [RadioDefinitionComponent],
  providers: [createDefinitionProvider(radioDefinition), createMetaDefinitionProvider(radioMetaDefinition)]
})
export class RadioDefinitionModule {
}
