import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { NbDatepickerDirective } from '@nebular/theme';
import { Subject, Subscription } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { UIDataService } from '../../definition-utils/ui-data.service';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type DatepickerDefinitionContext = DefinitionContext<NbDatepickerDirective<Date>>;

@Directive({ selector: '[ovenDatepickerDefinition]' })
export class DatepickerDefinitionDirective implements OnDestroy {
  private destroyed: Subject<void> = new Subject<void>();

  private datePickerData = new Subject<Date>();

  @Input('ovenDatepickerDefinition') set view(context: DatepickerDefinitionContext) {
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
    public datePicker: NbDatepickerDirective<Date>,
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
  selector: 'oven-datepicker-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ovenDefinition="let context">
      <input
        [nbDatepicker]="datepicker"
        nbInput
        [ovenWithVisible]="context.view?.instance.visible"
        [ovenWithMargins]="context.view?.instance.margins"
        [ovenWithActions]="context.view?.instance.actions"
        [fieldSize]="context.view?.instance.size"
        [status]="context.view?.instance.status"
        [shape]="context.view?.instance.shape"
        [ovenWithDisabled]="context.view?.instance.ovenDisabled"
        [fullWidth]="context.view?.instance.width?.type === 'full'"
        [ovenWithFormFieldWidth]="context.view?.instance.width"
        [placeholder]="context.view?.instance.placeholder"
        [ovenDatepickerDefinition]="context"
      />
      <nb-datepicker #datepicker> </nb-datepicker>
    </ng-container>
  `
})
export class DatepickerDefinitionComponent implements ComponentDefinition<DatepickerDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<DatepickerDefinitionContext>;
}
