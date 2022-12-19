import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PuffComponent } from '@tools-state/component/component.model';

@Component({
  selector: 'ub-action-param',
  template: `
    <div class="data-source-container">
      <label class="data-source-main-label">
        <tri-icon class="data-consumer" svgIcon="workbench:database"></tri-icon>
        Action Arguments
      </label>
    </div>
    <label class="data-source-sub-label">
      Appears as a <span class="code-highlight">{{ result }}</span> in the first step
    </label>
    <ub-data-field
      syntax="ts"
      [component]="component"
      [noLabel]="true"
      [resizable]="true"
      [value]="paramCode"
      (valueChange)="valueChange.emit($event)"
    >
    </ub-data-field>
  `,
  styleUrls: ['../field.scss', './action-param.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionParamComponent implements OnInit {
  @Input()
  set paramCode(paramCode: string) {
    this._paramCode = paramCode;
  }

  get paramCode(): string {
    return this._paramCode;
  }

  @Input() trigger: string;

  @Input() component: PuffComponent;

  @Output() valueChange = new EventEmitter<string>();

  result = '{{param}}';

  private _paramCode: string;

  ngOnInit() {
    if (!this._paramCode) {
      this._paramCode = `{\n  type: 'new'\n}`;
      this.valueChange.emit(this._paramCode);
    }
  }
}
