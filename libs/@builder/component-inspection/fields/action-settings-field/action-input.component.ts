import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TriggeredAction } from '@common/public-api';

import { PuffComponent } from '@tools-state/component/component.model';

@Component({
  selector       : 'ub-action-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['../field.scss', './action-input.component.scss'],
  template       : `
    <div class="heading-container">
      <label class="settings-field-label inner-field">{{ triggerLabels[triggerName] }}</label>

      <button
        *ngIf="actionParamAvailable"
        triTooltip="Action Arguments"
        triButton
        ghost
        class="action-param-toggle"
        [class.action-param-enabled]="actionParamEnabled"
        (click)="toggleActionParam()"
      >
        <tri-icon svgIcon="workbench:action-param"></tri-icon>
      </button>
    </div>
    <tri-input-group>
      <tri-select size="small"
                  placeholder="Start typing"
                  style="flex:1"
      >
        <tri-option [customContent]="true"
                    *ngFor="let option of actionOptions"
                    [label]="option.displayValue"
                    [value]="option.id">
          <tri-icon *ngIf="option.icon"
                    [svgIcon]="option.iconPack || 'eva' + ':' +option.icon">
            {{option.displayValue}}
          </tri-icon>
          <span>{{ option.displayValue }}</span>
          <tri-icon
            *ngIf="option.endIcon"
            [triTooltip]="option.endIconTooltip"
            class="end-icon"
            [svgIcon]="option.iconPack+':'+option.endIcon"
          ></tri-icon>
        </tri-option>
      </tri-select>
      <button class="add-new-action-button"
              triButton size="small" (click)="addNewAction.emit()">
        <tri-icon svgIcon="outline:plus"></tri-icon>
      </button>
    </tri-input-group>
    <tri-select
      triInput
      fullWidth
      placeholder="Start typing"
      [ngModel]="actionName"
      [disabled]="disabled"
      (ngModelChange)="updateText($event)"
      (valueChange)="select($event.id, paramCode)"
    >
      <ub-add-new-action-button (click)="addNewAction.emit()"></ub-add-new-action-button>
      <tri-option *ngFor="let it of actionOptions" [value]="it.id">{{it.displayValue}}</tri-option>
    </tri-select>

    <ub-action-param
      *ngIf="showActionParamField"
      [component]="component"
      [paramCode]="paramCode"
      [trigger]="triggerName"
      (valueChange)="select(actionId, $event)"
    >
    </ub-action-param>
  `
})
export class ActionInputComponent implements OnInit {
  @Input() triggerName: string;
  @Input() disabled: boolean;
  @Input() actionParamAvailable: boolean;
  @Input() actionOptions: any[];

  @Input() set component(component: PuffComponent) {
    const trigger = component.actions[this.triggerName];
    const code    = trigger?.length ? trigger[0].paramCode : '';
    if (code) {
      this.paramCode = code;
    }
    this._component = component;
    this.actionId   = trigger?.length ? trigger[0].action : '';

    const componentsWithClickHandler = ['space', 'button'];
    this.actionParamAvailable        =
      this.triggerName === 'click' && componentsWithClickHandler.includes(component.definitionId);
  }

  @Output() actionsChange = new EventEmitter<TriggeredAction>();
  @Output() addNewAction  = new EventEmitter();

  actionId: string;
  paramCode = '';
  // TODO: REFACTORING:
  // this doesn't seem right that we store triggers defined by components in a dummy component that shows them
  triggerLabels      = {
    click              : 'Click',
    init               : 'On Init',
    type               : 'On Type',
    select             : 'On Select',
    change             : 'On Change',
    smartTableCreate   : 'On Create',
    smartTableEdit     : 'On Edit',
    smartTableDelete   : 'On Delete',
    smartTableRowSelect: 'On Row Select',
    stepperPrevStep    : 'On Prev Step',
    stepperNextStep    : 'On Next Step',
    stepperComplete    : 'On Complete',
    tabsChangeTab      : 'On Tab Change'
  };
  actionParamEnabled = false;

  private _component: PuffComponent;

  get showActionParamField() {
    return this.actionParamEnabled && this.actionParamAvailable;
  }

  get component() {
    return this._component;
  }

  ngOnInit(): void {
    if (this.paramCode) {
      this.actionParamEnabled = true;
    }
  }

  get actionName() {
    const option: any = this.actionOptions.find((o: any) => o.id === this.actionId);
    return option ? option.displayValue : '';
  }

  updateText(text: string) {
    const option: any = this.actionOptions.find((o: any) => o.displayValue === text);

    if (option) {
      this.select(option.id, this.paramCode);
    }

    if (text.trim() === '') {
      this.actionsChange.emit(null);
    }
  }

  select(action: string, paramCode: string): void {
    this.actionsChange.emit({ action, paramCode });
  }

  toggleActionParam(): void {
    this.actionParamEnabled = !this.actionParamEnabled;
  }
}
