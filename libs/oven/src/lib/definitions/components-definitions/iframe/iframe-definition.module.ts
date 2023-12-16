import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointWidth, nextComponentId, OvenComponent } from '@common';
import { BkPipeModule } from '@uibakery/kit';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { IframeDefinitionComponent, IframeDefinitionDirective } from './iframe-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { stringValidator } from '../../definition-utils/data-validators';

export function createFactory(widthValue: number, heightValue: number): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'iframe',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size: {
          widthValue,
          widthUnit: 'px',
          widthAuto: false,
          heightValue,
          heightUnit: 'px',
          heightAuto: false
        }
      }
    },
    properties: {
      name: 'Iframe',
      url: ''
    }
  };
}

export function iframeFactory() {
  return createFactory(300, 300);
}

export function inHeaderIframeFactory() {
  return createFactory(48, 48);
}

export function inSidebarIframeFactory() {
  return createFactory(48, 48);
}

const iframeDefinition: Definition = {
  id: 'iframe',
  componentType: null,
  definition: IframeDefinitionComponent,
  dataConsumer: true,
  dataValidator: stringValidator,
  factory: iframeFactory,
  inHeaderFactory: inHeaderIframeFactory,
  inSidebarFactory: inSidebarIframeFactory
};

const iframeMetaDefinition: MetaDefinition = {
  definition: iframeDefinition,
  name: 'Iframe',
  icon: 'iframe-component',
  order: 2001,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['iframe', 'embedded', 'window', 'site']
};

@NgModule({
  imports: [DefinitionUtilsModule, BkPipeModule, CommonModule],
  exports: [IframeDefinitionComponent],
  declarations: [IframeDefinitionDirective, IframeDefinitionComponent],
  entryComponents: [IframeDefinitionComponent],
  providers: [createDefinitionProvider(iframeDefinition), createMetaDefinitionProvider(iframeMetaDefinition)]
})
export class IframeDefinitionModule {
}
