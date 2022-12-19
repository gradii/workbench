import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewChild
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ComponentDefinition, DefinitionDirective, Slot, SlotDirective } from '../../definition-utils';
import { DefinitionContext } from '../../definition';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { UIDataService } from '../../definition-utils/ui-data.service';
import { StepComponent, StepsComponent } from '@gradii/triangle/steps';

type StepperDefinitionContext = DefinitionContext<StepsComponent>;

@Directive({ selector: '[kitchenStepSlot]' })
export class StepSlotDirective extends SlotDirective {
  @Input() slotId: string;
}

const noop = (value: any) => {
};

@Directive({ selector: '[kitchenStepperDefinition]' })
export class StepperDefinitionDirective implements OnDestroy {
  @ContentChildren(StepSlotDirective) stepperContent: QueryList<SlotDirective>;

  private clickListenersMap = {
    stepperPrevStep: noop,
    stepperNextStep: noop,
    stepperComplete: noop
  };

  private context: StepperDefinitionContext;
  private destroyed = new Subject<void>();

  @ContentChildren('prev', { descendants: true, read: ElementRef })
  set prev(btnElements: QueryList<ElementRef>) {
    this.subscribeToTrigger('stepperPrevStep', btnElements.toArray());
    this.subscribeToStore(btnElements.toArray());
  }

  @ContentChildren('next', { descendants: true, read: ElementRef })
  set next(btnElements: QueryList<ElementRef>) {
    this.subscribeToTrigger('stepperNextStep', btnElements.toArray());
    this.subscribeToStore(btnElements.toArray());
  }

  @ContentChildren('complete', { descendants: true, read: ElementRef })
  set complete(btnElements: QueryList<ElementRef>) {
    this.subscribeToTrigger('stepperComplete', btnElements.toArray());
    this.subscribeToStore(btnElements.toArray());
  }

  @ContentChildren(StepComponent)
  set steps(steps: QueryList<StepComponent[]>) {
    // set timeout prevents state update inside of component.service.bake method
    setTimeout(() => {
      this.uiDataService.updateUIVariable((this.context.view.instance as any).name, 'length', steps.length);
    });
  }

  @Input('kitchenStepperDefinition') set view(context: StepperDefinitionContext) {
    this.context = context;

    context.view = {
      instance          : this.stepper,
      slots             : {},
      element           : this.element,
      updateDynamicSlots: () => {
        context.view.slots = this.stepperContent.reduce((slots: { [key: string]: Slot }, item: StepSlotDirective) => {
          slots[item.slotId] = item;
          return slots;
        }, {});
      }
    };

    /**
     * Since stepper buttons won't be present at the moment of the first `listen` call
     * and we have not one `prev` `next` buttons, but a new copy EACH step
     * we need to defer the callback execution
     * thus we store the callbacks in a map
     * and then execute the callback once we have a button and listen it `click` event in the @ContentChildren
     */
    this.actionsDirective.listen((eventType: string, callback: (value: any) => void) => {
      this.clickListenersMap[eventType] = callback;
      return () => {
        /* no need to unsubscribe as stepper click listeners live until stepper exists */
      };
    });
  }

  constructor(
    private renderer: Renderer2,
    public stepper: StepsComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective,
    private uiDataService: UIDataService
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }

  subscribeToTrigger(trigger: string, elements: ElementRef[]) {
    // we want to pass one callback to all buttons of the same type
    const callback = () => {
      this.clickListenersMap[trigger]({ selectedIndex: this.stepper.current });
    };
    elements.forEach(btn => {
      this.renderer.listen(btn.nativeElement, 'click', callback);
    });
  }

  subscribeToStore(buttons: ElementRef[]): void {
    for (const button of buttons) {
      fromEvent(button.nativeElement, 'click')
        .pipe(takeUntil(this.destroyed))
        .subscribe(() => {
          const name = (this.context.view.instance as any).name;
          this.uiDataService.updateUIVariable(name, 'selectedIndex', this.stepper.current);
          // this.uiDataService.updateUIVariable(name, 'length', this.stepper.steps.length);
        });
    }
  }
}

@Component({
  selector       : 'kitchen-stepper-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-steps
      cdkScrollable
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithActions]="context.view?.instance.actions"
      class="justify-{{ context.view?.instance.justify }}"
      [kitchenStepperDefinition]="context"
    >
      <tri-step
        kitchenStepSlot
        *ngFor="let step of context.view?.instance.options; trackBy: trackStep; let first = first; let last = last"
        [slotId]="step.id"
        [title]="step.value"
      >
        <ng-template kitchenSlotPlaceholder></ng-template>

        <div class="stepper-buttons">
          <button #prev triButton [disabled]="first" nbStepperPrevious>{{ context.view?.instance.prevText }}</button>
          <button #next triButton *ngIf="!last" nbStepperNext>{{ context.view?.instance.nextText }}</button>
          <button #complete triButton *ngIf="last && context.view?.instance.showComplete">
            {{ context.view?.instance.completeText }}
          </button>
        </div>
      </tri-step>
    </tri-steps>
  `
})
export class StepperDefinitionComponent implements ComponentDefinition<StepperDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<StepperDefinitionContext>;

  trackStep(index, step) {
    return step.id;
  }
}
