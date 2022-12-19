import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { IconComponent } from '@gradii/triangle/icon';
import { BehaviorSubject } from 'rxjs';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { textColors } from '../../definition-utils/with-theme-variable.directive';

interface IconDefinitionContext extends DefinitionContext<IconComponent> {
}

@Directive({ selector: '[kitchenIconDefinition]' })
export class IconDefinitionDirective {
  @Output() kitchenOnDevUiChange: EventEmitter<boolean> = new EventEmitter();
  private elementChange: BehaviorSubject<ElementRef> = new BehaviorSubject<ElementRef>(this.element);

  @ContentChild('icon', { read: ElementRef }) set el(el_: ElementRef) {
    this._element = el_;
    this.elementChange.next(el_);
  }

  private _element: ElementRef;

  get element(): ElementRef {
    return this._element || { nativeElement: {} };
  }

  private _context: IconDefinitionContext;

  @Input('kitchenIconDefinition') set context(context: IconDefinitionContext) {
    this._context = context;
    const this_ = this;

    context.devUIEnabled$.subscribe(enabled => this.kitchenOnDevUiChange.emit(enabled));

    context.view = {
      instance: {} as any,
      slots: null,

      get element() {
        return this_.element;
      },

      elementChange$: this.elementChange.asObservable()
    };
  }
}

@Component({
  selector: 'kitchen-icon-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *kitchenDefinition="let context"
      [kitchenIconDefinition]="context"
      (kitchenOnDevUiChange)="setDevUi($event)"
      [ngSwitch]="true"
    >
      <tri-icon
        #icon
        *ngSwitchCase="!!context.view?.instance.tooltip && !devUiEnabled"
        [kitchenWithVisible]="context.view?.instance.visible"
        [svgIcon]="context.view?.instance.icon || 'eva:star-outline'"
        [kitchenWithIconSize]="context.view?.instance.size"
        [triTooltip]="context.view?.instance.tooltip"
        [kitchenWithMargins]="context.view?.instance.margins"
        [ngClass]="getClass(context.view?.instance)"
        [kitchenWithThemeVariable]="computeThemeVariables(context.view?.instance)"
      ></tri-icon>
      <tri-icon
        #icon
        *ngSwitchDefault
        [kitchenWithVisible]="context.view?.instance.visible"
        [svgIcon]="context.view?.instance.icon || 'eva:star-outline'"
        [kitchenWithIconSize]="context.view?.instance.size"
        [kitchenWithMargins]="context.view?.instance.margins"
        [ngClass]="getClass(context.view?.instance)"
        [kitchenWithThemeVariable]="computeThemeVariables(context.view?.instance)"
      ></tri-icon>
    </ng-container>
  `
})
export class IconDefinitionComponent implements ComponentDefinition<IconDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<IconDefinitionContext>;

  devUiEnabled: boolean;

  setDevUi(enabled: boolean) {
    this.devUiEnabled = enabled;
  }

  getClass(instance): string {
    if (!instance) {
      return;
    }

    const classList = [instance.color];

    return classList.filter((c: string) => !!c).join(' ');
  }

  computeThemeVariables(instance) {
    return (
      instance && {
        '--text-color': textColors[instance.color]
      }
    );
  }
}
