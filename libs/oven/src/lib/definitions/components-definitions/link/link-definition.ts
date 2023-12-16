import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { TextDirective } from '../../definition-utils/text/text.directive';
import { textColors } from '../../definition-utils/with-theme-variable.directive';

type LinkDefinitionContext = DefinitionContext<null>;

@Directive({ selector: '[ovenLinkDefinition]' })
export class LinkDefinitionDirective implements OnInit {
  private textChange: Subject<any> = new Subject<any>();

  @Input('ovenLinkDefinition') set context(context: LinkDefinitionContext) {
    context.view = {
      instance: {} as any,
      slots: null,
      element: this.element,
      properties$: this.textChange.asObservable(),
      draggable$: this.ovenText.editMode$.pipe(map(editMode => !editMode)),
      editable$: this.ovenText.editMode$
    };
  }

  constructor(public ovenText: TextDirective, public element: ElementRef) {
  }

  ngOnInit() {
    this.ovenText.textChange$.subscribe((text: string) => this.textChange.next({ text }));
  }
}

@Component({
  selector: 'oven-link-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      *ovenDefinition="let context"
      draggable="false"
      ovenText
      [ngModel]="context.view?.instance.text"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithTextStyles]="context.view?.instance"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithNavigation]="context.view?.instance.url"
      [navigationDisabled]="context.devUIEnabled$"
      [ovenWithThemeVariable]="computeThemeVariables(context.view?.instance)"
      [ovenLinkDefinition]="context"
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
