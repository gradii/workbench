import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName } from '@common';

import { BakeryComponent } from '@tools-state/component/component.model';

@Component({
  selector: 'ub-if-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../field.scss'],
  template: `
    <div class="data-source-container">
      <label class="data-source-main-label">
        <nb-icon class="data-consumer" icon="database" pack="bakery"></nb-icon>
        Show Condition
      </label>
    </div>
    <label class="data-source-sub-label">
      Return <span class="code-highlight">false</span> to hide your element based on a condition.
    </label>
    <ub-data-field
      (valueChange)="valueChange.emit($event)"
      [component]="component"
      [value]="conditionCode"
      [allowPages]="true"
      [allowActiveRoute]="true"
      [resizable]="true"
      [noLabel]="true"
    >
    </ub-data-field>
  `
})
export class IfSettingFieldComponent {
  @Input() component: BakeryComponent;
  @Output() valueChange = new EventEmitter<string>();

  get conditionCode(): string {
    return this.component.properties[ComponentLogicPropName.CONDITION_PROPERTY];
  }
}
