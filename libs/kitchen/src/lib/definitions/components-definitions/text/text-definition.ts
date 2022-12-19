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

type TextDefinitionContext = DefinitionContext<null>;

@Directive({ selector: '[kitchenTextDefinition]' })
export class TextDefinitionDirective implements OnInit {
  @ContentChild(TextDirective) kitchenText: TextDirective;
  private textChange: Subject<any> = new Subject<any>();
  private elementChange: BehaviorSubject<ElementRef> = new BehaviorSubject<ElementRef>(this.element);

  @ContentChild('text', { read: ElementRef }) set el(el_: ElementRef) {
    this._element = el_;
    this.elementChange.next(el_);
  }

  private _element: ElementRef;

  get element(): ElementRef {
    return this._element || { nativeElement: {} };
  }

  @Input('kitchenTextDefinition') set context(context: TextDefinitionContext) {
    const this_ = this;
    context.view = {
      instance: {} as any,
      slots: null,

      get element() {
        return this_.element;
      },

      properties$: this.textChange.asObservable(),
      elementChange$: this.elementChange.asObservable(),
      draggable$: this.elementChange.asObservable().pipe(
        filter(() => !!this.kitchenText),
        switchMap(() => this.kitchenText.editMode$),
        map((editMode: boolean) => !editMode)
      ),
      editable$: this.elementChange.asObservable().pipe(
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
  selector: 'kitchen-text-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *kitchenDefinition="let context" [kitchenTextDefinition]="context" [ngSwitch]="true">
      <p
        *ngSwitchCase="context.view?.instance.type === 'paragraph' || context.view?.instance.type === 'paragraph-2'"
        #text
        kitchenText
        [kitchenWithVisible]="context.view?.instance.visible"
        [ngModel]="context.view?.instance.text"
        [kitchenWithTextStyles]="context.view?.instance"
        [kitchenWithMargins]="context.view?.instance.margins"
        [kitchenWithThemeVariable]="computeThemeVariables(context.view?.instance)"
      ></p>
      <label
        *ngSwitchCase="context.view?.instance.type === 'label'"
        #text
        kitchenText
        [kitchenWithVisible]="context.view?.instance.visible"
        [ngModel]="context.view?.instance.text"
        [kitchenWithTextStyles]="context.view?.instance"
        [kitchenWithMargins]="context.view?.instance.margins"
      ></label>
      <span
        *ngSwitchDefault
        #text
        kitchenText
        [kitchenWithVisible]="context.view?.instance.visible"
        [ngModel]="context.view?.instance.text"
        [kitchenWithTextStyles]="context.view?.instance"
        [kitchenWithMargins]="context.view?.instance.margins"
      ></span>
    </ng-container>
  `
})
export class TextDefinitionComponent implements ComponentDefinition<TextDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<TextDefinitionContext>;

  computeThemeVariables(instance) {
    return (
      instance && {
        '--text-color': textColors[instance.color]
      }
    );
  }
}
