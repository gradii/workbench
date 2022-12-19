import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
  ContentChild,
  OnDestroy
} from '@angular/core';
import { InputDirective } from '@gradii/triangle/input';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { UIDataService } from '../../definition-utils/ui-data.service';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type InputDefinitionContext = DefinitionContext<InputDirective>;

@Directive({ selector: '[kitchenInputDefinition]' })
export class InputDefinitionDirective implements OnDestroy {
  @ContentChild(WithActionsDirective, { static: true }) actionsDirective: WithActionsDirective;

  private destroyed: Subject<void> = new Subject<void>();

  @Input('kitchenInputDefinition') set context(context: InputDefinitionContext) {
    context.view = {
      instance: this.input,
      slots   : null,
      element : this.element
    };

    this.actionsDirective.listen((eventType: string, callback: (value: any) => void) => {
      return this.renderer.listen(this.element.nativeElement, 'keyup', event => callback(event.target.value));
    });

    fromEvent(this.element.nativeElement, 'keyup')
      .pipe(takeUntil(this.destroyed))
      .subscribe((event: any) => {
        this.uiDataService.updateUIVariable((context.view.instance as any).name, 'value', event.target.value);
      });
  }

  constructor(
    private renderer: Renderer2,
    public input: InputDirective,
    private uiDataService: UIDataService,
    public element: ElementRef
  ) {
  }

  ngOnDestroy() {
    this.destroyed.next();
  }
}

@Component({
  selector       : 'kitchen-input-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./input-definition.component.scss'],
  template       : `
    <tri-input-group
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithFormFieldWidth]="context.view?.instance.width"
      [class.form-field-full-width]="context.view?.instance.width?.type === 'full'"
      [kitchenInputDefinition]="context"
    >
      <tri-icon
        *ngIf="context.view?.instance.iconPlacement === 'start'"
        #prefix
        [svgIcon]="context.view?.instance.icon"
      >
      </tri-icon>

      <input
        triInput
        [kitchenWithActions]="context.view?.instance.actions"
        [kitchenWithDisabled]="context.view?.instance.kitchenDisabled"
        fullWidth
        [placeholder]="context.view?.instance.placeholder"
        [type]="context.view?.instance.type"
      />

      <tri-icon
        *ngIf="context.view?.instance.iconPlacement === 'end'"
        #suffix
        [svgIcon]="context.view?.instance.icon"
      >
      </tri-icon>
    </tri-input-group>
  `
})
export class InputDefinitionComponent implements ComponentDefinition<InputDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<InputDefinitionContext>;
}
