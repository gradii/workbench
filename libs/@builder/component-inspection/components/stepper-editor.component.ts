import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, nextComponentId, SequenceProperty, SlotDirection } from '@common/public-api';
import { Direction } from '@gradii/triangle/steps';
import { PuffActions } from '@tools-state/component-common.model';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-stepper-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./settings.component.scss'],
  template       : `
    <tri-tab-group class="icon-tabs" fullWidth pfTabsController>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="fill:setting"></tri-icon>
        <pf-component-type-field [component]="settings.component"></pf-component-type-field>

        <pf-space-direction-field [value]="getDirection()" (valueChange)="updateOrientation($event)">
        </pf-space-direction-field>
        <pf-space-horizontal-field
          *ngIf="isHorizontal; else verticalSettings"
          [value]="this.settings.styles['justify']"
          direction="row"
          (valueChange)="this.updateStyleAtActiveBreakpoint.emit({ justify: $event })"
          [hiddenOptions]="hiddenJustifyOptions"
        >
        </pf-space-horizontal-field>
        <ng-template #verticalSettings>
          <pf-space-vertical-field
            [value]="this.settings.styles['justify']"
            direction="column"
            (valueChange)="this.updateStyleAtActiveBreakpoint.emit({ justify: $event })"
            [hiddenOptions]="hiddenJustifyOptions"
          >
          </pf-space-vertical-field>
        </ng-template>

        <tri-accordion pfAccordionController>
          <tri-accordion-item title="Visibility">

            <pf-checkbox-editor-field
              name="Visible"
              [value]="settings.styles['visible']"
              (valueChange)="updateStyleAtActiveBreakpoint.emit({ visible: $event })"
            >
            </pf-checkbox-editor-field>

          </tri-accordion-item>

          <tri-accordion-item title="Navigation">
            <pf-checkbox-editor-field
              name="Linear mode"
              triTooltip="When linear mode enabled user can't move forward unless current step is complete."
              triTooltipPosition="left"
              [value]="settings.properties['disableStepNavigation']"
              [showStyleNotification]="false"
              (valueChange)="updateProperty.emit({ disableStepNavigation: $event })"
            >>
            </pf-checkbox-editor-field>
          </tri-accordion-item>

          <tri-accordion-item>
            <pf-setting-label-container accordion-title>Spacing</pf-setting-label-container>

            <ub-margin-padding
              [margin]="settings.styles['margins']"
              (marginChange)="updateStyleAtActiveBreakpoint.emit({ margins: $event })"
              [paddingDisabled]="true"
            >
            </ub-margin-padding>
          </tri-accordion-item>

          <tri-accordion-item title="Add Option">
            <ub-options-settings-field
              optionName="Step"
              newOptionDefaultValue="New step"
              [options]="settings.properties['options']"
              (createOption)="createOption($event)"
              (removeOption)="removeOption($event)"
              (updateOption)="updateOption($event)"
            >
            </ub-options-settings-field>
          </tri-accordion-item>

          <tri-accordion-item title="Appearance">
            <pf-text-editor-field
              [value]="settings.properties['prevText']"
              label="Prev Button Text"
              placeholder="Prev"
              (valueChange)="updateProperty.emit({ prevText: $event })"
            >
            </pf-text-editor-field>
            <pf-text-editor-field
              [value]="settings.properties['nextText']"
              label="Next Button Text"
              placeholder="Next"
              (valueChange)="updateProperty.emit({ nextText: $event })"
            >
            </pf-text-editor-field>
            <pf-text-editor-field
              [value]="settings.properties['completeText']"
              label="Complete Button Text"
              placeholder="Complete"
              (valueChange)="updateProperty.emit({ completeText: $event })"
            >
            </pf-text-editor-field>

            <pf-checkbox-editor-field
              name="Show Complete Button"
              [value]="settings.properties['showComplete']"
              (valueChange)="updateProperty.emit({ showComplete: $event })"
            >
            </pf-checkbox-editor-field>

          </tri-accordion-item>

          <tri-accordion-item>
            <pf-setting-label-container accordion-title>Size</pf-setting-label-container>

            <ub-size-settings-field
              [value]="settings.styles['size']"
              [withAuto]="true"
              (valueChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
            >
            </ub-size-settings-field>
          </tri-accordion-item>
        </tri-accordion>
      </tri-tab>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="reiki:workflow"></tri-icon>
        <ub-component-name-settings-field [settings]="settings" (nameSettingsChange)="onNameSettingsChange($event)">
        </ub-component-name-settings-field>
        <tri-accordion pfAccordionController>
          <tri-accordion-item title="Actions">

            <ub-actions-list-settings-field
              [actions]="settings.actions"
              [component]="settings.component"
              (actionsChange)="onActionsChange($event)"
            >
            </ub-actions-list-settings-field>

          </tri-accordion-item>

          <tri-accordion-item title="Sequence">

            <ub-for-settings-field [component]="settings.component" (valueChange)="updateSequence($event)">
            </ub-for-settings-field>

          </tri-accordion-item>

          <tri-accordion-item title="DATA CONDITION">

            <ub-if-settings-field [component]="settings.component" (valueChange)="updateConditionCode($event)">
            </ub-if-settings-field>

          </tri-accordion-item>
        </tri-accordion>
      </tri-tab>
    </tri-tab-group>
  `
})
export class StepperEditorComponent implements SettingsView {
  hiddenJustifyOptions = ['space-around'];

  @Input()
  set settings(settings: ComponentSettings) {
    this._settings = settings;
    ɵmarkDirty(this);
  }

  get settings(): ComponentSettings {
    return this._settings;
  }

  get isHorizontal(): boolean {
    return this.settings.styles['orientation'] === 'horizontal';
  }

  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  @Output() updateProperty                = new EventEmitter();
  @Output() updateActions                 = new EventEmitter();

  private _settings: ComponentSettings;

  constructor() {
  }

  getDirection(): SlotDirection {
    if (this.isHorizontal) {
      return 'row';
    } else {
      return 'column';
    }
  }

  updateOrientation(direction): void {
    let orientation: Direction;
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

  onActionsChange(nextActions: PuffActions) {
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

  private updateContainerStatus(nextActions: PuffActions) {
    const initActions = nextActions['init'];
    if (initActions?.length) {
      this.updateProperty.emit({ container: true });
    }
  }
}
