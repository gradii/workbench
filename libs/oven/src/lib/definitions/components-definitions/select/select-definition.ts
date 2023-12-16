import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { NbSelectComponent } from '@nebular/theme';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FormFieldWidthType } from '@common';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { UIDataService } from '../../definition-utils/ui-data.service';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type SelectDefinitionContext = DefinitionContext<NbSelectComponent>;

@Directive({ selector: '[ovenSelectDefinition]' })
export class SelectDefinitionDirective implements OnDestroy {
  private destroyed: Subject<void> = new Subject<void>();

  @Input('ovenSelectDefinition') set view(context: SelectDefinitionContext) {
    context.view = {
      instance: this.select,
      slots: null,
      element: this.element
    };

    this.select.selectedChange.pipe(takeUntil(this.destroyed)).subscribe((value: string) => {
      this.uiDataService.updateUIVariable((context.view.instance as any).name, 'value', value);
    });

    this.actionsDirective.listen((eventType: string, callback: (value: any) => void) => {
      if (eventType === 'change') {
        const subscription: Subscription = this.select.selectedChange.subscribe(value => callback(value));
        return () => subscription.unsubscribe();
      }
    });
  }

  constructor(
    public select: NbSelectComponent,
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
  selector: 'oven-select-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-select
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithMargins]="context.view?.instance.margins"
      [status]="context.view?.instance.status"
      [size]="context.view?.instance.size"
      [fullWidth]="context.view?.instance.width.type === 'full'"
      [ovenWithFormFieldWidth]="context.view?.instance.width"
      [ovenWithDisabled]="context.view?.instance.ovenDisabled"
      [placeholder]="context.view?.instance.placeholder"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenSelectDefinition]="context"
      [class.no-width-restriction]="isCustomWidth(context.view?.instance.width.type)"
    >
      <nb-option *ngFor="let option of context.view?.instance.optionsList" [value]="option.value">
        {{ option.value }}
      </nb-option>
    </nb-select>
  `,
  styleUrls: ['./select-definition.component.scss']
})
export class SelectDefinitionComponent implements ComponentDefinition<SelectDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<SelectDefinitionContext>;

  isCustomWidth(widthType: FormFieldWidthType): boolean {
    return widthType === FormFieldWidthType.CUSTOM;
  }
}
