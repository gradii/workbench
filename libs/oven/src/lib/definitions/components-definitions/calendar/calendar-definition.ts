import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { NbCalendarComponent } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { UIDataService } from '../../definition-utils/ui-data.service';

type CalendarDefinitionContext = DefinitionContext<NbCalendarComponent<Date>>;

@Directive({ selector: '[ovenCalendarDefinition]' })
export class CalendarDefinitionDirective implements OnDestroy {
  @Input('ovenCalendarDefinition') set view(context: CalendarDefinitionContext) {
    context.view = {
      instance: this.calendar,
      slots: null,
      element: this.element
    };

    this.calendar.dateChange.pipe(takeUntil(this.destroyed)).subscribe((date: Date) => {
      this.uiDataService.updateUIVariable((context.view.instance as any).name, 'value', date);
    });
  }

  private destroyed = new Subject<void>();

  constructor(
    public calendar: NbCalendarComponent<Date>,
    public element: ElementRef,
    private uiDataService: UIDataService
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }
}

@Component({
  selector: 'oven-calendar-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-calendar
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenCalendarDefinition]="context"
      [ovenWithMargins]="context.view?.instance.margins"
    >
    </nb-calendar>
  `
})
export class CalendarDefinitionComponent implements ComponentDefinition<CalendarDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<CalendarDefinitionContext>;
}
