import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BcInputSearchOption, InputSearchDirective, TriggeredAction } from '@common';

import { BakeryComponent } from '@tools-state/component/component.model';

@Component({
  selector: 'ub-action-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../field.scss', './action-input.component.scss'],
  template: `
    <div class="heading-container">
      <label class="settings-field-label inner-field">{{ triggerLabels[triggerName] }}</label>

      <button
        *ngIf="actionParamAvailable"
        nbTooltip="Action Arguments"
        nbButton
        ghost
        class="action-param-toggle"
        [class.action-param-enabled]="actionParamEnabled"
        (click)="toggleActionParam()"
      >
        <nb-icon icon="action-param" pack="bakery"></nb-icon>
      </button>
    </div>
    <input
      nbInput
      fullWidth
      bcInputSearch
      placeholder="Start typing"
      [ngModel]="actionName"
      [searchOptions]="actionOptions"
      [disabled]="disabled"
      [ubOverlayRegister]="searchInstance"
      [topItem]="topItemTemplate"
      (ngModelChange)="updateText($event)"
      (selectValue)="select($event.id, paramCode)"
    />
    <ng-template #topItemTemplate>
      <ub-add-new-action-button (click)="addNewAction.emit()"></ub-add-new-action-button>
    </ng-template>

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
  @Input() actionOptions: BcInputSearchOption[];

  @Input() set component(component: BakeryComponent) {
    const trigger = component.actions[this.triggerName];
    const code = trigger?.length ? trigger[0].paramCode : '';
    if (code) {
      this.paramCode = code;
    }
    this._component = component;
    this.actionId = trigger?.length ? trigger[0].action : '';

    const componentsWithClickHandler = ['space', 'button'];
    this.actionParamAvailable =
      this.triggerName === 'click' && componentsWithClickHandler.includes(component.definitionId);
  }

  @Output() actionsChange = new EventEmitter<TriggeredAction>();
  @Output() addNewAction = new EventEmitter();

  @ViewChild(InputSearchDirective) searchInstance: InputSearchDirective;

  actionId: string;
  paramCode = '';
  // TODO: REFACTORING:
  // this doesn't seem right that we store triggers defined by components in a dummy component that shows them
  triggerLabels = {
    click: 'Click',
    init: 'On Init',
    type: 'On Type',
    select: 'On Select',
    change: 'On Change',
    smartTableCreate: 'On Create',
    smartTableEdit: 'On Edit',
    smartTableDelete: 'On Delete',
    smartTableRowSelect: 'On Row Select',
    stepperPrevStep: 'On Prev Step',
    stepperNextStep: 'On Next Step',
    stepperComplete: 'On Complete',
    tabsChangeTab: 'On Tab Change'
  };
  actionParamEnabled = false;

  private _component: BakeryComponent;

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
    const option: BcInputSearchOption = this.actionOptions.find((o: BcInputSearchOption) => o.id === this.actionId);
    return option ? option.displayValue : '';
  }

  updateText(text: string) {
    const option: BcInputSearchOption = this.actionOptions.find((o: BcInputSearchOption) => o.displayValue === text);

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
