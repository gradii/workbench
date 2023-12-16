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
import { NbFormFieldComponent } from '@nebular/theme';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { UIDataService } from '../../definition-utils/ui-data.service';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type InputDefinitionContext = DefinitionContext<NbFormFieldComponent>;

@Directive({ selector: '[ovenInputDefinition]' })
export class InputDefinitionDirective implements OnDestroy {
  @ContentChild(WithActionsDirective, { static: true }) actionsDirective: WithActionsDirective;

  private destroyed: Subject<void> = new Subject<void>();

  @Input('ovenInputDefinition') set context(context: InputDefinitionContext) {
    context.view = {
      instance: this.formField,
      slots: null,
      element: this.element
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
    public formField: NbFormFieldComponent,
    private uiDataService: UIDataService,
    public element: ElementRef
  ) {
  }

  ngOnDestroy() {
    this.destroyed.next();
  }
}

@Component({
  selector: 'oven-input-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./input-definition.component.scss'],
  template: `
    <nb-form-field
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithFormFieldWidth]="context.view?.instance.width"
      [class.form-field-full-width]="context.view?.instance.width?.type === 'full'"
      [ovenInputDefinition]="context"
    >
      <nb-icon
        *ngIf="context.view?.instance.iconPlacement === 'start'"
        nbPrefix
        [icon]="context.view?.instance.icon"
        pack="eva"
      >
      </nb-icon>

      <input
        nbInput
        [ovenWithActions]="context.view?.instance.actions"
        [fieldSize]="context.view?.instance.size"
        [ovenWithDisabled]="context.view?.instance.ovenDisabled"
        fullWidth
        [placeholder]="context.view?.instance.placeholder"
        [type]="context.view?.instance.type"
        [status]="context.view?.instance.status"
        [shape]="context.view?.instance.shape"
      />

      <nb-icon
        *ngIf="context.view?.instance.iconPlacement === 'end'"
        nbSuffix
        [icon]="context.view?.instance.icon"
        pack="eva"
      >
      </nb-icon>
    </nb-form-field>
  `
})
export class InputDefinitionComponent implements ComponentDefinition<InputDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<InputDefinitionContext>;
}
