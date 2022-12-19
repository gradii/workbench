import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

import { FormFieldWidthType } from '@common/public-api';
import { TriSelect } from '@gradii/triangle/select';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { UIDataService } from '../../definition-utils/ui-data.service';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type SelectDefinitionContext = DefinitionContext<TriSelect>;

@Directive({ selector: '[kitchenSelectDefinition]' })
export class SelectDefinitionDirective implements OnDestroy {
  private destroyed: Subject<void> = new Subject<void>();

  @Input('kitchenSelectDefinition') set view(context: SelectDefinitionContext) {
    context.view = {
      instance: this.select,
      slots   : null,
      element : this.element
    };

    this.select.valueChange.pipe(takeUntil(this.destroyed)).subscribe((value: string) => {
      this.uiDataService.updateUIVariable((context.view.instance as any).name, 'value', value);
    });

    this.actionsDirective.listen((eventType: string, callback: (value: any) => void) => {
      if (eventType === 'change') {
        const subscription: Subscription = this.select.valueChange.subscribe(value => callback(value));
        return () => subscription.unsubscribe();
      }
    });
  }

  constructor(
    public select: TriSelect,
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
  selector       : 'kitchen-select-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-select
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithMargins]="context.view?.instance.margins"
      [size]="context.view?.instance.size"
      [kitchenWithFormFieldWidth]="context.view?.instance.width"
      [kitchenWithDisabled]="context.view?.instance.kitchenDisabled"
      [placeholder]="context.view?.instance.placeholder"
      [kitchenWithActions]="context.view?.instance.actions"
      [kitchenSelectDefinition]="context"
      [class.no-width-restriction]="isCustomWidth(context.view?.instance.width.type)"
    >
      <tri-option *ngFor="let option of context.view?.instance.optionsList" [value]="option.value">
        {{ option.value }}
      </tri-option>
    </tri-select>
  `,
  styleUrls      : ['./select-definition.component.scss']
})
export class SelectDefinitionComponent implements ComponentDefinition<SelectDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<SelectDefinitionContext>;

  isCustomWidth(widthType: FormFieldWidthType): boolean {
    return widthType === FormFieldWidthType.CUSTOM;
  }
}
