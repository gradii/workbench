import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { CalendarComponent } from '@gradii/triangle/calendar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { UIDataService } from '../../definition-utils/ui-data.service';

type CalendarDefinitionContext = DefinitionContext<CalendarComponent>;

@Directive({ selector: '[kitchenCalendarDefinition]' })
export class CalendarDefinitionDirective implements OnDestroy {
  @Input('kitchenCalendarDefinition') set view(context: CalendarDefinitionContext) {
    context.view = {
      instance: this.calendar,
      slots   : null,
      element : this.element
    };

    this.calendar.valueChange.pipe(takeUntil(this.destroyed)).subscribe((date: Date) => {
      this.uiDataService.updateUIVariable((context.view.instance as any).name, 'value', date);
    });
  }

  private destroyed = new Subject<void>();

  constructor(
    public calendar: CalendarComponent,
    public element: ElementRef,
    private uiDataService: UIDataService
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }
}

@Component({
  selector       : 'kitchen-calendar-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-calendar
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenCalendarDefinition]="context"
      [kitchenWithMargins]="context.view?.instance.margins"
    >
    </tri-calendar>
  `
})
export class CalendarDefinitionComponent implements ComponentDefinition<CalendarDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<CalendarDefinitionContext>;
}
