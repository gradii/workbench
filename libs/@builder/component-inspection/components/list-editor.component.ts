import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, nextComponentId, SequenceProperty } from '@common/public-api';
import { PuffActions } from '@tools-state/component-common.model';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-list-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./settings.component.scss'],
  template       : `
    <tri-tab-group class="icon-tabs" fullWidth pfTabsController>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="fill:setting"></tri-icon>
        <pf-component-type-field [component]="settings.component"></pf-component-type-field>

        <tri-accordion pfAccordionController>
          <tri-accordion-item title="Visibility">

            <pf-checkbox-editor-field
              name="Visible"
              [value]="settings.styles['visible']"
              (valueChange)="updateStyleAtActiveBreakpoint.emit({ visible: $event })"
            >
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

          <tri-accordion-item title="Structure">

            <ub-number-settings-field
              [value]="settings.properties['rows']?.length"
              [label]="'Rows'"
              [max]="maxRowsNumber"
              [min]="minRowsNumber"
              [trim]="true"
              (valueChange)="updateRows($event)"
            >
            </ub-number-settings-field>

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
export class ListEditorComponent implements SettingsView {
  maxRowsNumber = 50;
  minRowsNumber = 1;

  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  @Output() updateProperty                = new EventEmitter();
  @Output() updateActions                 = new EventEmitter();

  constructor() {
  }

  private _settings: ComponentSettings;

  get settings(): ComponentSettings {
    return this._settings;
  }

  @Input()
  set settings(settings: ComponentSettings) {
    this._settings = settings;
    ɵmarkDirty(this);
  }

  updateRows(amount: number): { id: string }[] {
    const currentRows = this.settings.properties.rows;
    const newRows     = [...currentRows];

    if (currentRows.length === amount || amount > this.maxRowsNumber || amount < this.minRowsNumber) {
      return;
    } else if (currentRows.length > amount) {
      // Remove extra rows
      const index = currentRows.length - amount;
      newRows.splice(-index, index);
    } else {
      // Add new rows
      const newRowsAmount = amount - currentRows.length;
      for (let i = 0; i < newRowsAmount; i++) {
        newRows.push(this.getNewRow());
      }
    }

    this.updateProperty.emit({
      rows: newRows
    });
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

  private getNewRow(): { id: string } {
    return {
      id: `row.${nextComponentId()}`
    };
  }

  private updateContainerStatus(nextActions: PuffActions) {
    const initActions = nextActions['init'];
    if (initActions?.length) {
      this.updateProperty.emit({ container: true });
    }
  }

  updateConditionCode(conditionCode: string): void {
    this.updateProperty.next({ [ComponentLogicPropName.CONDITION_PROPERTY]: conditionCode });
  }

  updateSequence(sequence: SequenceProperty): void {
    this.updateProperty.next({ [ComponentLogicPropName.SEQUENCE_PROPERTY]: sequence });
  }
}
