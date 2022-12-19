import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { TextDirective } from '../../definition-utils/text/text.directive';
import { textColors } from '../../definition-utils/with-theme-variable.directive';

type HeadingDefinitionContext = DefinitionContext<null>;

@Directive({ selector: '[kitchenHeadingDefinition]' })
export class HeadingDefinitionDirective implements OnInit {
  @ContentChild(TextDirective)
  kitchenText: TextDirective;

  private textChange: Subject<any>                   = new Subject<any>();
  private elementChange: BehaviorSubject<ElementRef> = new BehaviorSubject<ElementRef>(this.element);

  @ContentChild('heading', { read: ElementRef })
  set el(el_: ElementRef) {
    this._element = el_;
    this.elementChange.next(el_);
  }

  private _element: ElementRef;

  get element(): ElementRef {
    return this._element || { nativeElement: {} };
  }

  @Input('kitchenHeadingDefinition')
  set context(context: HeadingDefinitionContext) {
    const this_  = this;
    context.view = {
      instance: {} as any,
      slots   : null,

      get element() {
        return this_.element;
      },

      elementChange$: this.elementChange.asObservable(),
      properties$   : this.textChange.asObservable(),
      draggable$    : this.elementChange.asObservable().pipe(
        filter(() => !!this.kitchenText),
        switchMap(() => this.kitchenText.editMode$),
        map((editMode: boolean) => !editMode)
      ),
      editable$     : this.elementChange.asObservable().pipe(
        filter(() => !!this.kitchenText),
        switchMap(() => this.kitchenText.editMode$)
      )
    };
  }

  ngOnInit() {
    this.elementChange
      .asObservable()
      .pipe(
        filter(() => !!this.kitchenText),
        switchMap(() => this.kitchenText.textChange$)
      )
      .subscribe((text: string) => this.textChange.next({ text }));
  }
}

@Component({
  selector       : 'kitchen-heading-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <ng-container
      *kitchenDefinition="let context"
      [ngSwitch]="context.view?.instance.type"
      [kitchenHeadingDefinition]="context"
    >
      <h1
        *ngSwitchCase="'h1'"
        #heading
        kitchenText
        [kitchenWithVisible]="context.view?.instance.visible"
        [ngModel]="context.view?.instance.text"
        [kitchenWithTextStyles]="context.view?.instance"
        [kitchenWithMargins]="context.view?.instance.margins"
        [kitchenWithThemeVariable]="computeThemeVariables(context.view?.instance)"
      ></h1>
      <h2
        *ngSwitchCase="'h2'"
        #heading
        kitchenText
        [kitchenWithVisible]="context.view?.instance.visible"
        [ngModel]="context.view?.instance.text"
        [kitchenWithTextStyles]="context.view?.instance"
        [kitchenWithMargins]="context.view?.instance.margins"
        [kitchenWithThemeVariable]="computeThemeVariables(context.view?.instance)"
      ></h2>
      <h3
        *ngSwitchCase="'h3'"
        #heading
        kitchenText
        [kitchenWithVisible]="context.view?.instance.visible"
        [ngModel]="context.view?.instance.text"
        [kitchenWithTextStyles]="context.view?.instance"
        [kitchenWithMargins]="context.view?.instance.margins"
        [kitchenWithThemeVariable]="computeThemeVariables(context.view?.instance)"
      ></h3>
      <h4
        *ngSwitchCase="'h4'"
        #heading
        kitchenText
        [kitchenWithVisible]="context.view?.instance.visible"
        [ngModel]="context.view?.instance.text"
        [kitchenWithTextStyles]="context.view?.instance"
        [kitchenWithMargins]="context.view?.instance.margins"
        [kitchenWithThemeVariable]="computeThemeVariables(context.view?.instance)"
      ></h4>
      <h5
        *ngSwitchCase="'h5'"
        #heading
        kitchenText
        [kitchenWithVisible]="context.view?.instance.visible"
        [ngModel]="context.view?.instance.text"
        [kitchenWithTextStyles]="context.view?.instance"
        [kitchenWithMargins]="context.view?.instance.margins"
        [kitchenWithThemeVariable]="computeThemeVariables(context.view?.instance)"
      ></h5>
      <h6
        *ngSwitchCase="'h6'"
        #heading
        kitchenText
        [kitchenWithVisible]="context.view?.instance.visible"
        [ngModel]="context.view?.instance.text"
        [kitchenWithTextStyles]="context.view?.instance"
        [kitchenWithMargins]="context.view?.instance.margins"
        [kitchenWithThemeVariable]="computeThemeVariables(context.view?.instance)"
      ></h6>
    </ng-container>
  `
})
export class HeadingDefinitionComponent implements ComponentDefinition<HeadingDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<HeadingDefinitionContext>;

  computeThemeVariables(instance) {
    return (
      instance && {
        '--heading-color': textColors[instance.color]
      }
    );
  }
}
