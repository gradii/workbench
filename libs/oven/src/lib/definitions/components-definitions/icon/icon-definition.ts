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
import { NbIconComponent } from '@nebular/theme';
import { BehaviorSubject } from 'rxjs';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { textColors } from '../../definition-utils/with-theme-variable.directive';

interface IconDefinitionContext extends DefinitionContext<NbIconComponent> {
}

@Directive({ selector: '[ovenIconDefinition]' })
export class IconDefinitionDirective {
  @Output() ovenOnDevUiChange: EventEmitter<boolean> = new EventEmitter();
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

  @Input('ovenIconDefinition') set context(context: IconDefinitionContext) {
    this._context = context;
    const this_ = this;

    context.devUIEnabled$.subscribe(enabled => this.ovenOnDevUiChange.emit(enabled));

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
  selector: 'oven-icon-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *ovenDefinition="let context"
      [ovenIconDefinition]="context"
      (ovenOnDevUiChange)="setDevUi($event)"
      [ngSwitch]="true"
    >
      <nb-icon
        #icon
        *ngSwitchCase="!!context.view?.instance.tooltip && !devUiEnabled"
        [ovenWithVisible]="context.view?.instance.visible"
        [icon]="context.view?.instance.icon || 'star-outline'"
        [ovenWithIconSize]="context.view?.instance.size"
        [nbTooltip]="context.view?.instance.tooltip"
        [ovenWithMargins]="context.view?.instance.margins"
        [ngClass]="getClass(context.view?.instance)"
        [ovenWithThemeVariable]="computeThemeVariables(context.view?.instance)"
      ></nb-icon>
      <nb-icon
        #icon
        *ngSwitchDefault
        [ovenWithVisible]="context.view?.instance.visible"
        [icon]="context.view?.instance.icon || 'star-outline'"
        [ovenWithIconSize]="context.view?.instance.size"
        [ovenWithMargins]="context.view?.instance.margins"
        [ngClass]="getClass(context.view?.instance)"
        [ovenWithThemeVariable]="computeThemeVariables(context.view?.instance)"
      ></nb-icon>
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
