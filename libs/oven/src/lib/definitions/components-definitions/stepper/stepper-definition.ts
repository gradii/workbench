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
import { NbStepComponent, NbStepperComponent } from '@nebular/theme';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ComponentDefinition, DefinitionDirective, Slot, SlotDirective } from '../../definition-utils';
import { DefinitionContext } from '../../definition';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { UIDataService } from '../../definition-utils/ui-data.service';

type StepperDefinitionContext = DefinitionContext<NbStepperComponent>;

@Directive({ selector: '[ovenStepSlot]' })
export class StepSlotDirective extends SlotDirective {
  @Input() slotId: string;
}

const noop = (value: any) => {
};

@Directive({ selector: '[ovenStepperDefinition]' })
export class StepperDefinitionDirective implements OnDestroy {
  @ContentChildren(StepSlotDirective) stepperContent: QueryList<SlotDirective>;

  private clickListenersMap = {
    stepperPrevStep: noop,
    stepperNextStep: noop,
    stepperComplete: noop
  };

  private context: StepperDefinitionContext;
  private destroyed = new Subject();

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

  @ContentChildren(NbStepComponent)
  set steps(steps: QueryList<NbStepComponent[]>) {
    // set timeout prevents state update inside of component.service.bake method
    setTimeout(() => {
      this.uiDataService.updateUIVariable((this.context.view.instance as any).name, 'length', steps.length);
    });
  }

  @Input('ovenStepperDefinition') set view(context: StepperDefinitionContext) {
    this.context = context;

    context.view = {
      instance: this.stepper,
      slots: {},
      element: this.element,
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
    public stepper: NbStepperComponent,
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
      this.clickListenersMap[trigger]({ selectedIndex: this.stepper.selectedIndex, length: this.stepper.steps.length });
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
          this.uiDataService.updateUIVariable(name, 'selectedIndex', this.stepper.selectedIndex);
          this.uiDataService.updateUIVariable(name, 'length', this.stepper.steps.length);
        });
    }
  }
}

@Component({
  selector: 'oven-stepper-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-stepper
      cdkScrollable
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithActions]="context.view?.instance.actions"
      class="justify-{{ context.view?.instance.justify }}"
      [ovenStepperDefinition]="context"
    >
      <nb-step
        ovenStepSlot
        *ngFor="let step of context.view?.instance.options; trackBy: trackStep; let first = first; let last = last"
        [slotId]="step.id"
        [label]="step.value"
      >
        <ng-template ovenSlotPlaceholder></ng-template>

        <div class="stepper-buttons">
          <button #prev nbButton [disabled]="first" nbStepperPrevious>{{ context.view?.instance.prevText }}</button>
          <button #next nbButton *ngIf="!last" nbStepperNext>{{ context.view?.instance.nextText }}</button>
          <button #complete nbButton *ngIf="last && context.view?.instance.showComplete">
            {{ context.view?.instance.completeText }}
          </button>
        </div>
      </nb-step>
    </nb-stepper>
  `
})
export class StepperDefinitionComponent implements ComponentDefinition<StepperDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<StepperDefinitionContext>;

  trackStep(index, step) {
    return step.id;
  }
}
