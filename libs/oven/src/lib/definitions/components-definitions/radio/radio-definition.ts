import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { NbRadioGroupComponent } from '@nebular/theme';
import { Subject, Subscription } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { UIDataService } from '../../definition-utils/ui-data.service';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type RadioDefinitionContext = DefinitionContext<NbRadioGroupComponent>;

@Directive({ selector: '[ovenRadioDefinition]' })
export class RadioDefinitionDirective implements OnDestroy {
  private destroyed: Subject<void> = new Subject<void>();

  @Input('ovenRadioDefinition') set view(context: RadioDefinitionContext) {
    context.view = {
      instance: this.radio,
      slots: null,
      element: this.element
    };

    this.radio.valueChange.pipe(takeUntil(this.destroyed)).subscribe((value: string) => {
      this.uiDataService.updateUIVariable((context.view.instance as any).name, 'value', value);
    });

    this.actionsDirective.listen((eventType: string, callback: (value: any) => void) => {
      if (eventType === 'change') {
        const subscription: Subscription = this.radio.valueChange.subscribe(value => callback(value));
        return () => subscription.unsubscribe();
      }
    });
  }

  constructor(
    public radio: NbRadioGroupComponent,
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
  selector: 'oven-radio-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-radio-group
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithMargins]="context.view?.instance.margins"
      [name]="context.view?.instance.name"
      [ovenWithActions]="context.view?.instance.actions"
      [style.flexDirection]="getDirection(context)"
      [style.justifyContent]="context.view?.instance.justify"
      [style.alignContent]="context.view?.instance.align"
      [style.alignItems]="context.view?.instance.align"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [style.overflowX]="context.view?.instance.overflowX"
      [style.overflowY]="context.view?.instance.overflowY"
      [ovenRadioDefinition]="context"
    >
      <nb-radio *ngFor="let option of context.view?.instance.options; trackBy: optionTrack" [value]="option.value">
        {{ option.value }}
      </nb-radio>
    </nb-radio-group>
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
