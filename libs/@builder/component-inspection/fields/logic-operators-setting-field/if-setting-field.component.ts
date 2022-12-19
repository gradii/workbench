import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName } from '@common/public-api';

import { PuffComponent } from '@tools-state/component/component.model';

@Component({
  selector: 'ub-if-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../field.scss'],
  template: `
    <div class="data-source-container">
      <label class="data-source-main-label">
        <tri-icon class="data-consumer" svgIcon="workbench:database"></tri-icon>
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
  @Input() component: PuffComponent;
  @Output() valueChange = new EventEmitter<string>();

  get conditionCode(): string {
    return this.component.properties[ComponentLogicPropName.CONDITION_PROPERTY];
  }
}
