import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { DatePickerComponent } from '@gradii/triangle/date-picker';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { UIDataService } from '../../definition-utils/ui-data.service';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type DatepickerDefinitionContext = DefinitionContext<DatePickerComponent>;

@Directive({ selector: '[kitchenDatepickerDefinition]' })
export class DatepickerDefinitionDirective implements OnDestroy {
  private destroyed: Subject<void> = new Subject<void>();

  private datePickerData = new Subject<Date>();

  @Input('kitchenDatepickerDefinition') set view(context: DatepickerDefinitionContext) {
    context.view = {
      instance: this.datePicker,
      slots: null,
      element: this.element
    };

    // the picker.dateChange observer emit changes only by clicking
    this.datePicker.registerOnChange(d => this.datePickerData.next(d));

    this.datePickerData.pipe(takeUntil(this.destroyed)).subscribe(date => {
      this.uiDataService.updateUIVariable((context.view.instance as any).name, 'value', date);
    });

    this.actionsDirective.listen((eventType: string, callback: (value: any) => void) => {
      if (eventType === 'change') {
        const subscription: Subscription = this.datePickerData.subscribe(date => callback(date));
        return () => subscription.unsubscribe();
      }
    });
  }

  constructor(
    public datePicker: DatePickerComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective,
    private uiDataService: UIDataService
  ) {
  }

  ngOnDestroy() {
    this.destroyed.next();
  }
}

@Component({
  selector: 'kitchen-datepicker-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *kitchenDefinition="let context">
      <tri-date-picker
        [kitchenWithVisible]="context.view?.instance.visible"
        [kitchenWithMargins]="context.view?.instance.margins"
        [kitchenWithActions]="context.view?.instance.actions"
        [kitchenWithDisabled]="context.view?.instance.kitchenDisabled"
        [kitchenWithFormFieldWidth]="context.view?.instance.width"
        [placeholder]="context.view?.instance.placeholder"
        [kitchenDatepickerDefinition]="context"
      ></tri-date-picker>
    </ng-container>
  `
})
export class DatepickerDefinitionComponent implements ComponentDefinition<DatepickerDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<DatepickerDefinitionContext>;
}
