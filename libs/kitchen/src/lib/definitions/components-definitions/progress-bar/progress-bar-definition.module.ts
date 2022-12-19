import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, KitchenComponent, KitchenType, nextComponentId } from '@common/public-api';
import { ProgressComponent, TriProgressModule } from '@gradii/triangle/progress';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { ProgressBarDefinitionComponent, ProgressBarDefinitionDirective } from './progress-bar-definition';

export function progressBarFactory(): KitchenComponent {
  return {
    id          : nextComponentId(),
    type: KitchenType.Component,
    definitionId: 'progressBar',
    styles      : {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size   : 'medium'
      }
    },
    properties  : {
      value       : 66,
      status      : 'info',
      displayValue: false,
      name        : 'ProgressBar'
    }
  };
}

const progressBarDefinition: Definition = {
  id           : 'progressBar',
  componentType: ProgressComponent,
  definition   : ProgressBarDefinitionComponent,
  factory      : progressBarFactory
};

const progressBarMetaDefinition: MetaDefinition = {
  definition    : progressBarDefinition,
  name          : 'Progress bar',
  icon          : 'workbench:progress-bar',
  order         : 1000,
  headerSupport : true,
  sidebarSupport: true,
  tags          : ['progress']
};

@NgModule({
    imports: [DefinitionUtilsModule, TriProgressModule, CommonModule],
    exports: [ProgressBarDefinitionComponent],
    declarations: [ProgressBarDefinitionDirective, ProgressBarDefinitionComponent],
    providers: [
        createDefinitionProvider(progressBarDefinition),
        createMetaDefinitionProvider(progressBarMetaDefinition)
    ]
})
export class ProgressBarDefinitionModule {
}
