import {
  ChangeDetectionStrategy, Component, ContentChild, Directive, ElementRef, Input, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { CheckboxComponent } from '@gradii/triangle/checkbox';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { TextDirective } from '../../definition-utils/text/text.directive';
import { UIDataService } from '../../definition-utils/ui-data.service';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type CheckboxDefinitionContext = DefinitionContext<CheckboxComponent>;

@Directive({ selector: '[kitchenCheckboxDefinition]' })
export class CheckboxDefinitionDirective implements OnInit, OnDestroy {
  @ContentChild(TextDirective, { static: true }) kitchenText: TextDirective;

  private labelChange: Subject<any> = new Subject<any>();
  private destroyed: Subject<void> = new Subject<void>();

  @Input('kitchenCheckboxDefinition') set view(context: CheckboxDefinitionContext) {
    context.view = {
      instance: this.checkbox,
      slots: null,
      element: this.element,
      properties$: this.labelChange.asObservable(),
      draggable$: this.kitchenText.editMode$.pipe(map(editMode => !editMode)),
      editable$: this.kitchenText.editMode$
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
    public checkbox: CheckboxComponent,
    public element: ElementRef,
    private uiDataService: UIDataService,
    private actionsDirective: WithActionsDirective
  ) {
  }

  ngOnInit() {
    this.kitchenText.textChange$
      .pipe(takeUntil(this.destroyed))
      .subscribe((label: string) => this.labelChange.next({ label }));
  }

  ngOnDestroy() {
    this.destroyed.next();
  }
}

@Component({
  selector: 'kitchen-checkbox-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tri-checkbox
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithDisabled]="context.view?.instance.kitchenDisabled"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithActions]="context.view?.instance.actions"
      [kitchenCheckboxDefinition]="context"
    >
      <span kitchenText [ngModel]="context.view?.instance.label"></span>
    </tri-checkbox>
  `
})
export class CheckboxDefinitionComponent implements ComponentDefinition<CheckboxDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<CheckboxDefinitionContext>;
}
