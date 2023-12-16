import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NbStepperOrientation } from '@nebular/theme';
import { SlotDirection, nextComponentId, ComponentLogicPropName, SequenceProperty } from '@common';

import { ComponentSettings, SettingsView } from '../settings-view';
import { BakeryActions } from '@tools-state/component/component.model';

@Component({
  selector: 'ub-stepper-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./settings.component.scss'],
  template: `
    <nb-tabset class="icon-tabs" fullWidth ubTabsController>
      <nb-tab tabIcon="settings">
        <ub-component-type-field [component]="settings.component"></ub-component-type-field>

        <ub-space-direction-field [value]="getDirection()" (valueChange)="updateOrientation($event)">
        </ub-space-direction-field>
        <ub-space-justify-field
          *ngIf="isHorizontal; else verticalSettings"
          [value]="this.settings.styles['justify']"
          direction="row"
          (valueChange)="this.updateStyleAtActiveBreakpoint.emit({ justify: $event })"
          [hiddenOptions]="hiddenJustifyOptions"
        >
        </ub-space-justify-field>
        <ng-template #verticalSettings>
          <ub-space-align-field
            [value]="this.settings.styles['justify']"
            direction="column"
            (valueChange)="this.updateStyleAtActiveBreakpoint.emit({ justify: $event })"
            [hiddenOptions]="hiddenJustifyOptions"
          >
          </ub-space-align-field>
        </ng-template>

        <nb-accordion multi>
          <nb-accordion-item expanded>
            <nb-accordion-item-header>Visibility</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-checkbox-settings-field
                name="Visible"
                [value]="settings.styles['visible']"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ visible: $event })"
              >
              </ub-checkbox-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>Navigation</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-checkbox-settings-field
                name="Linear mode"
                nbTooltip="When linear mode enabled user can't move forward unless current step is complete."
                [nbTooltipIcon]="{ icon: 'info', status: 'info' }"
                nbTooltipPlacement="left"
                nbTooltipAdjustment="noop"
                [value]="settings.properties['disableStepNavigation']"
                [showStyleNotification]="false"
                (valueChange)="updateProperty.emit({ disableStepNavigation: $event })"
                >>
              </ub-checkbox-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>
              <ub-setting-label-container>Spacing</ub-setting-label-container>
            </nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-margin-padding
                [margin]="settings.styles['margins']"
                (marginChange)="updateStyleAtActiveBreakpoint.emit({ margins: $event })"
                [paddingDisabled]="true"
              >
              </ub-margin-padding>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>Add Option</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-options-settings-field
                optionName="Step"
                newOptionDefaultValue="New step"
                [options]="settings.properties['options']"
                (createOption)="createOption($event)"
                (removeOption)="removeOption($event)"
                (updateOption)="updateOption($event)"
              >
              </ub-options-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>Appearance</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-text-settings-field
                [value]="settings.properties['prevText']"
                label="Prev Button Text"
                placeholder="Prev"
                (valueChange)="updateProperty.emit({ prevText: $event })"
              >
              </ub-text-settings-field>
              <ub-text-settings-field
                [value]="settings.properties['nextText']"
                label="Next Button Text"
                placeholder="Next"
                (valueChange)="updateProperty.emit({ nextText: $event })"
              >
              </ub-text-settings-field>
              <ub-text-settings-field
                [value]="settings.properties['completeText']"
                label="Complete Button Text"
                placeholder="Complete"
                (valueChange)="updateProperty.emit({ completeText: $event })"
              >
              </ub-text-settings-field>

              <ub-checkbox-settings-field
                name="Show Complete Button"
                [value]="settings.properties['showComplete']"
                (valueChange)="updateProperty.emit({ showComplete: $event })"
              >
              </ub-checkbox-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>
              <ub-setting-label-container>Size</ub-setting-label-container>
            </nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-size-settings-field
                [value]="settings.styles['size']"
                [withAuto]="true"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
              >
              </ub-size-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>
        </nb-accordion>
      </nb-tab>
      <nb-tab [tabIcon]="{ icon: 'workflow-data', pack: 'bakery' }">
        <ub-component-name-settings-field [settings]="settings" (nameSettingsChange)="onNameSettingsChange($event)">
        </ub-component-name-settings-field>
        <nb-accordion multi>
          <nb-accordion-item expanded>
            <nb-accordion-item-header>Actions</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-actions-list-settings-field
                [actions]="settings.actions"
                [component]="settings.component"
                (actionsChange)="onActionsChange($event)"
              >
              </ub-actions-list-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>Sequence</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-for-settings-field [component]="settings.component" (valueChange)="updateSequence($event)">
              </ub-for-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>DATA CONDITION</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-if-settings-field [component]="settings.component" (valueChange)="updateConditionCode($event)">
              </ub-if-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>
        </nb-accordion>
      </nb-tab>
    </nb-tabset>
  `
})
export class StepperSettingsComponent implements SettingsView {
  hiddenJustifyOptions = ['space-around'];

  @Input()
  set settings(settings: ComponentSettings) {
    this._settings = settings;
    this.cd.markForCheck();
  }

  get settings(): ComponentSettings {
    return this._settings;
  }

  get isHorizontal(): boolean {
    return this.settings.styles['orientation'] === 'horizontal';
  }

  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  @Output() updateProperty = new EventEmitter();
  @Output() updateActions = new EventEmitter();

  private _settings: ComponentSettings;

  constructor(private cd: ChangeDetectorRef) {
  }

  getDirection(): SlotDirection {
    if (this.isHorizontal) {
      return 'row';
    } else {
      return 'column';
    }
  }

  updateOrientation(direction): void {
    let orientation: NbStepperOrientation;
    if (direction === 'row') {
      orientation = 'horizontal';
    } else {
      orientation = 'vertical';
    }
    this.updateStyleAtActiveBreakpoint.emit({ orientation });
  }

  createOption({ value }: { value: string }) {
    this.updateProperty.emit({ options: [...this.settings.properties.options, { value, id: nextComponentId() }] });
  }

  updateOption({ index, value }: { index: number; value: string }) {
    this.updateProperty.emit({
      options: this.settings.properties.options.map((el, i) => (i === index ? { ...el, value } : el))
    });
  }

  removeOption(index: number) {
    this.updateProperty.emit({ options: this.settings.properties.options.filter((e, i) => i !== index) });
  }

  updateConditionCode(conditionCode: string): void {
    this.updateProperty.next({ [ComponentLogicPropName.CONDITION_PROPERTY]: conditionCode });
  }

  updateSequence(sequence: SequenceProperty): void {
    this.updateProperty.next({ [ComponentLogicPropName.SEQUENCE_PROPERTY]: sequence });
  }

  onNameSettingsChange(nextNameSettings) {
    this.updateProperty.emit(nextNameSettings);
    if (!nextNameSettings.container) {
      this.clearActions();
    }
  }

  onActionsChange(nextActions: BakeryActions) {
    this.updateContainerStatus(nextActions);
    this.updateActions.emit(nextActions);
  }

  clearActions() {
    if (this.settings.actions) {
      const clearedActions = {};
      for (const action of Object.keys(this.settings.actions)) {
        clearedActions[action] = [];
      }
      this.onActionsChange(clearedActions);
    }
  }

  private updateContainerStatus(nextActions: BakeryActions) {
    const initActions = nextActions['init'];
    if (initActions?.length) {
      this.updateProperty.emit({ container: true });
    }
  }
}
