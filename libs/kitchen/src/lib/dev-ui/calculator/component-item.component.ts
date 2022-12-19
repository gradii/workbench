import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MetaDefinition } from '../../definitions/definition';

@Component({
  selector: 'kitchen-component-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./component-item.component.scss'],
  template: `
    <tri-icon class="component-icon" [svgIcon]="definition.icon"></tri-icon>
    <span class="component-name">{{ definition.name }}</span>
    <tri-icon
      *ngIf="definition.definition.dataConsumer || definition.definition.dataTrigger"
      title="This component can be connected to App State"
      class="data-consumer"
      svgIcon="workbench:calculator-data-action"
    >
    </tri-icon>
  `
})
export class ComponentItemComponent {
  @Input() definition: MetaDefinition;
}
