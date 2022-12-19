import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, KitchenComponent, KitchenSlot, KitchenType, nextComponentId } from '@common/public-api';
import { TriButtonModule } from '@gradii/triangle/button';
import { StepComponent, TriStepsModule } from '@gradii/triangle/steps';
import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';

import { spaceFactory } from '../space/space-definition.module';
import { StepperDefinitionComponent, StepperDefinitionDirective, StepSlotDirective } from './stepper-definition';

export function stepperFactory(): KitchenComponent {
  return {
    id          : nextComponentId(),
    type: KitchenType.Component,
    definitionId: 'stepper',
    slots       : {
      step0: new KitchenSlot([spaceFactory([], 'flex-start', true)]),
      step1: new KitchenSlot([spaceFactory([], 'flex-start', true)])
    },
    styles      : {
      [BreakpointWidth.Desktop]: {
        visible    : true,
        orientation: 'horizontal',
        size       : {
          widthValue : 100,
          widthUnit  : '%',
          widthAuto  : false,
          heightValue: 200,
          heightUnit : 'px',
          heightAuto : true
        },
        justify    : 'space-between'
      }
    },
    properties  : {
      disableStepNavigation: false,
      options              : [
        { value: 'Step 1', id: 'step0' },
        { value: 'Step 2', id: 'step1' }
      ],
      name                 : 'Stepper',
      container            : true,
      prevText             : 'Prev',
      nextText             : 'Next',
      completeText         : 'Complete',
      showComplete         : true
    },
    actions     : {
      init           : [],
      stepperPrevStep: [],
      stepperNextStep: [],
      stepperComplete: []
    }
  };
}

const stepperDefinition: Definition = {
  id           : 'stepper',
  componentType: StepComponent,
  definition   : StepperDefinitionComponent,
  factory      : stepperFactory
};

const stepperMetaDefinition: MetaDefinition = {
  definition    : stepperDefinition,
  name          : 'Stepper',
  icon          : 'workbench:stepper',
  order         : 1200,
  headerSupport : false,
  sidebarSupport: false,
  tags          : ['stepper']
};

@NgModule({
    imports: [DefinitionUtilsModule, TriStepsModule, CommonModule, ScrollingModule, TriButtonModule],
    exports: [StepperDefinitionComponent],
    declarations: [StepperDefinitionDirective, StepperDefinitionComponent, StepSlotDirective],
    providers: [createDefinitionProvider(stepperDefinition), createMetaDefinitionProvider(stepperMetaDefinition)]
})
export class StepperDefinitionModule {
}
