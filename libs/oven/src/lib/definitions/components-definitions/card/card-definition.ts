import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import { NbCardComponent } from '@nebular/theme';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, SlotDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type CardDefinitionContext = DefinitionContext<NbCardComponent>;

@Directive({ selector: '[ovenCardHeaderSlot]' })
export class CardHeaderSlotDirective extends SlotDirective {
}

@Directive({ selector: '[ovenCardBodySlot]' })
export class CardBodySlotDirective extends SlotDirective {
}

@Directive({ selector: '[ovenCardFooterSlot]' })
export class CardFooterSlotDirective extends SlotDirective {
}

@Directive({ selector: '[ovenCardDefinition]' })
export class CardDefinitionDirective {
  @ContentChild(CardHeaderSlotDirective) headerSlot: SlotDirective;
  @ContentChild(CardBodySlotDirective) bodySlot: SlotDirective;
  @ContentChild(CardFooterSlotDirective) footerSlot: SlotDirective;

  @Input('ovenCardDefinition') set view(context: CardDefinitionContext) {
    context.view = {
      instance: this.card,
      slots: {},
      element: this.element,
      updateDynamicSlots: () => {
        const slots = { body: this.bodySlot };
        if (this.headerSlot) {
          slots['header'] = this.headerSlot;
        }
        if (this.footerSlot) {
          slots['footer'] = this.footerSlot;
        }
        context.view.slots = slots;
      }
    };
    this.actionsDirective.listen(() => null);
  }

  constructor(
    public card: NbCardComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector: 'oven-card-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-card
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithBackground]="context.view?.instance.background"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenCardDefinition]="context"
    >
      <nb-card-header
        *ngIf="context.view?.instance.showHeader"
        #headerSlot
        [class.no-padding]="!context.view?.instance.headerPadding"
        ovenCardHeaderSlot
      >
        <ng-template ovenSlotPlaceholder></ng-template>
      </nb-card-header>
      <nb-card-body ovenCardBodySlot [class.no-padding]="!context.view?.instance.bodyPadding" cdkScrollable>
        <ng-template ovenSlotPlaceholder></ng-template>
      </nb-card-body>
      <nb-card-footer
        *ngIf="context.view?.instance.showFooter"
        #footerSlot
        [class.no-padding]="!context.view?.instance.footerPadding"
        ovenCardFooterSlot
      >
        <ng-template ovenSlotPlaceholder></ng-template>
      </nb-card-footer>
    </nb-card>
  `
})
export class CardDefinitionComponent implements ComponentDefinition<CardDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<CardDefinitionContext>;
}
