import { BreakpointWidth, nextComponentId, OvenComponent, OvenSlot } from '@common';
import { NbButtonModule, NbStepperComponent, NbStepperModule } from '@nebular/theme';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { spaceFactory } from '../space/space-definition.module';
import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { StepperDefinitionComponent, StepperDefinitionDirective, StepSlotDirective } from './stepper-definition';
import { DefinitionUtilsModule } from '../../definition-utils';

export function stepperFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'stepper',
    slots: {
      step0: new OvenSlot([spaceFactory([], 'flex-start', true)]),
      step1: new OvenSlot([spaceFactory([], 'flex-start', true)])
    },
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        orientation: 'horizontal',
        size: {
          widthValue: 100,
          widthUnit: '%',
          widthAuto: false,
          heightValue: 200,
          heightUnit: 'px',
          heightAuto: true
        },
        justify: 'space-between'
      }
    },
    properties: {
      disableStepNavigation: false,
      options: [
        { value: 'Step 1', id: 'step0' },
        { value: 'Step 2', id: 'step1' }
      ],
      name: 'Stepper',
      container: true,
      prevText: 'Prev',
      nextText: 'Next',
      completeText: 'Complete',
      showComplete: true
    },
    actions: {
      init: [],
      stepperPrevStep: [],
      stepperNextStep: [],
      stepperComplete: []
    }
  };
}

const stepperDefinition: Definition = {
  id: 'stepper',
  componentType: NbStepperComponent,
  definition: StepperDefinitionComponent,
  factory: stepperFactory
};

const stepperMetaDefinition: MetaDefinition = {
  definition: stepperDefinition,
  name: 'Stepper',
  icon: 'stepper',
  order: 1200,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['stepper']
};

@NgModule({
  imports: [DefinitionUtilsModule, NbStepperModule, CommonModule, ScrollingModule, NbButtonModule],
  exports: [StepperDefinitionComponent],
  declarations: [StepperDefinitionDirective, StepperDefinitionComponent, StepSlotDirective],
  entryComponents: [StepperDefinitionComponent],
  providers: [createDefinitionProvider(stepperDefinition), createMetaDefinitionProvider(stepperMetaDefinition)]
})
export class StepperDefinitionModule {
}
