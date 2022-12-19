import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {RadioGroupComponent} from '@gradii/triangle/radio'

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { UIDataService } from '../../definition-utils/ui-data.service';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type RadioDefinitionContext = DefinitionContext<RadioGroupComponent>;

@Directive({ selector: '[kitchenRadioDefinition]' })
export class RadioDefinitionDirective implements OnDestroy {
  private destroyed: Subject<void> = new Subject<void>();

  @Input('kitchenRadioDefinition') set view(context: RadioDefinitionContext) {
    context.view = {
      instance: this.radio,
      slots: null,
      element: this.element
    };

    this.radio.radioGroupDirective.valueChange.pipe(takeUntil(this.destroyed)).subscribe((value: string) => {
      this.uiDataService.updateUIVariable((context.view.instance as any).name, 'value', value);
    });

    this.actionsDirective.listen((eventType: string, callback: (value: any) => void) => {
      if (eventType === 'change') {
        const subscription: Subscription = this.radio.radioGroupDirective.valueChange.subscribe(value => callback(value));
        return () => subscription.unsubscribe();
      }
    });
  }

  constructor(
    public radio: RadioGroupComponent,
    public element: ElementRef,
    private uiDataService: UIDataService,
    private actionsDirective: WithActionsDirective
  ) {
  }

  ngOnDestroy() {
    this.destroyed.next();
  }
}

@Component({
  selector: 'kitchen-radio-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tri-radio-group
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithActions]="context.view?.instance.actions"
      [style.flexDirection]="getDirection(context)"
      [style.justifyContent]="context.view?.instance.justify"
      [style.alignContent]="context.view?.instance.align"
      [style.alignItems]="context.view?.instance.align"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [style.overflowX]="context.view?.instance.overflowX"
      [style.overflowY]="context.view?.instance.overflowY"
      [kitchenRadioDefinition]="context"
    >
      <label tri-radio *ngFor="let option of context.view?.instance.options; trackBy: optionTrack" [value]="option.value">
        {{ option.value }}
      </label>
    </tri-radio-group>
  `
})
export class RadioDefinitionComponent implements ComponentDefinition<RadioDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<RadioDefinitionContext>;

  getDirection(context): 'row' | 'column' {
    if (context.view?.instance.direction === 'row') {
      return 'row';
    }

    return 'column';
  }

  optionTrack(i: number, option: { value: any }): string {
    return `${i}${option.value}`;
  }
}
