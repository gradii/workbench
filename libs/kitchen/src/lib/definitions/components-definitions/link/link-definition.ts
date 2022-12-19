import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { TextDirective } from '../../definition-utils/text/text.directive';
import { textColors } from '../../definition-utils/with-theme-variable.directive';

type LinkDefinitionContext = DefinitionContext<null>;

@Directive({ selector: '[kitchenLinkDefinition]' })
export class LinkDefinitionDirective implements OnInit {
  private textChange: Subject<any> = new Subject<any>();

  @Input('kitchenLinkDefinition') set context(context: LinkDefinitionContext) {
    context.view = {
      instance: {} as any,
      slots: null,
      element: this.element,
      properties$: this.textChange.asObservable(),
      draggable$: this.kitchenText.editMode$.pipe(map(editMode => !editMode)),
      editable$: this.kitchenText.editMode$
    };
  }

  constructor(public kitchenText: TextDirective, public element: ElementRef) {
  }

  ngOnInit() {
    this.kitchenText.textChange$.subscribe((text: string) => this.textChange.next({ text }));
  }
}

@Component({
  selector: 'kitchen-link-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      *kitchenDefinition="let context"
      draggable="false"
      kitchenText
      [ngModel]="context.view?.instance.text"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithTextStyles]="context.view?.instance"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithNavigation]="context.view?.instance.url"
      [navigationDisabled]="context.devUIEnabled$"
      [kitchenWithThemeVariable]="computeThemeVariables(context.view?.instance)"
      [kitchenLinkDefinition]="context"
    ></a>
  `
})
export class LinkDefinitionComponent implements ComponentDefinition<LinkDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<LinkDefinitionContext>;

  computeThemeVariables(instance) {
    return (
      instance && {
        '--link-text-color': textColors[instance.color]
      }
    );
  }
}
