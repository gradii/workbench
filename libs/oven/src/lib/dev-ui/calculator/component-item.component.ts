import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MetaDefinition } from '../../definitions/definition';

@Component({
  selector: 'oven-component-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./component-item.component.scss'],
  template: `
    <bc-icon [name]="definition.icon"></bc-icon>
    <span class="component-name">{{ definition.name }}</span>
    <nb-icon
      *ngIf="definition.definition.dataConsumer || definition.definition.dataTrigger"
      title="This component can be connected to App State"
      class="data-consumer"
      icon="calculator-data-action"
      pack="bakery"
    >
    </nb-icon>
  `
})
export class ComponentItemComponent {
  @Input() definition: MetaDefinition;
}
