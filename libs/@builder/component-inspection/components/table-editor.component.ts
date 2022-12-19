import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, FormFieldWidthType, nextComponentId, SequenceProperty } from '@common/public-api';
import { PuffActions } from '@tools-state/component-common.model';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-table-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./settings.component.scss', './table-settings.component.scss'],
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

          <tri-accordion-item title="Table structure">

            <ub-number-settings-field
              [value]="settings.properties['rows']?.length"
              [label]="'Rows'"
              [max]="maxRowsNumber"
              [min]="minRowsNumber"
              (valueChange)="updateRows($event)"
            >
            </ub-number-settings-field>

            <pf-checkbox-editor-field
              name="Show borders"
              [showStyleNotification]="false"
              [value]="settings.properties['border']"
              (valueChange)="updateProperty.emit({ border: $event })"
            >
            </pf-checkbox-editor-field>

            <ub-options-settings-field
              optionName="Column"
              addLabel="Add column"
              valueName="title"
              newOptionDefaultValue="New column"
              [options]="settings.properties['columns']"
              [customControls]="[{ tmpRef: customWidthBlock, field: 'width' }]"
              (createOption)="createColumn($event)"
              (removeOption)="removeColumn($event)"
            >
            </ub-options-settings-field>

            <ng-template #customWidthBlock let-index="index" let-width="width">
              <ub-form-field-width-settings-field
                [showStyleNotification]="false"
                [value]="width"
                [typeOptions]="widthOptions"
                (valueChange)="updateWidth(index, $event)"
              >
              </ub-form-field-width-settings-field>
            </ng-template>

          </tri-accordion-item>

          <tri-accordion-item title="Appearance">

            <ub-background-settings-field
              [value]="settings.styles['background']"
              [backgroundOptions]="backgroundOptions"
              [noImage]="true"
              (valueChange)="updateStyleAtActiveBreakpoint.emit({ background: $event })"
            >
            </ub-background-settings-field>

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
export class TableEditorComponent implements SettingsView {
  private _settings: ComponentSettings;

  @Input()
  get settings(): ComponentSettings {
    return this._settings;
  }

  set settings(settings: ComponentSettings) {
    this._settings = settings;
    ɵmarkDirty(this);
  }

  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  @Output() updateProperty                = new EventEmitter();
  @Output() updateActions                 = new EventEmitter();

  maxRowsNumber = 50;
  minRowsNumber = 0;

  widthOptions = [
    { label: 'Auto', value: FormFieldWidthType.AUTO },
    { label: 'Custom', value: FormFieldWidthType.CUSTOM }
  ];

  backgroundOptions = [
    { label: 'transparent', value: 'transparent' },
    { label: 'alternate', value: 'alternate' },
    { label: 'disabled', value: 'disabled' },
    { label: 'hint', value: 'hint' },
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
    { label: 'info', value: 'info' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' }
  ];

  constructor() {
  }

  updateWidth(index: number, value: any) {
    this.updateProperty.emit({
      columns: this.settings.properties.columns.map((col, i) => (i === index ? { ...col, width: value } : col))
    });
  }

  createColumn({ value }: { value: string }) {
    const newRows = [];
    // Collect new rows with added cells
    this.settings.properties.rows.map(row => {
      const cells  = [...row.cells, this.getNewCell()];
      const newRow = { id: row.id, cells: cells };
      newRows.push(newRow);
    });

    this.updateProperty.emit({
      columns: [
        ...this.settings.properties.columns,
        {
          id   : `header.${nextComponentId()}`,
          title: value,
          width: {
            type       : FormFieldWidthType.AUTO,
            customValue: 220,
            customUnit : 'px'
          }
        }
      ],
      rows   : newRows
    });
  }

  removeColumn(index: number) {
    const newRows = [];
    // Collect new rows with removed cells
    this.settings.properties.rows.map(row => {
      const cells = [...row.cells];
      cells.splice(index, 1);
      const newRow = { id: row.id, cells: cells };
      newRows.push(newRow);
    });

    this.updateProperty.emit({
      columns: this.settings.properties.columns.filter((col, i) => i !== index),
      rows   : newRows
    });
  }

  updateRows(amount: number) {
    const currentRows = this.settings.properties.rows;
    const newRows     = [...currentRows];

    if (currentRows.length === amount || amount > this.maxRowsNumber) {
      return;
    } else if (currentRows.length > amount) {
      // Remove extra rows
      const index = currentRows.length - amount;
      newRows.splice(-index, index);
    } else {
      // Add new rows
      const newRowsAmount = amount - currentRows.length;
      for (let i = 0; i < newRowsAmount; i++) {
        newRows.push(this.getNewRow(this.settings.properties.columns));
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

  private getNewRow(columns) {
    return {
      id   : `row.${nextComponentId()}`,
      cells: columns.map(() => this.getNewCell())
    };
  }

  private getNewCell() {
    return { id: `cell.${nextComponentId()}` };
  }

  updateConditionCode(conditionCode: string): void {
    this.updateProperty.next({ [ComponentLogicPropName.CONDITION_PROPERTY]: conditionCode });
  }

  updateSequence(sequence: SequenceProperty): void {
    this.updateProperty.next({ [ComponentLogicPropName.SEQUENCE_PROPERTY]: sequence });
  }

  private updateContainerStatus(nextActions: PuffActions) {
    const initActions = nextActions['init'];
    if (initActions?.length) {
      this.updateProperty.emit({ container: true });
    }
  }
}
