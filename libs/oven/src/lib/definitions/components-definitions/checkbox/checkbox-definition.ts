import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NbCheckboxComponent } from '@nebular/theme';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { TextDirective } from '../../definition-utils/text/text.directive';
import { UIDataService } from '../../definition-utils/ui-data.service';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type CheckboxDefinitionContext = DefinitionContext<NbCheckboxComponent>;

@Directive({ selector: '[ovenCheckboxDefinition]' })
export class CheckboxDefinitionDirective implements OnInit, OnDestroy {
  @ContentChild(TextDirective, { static: true }) ovenText: TextDirective;

  private labelChange: Subject<any> = new Subject<any>();
  private destroyed: Subject<void> = new Subject<void>();

  @Input('ovenCheckboxDefinition') set view(context: CheckboxDefinitionContext) {
    context.view = {
      instance: this.checkbox,
      slots: null,
      element: this.element,
      properties$: this.labelChange.asObservable(),
      draggable$: this.ovenText.editMode$.pipe(map(editMode => !editMode)),
      editable$: this.ovenText.editMode$
    };
    this.actionsDirective.listen((eventType: string, callback: (value: any) => void) => {
      if (eventType === 'change') {
        const subscription: Subscription = this.checkbox.checkedChange.subscribe(value => callback(value));
        return () => subscription.unsubscribe();
      }
    });

    this.checkbox.checkedChange.pipe(takeUntil(this.destroyed)).subscribe((checked: boolean) => {
      this.uiDataService.updateUIVariable((context.view.instance as any).name, 'value', checked);
    });
  }

  constructor(
    public checkbox: NbCheckboxComponent,
    public element: ElementRef,
    private uiDataService: UIDataService,
    private actionsDirective: WithActionsDirective
  ) {
  }

  ngOnInit() {
    this.ovenText.textChange$
      .pipe(takeUntil(this.destroyed))
      .subscribe((label: string) => this.labelChange.next({ label }));
  }

  ngOnDestroy() {
    this.destroyed.next();
  }
}

@Component({
  selector: 'oven-checkbox-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-checkbox
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithDisabled]="context.view?.instance.ovenDisabled"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenCheckboxDefinition]="context"
    >
      <span ovenText textPropName="label" [ngModel]="context.view?.instance.label"></span>
    </nb-checkbox>
  `
})
export class CheckboxDefinitionComponent implements ComponentDefinition<CheckboxDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<CheckboxDefinitionContext>;
}
