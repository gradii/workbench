import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbProgressBarComponent, NbProgressBarModule } from '@nebular/theme';
import { BreakpointWidth, nextComponentId, OvenComponent } from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { ProgressBarDefinitionComponent, ProgressBarDefinitionDirective } from './progress-bar-definition';

export function progressBarFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'progressBar',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size: 'medium'
      }
    },
    properties: {
      value: 66,
      status: 'info',
      displayValue: false,
      name: 'ProgressBar'
    }
  };
}

const progressBarDefinition: Definition = {
  id: 'progressBar',
  componentType: NbProgressBarComponent,
  definition: ProgressBarDefinitionComponent,
  factory: progressBarFactory
};

const progressBarMetaDefinition: MetaDefinition = {
  definition: progressBarDefinition,
  name: 'Progress bar',
  icon: 'progress-bar',
  order: 1000,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['progress']
};

@NgModule({
  imports: [DefinitionUtilsModule, NbProgressBarModule, CommonModule],
  exports: [ProgressBarDefinitionComponent],
  declarations: [ProgressBarDefinitionDirective, ProgressBarDefinitionComponent],
  entryComponents: [ProgressBarDefinitionComponent],
  providers: [createDefinitionProvider(progressBarDefinition), createMetaDefinitionProvider(progressBarMetaDefinition)]
})
export class ProgressBarDefinitionModule {
}
