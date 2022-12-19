import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, getUniqueName, SequenceProperty } from '@common/public-api';

import { SmartTableOption } from '../fields/table-options-settings-field.component';
import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-table-editor',
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

          <tri-accordion-item title="Actions">
            <div class="column">
              <pf-checkbox-editor-field
                name="Add action"
                [showStyleNotification]="false"
                [value]="actionAdd"
                (valueChange)="onActionChange('add', $event)"
              >
              </pf-checkbox-editor-field>
              <pf-checkbox-editor-field
                name="Delete action"
                [showStyleNotification]="false"
                [value]="actionDelete"
                (valueChange)="onActionChange('delete', $event)"
              >
              </pf-checkbox-editor-field>
            </div>
            <div class="column">
              <pf-checkbox-editor-field
                name="Edit action"
                [showStyleNotification]="false"
                [value]="actionEdit"
                (valueChange)="onActionChange('edit', $event)"
              >
              </pf-checkbox-editor-field>
              <pf-checkbox-editor-field
                name="Show filter"
                [showStyleNotification]="false"
                [value]="showFilter"
                (valueChange)="onToggleFilter($event)"
              >
              </pf-checkbox-editor-field>
            </div>
          </tri-accordion-item>
          <tri-accordion-item title="Content">
            
              <ub-table-options-settings-field
                [options]="options"
                [filterTypes]="filterTypes"
                (createOption)="createOption()"
                (removeOption)="removeOption($event)"
                (updateId)="updateId($event)"
                (updateTitle)="updateTitle($event)"
                (updateFilter)="updateFilter($event)"
              >
              </ub-table-options-settings-field>
              <ub-data-source-settings-field
                componentPropName="source"
                (valueChange)="updateProperty.emit({ source: $event })"
                dataFormatType="Smart Table Data"
                [component]="settings.component"
                [formatExample]="getSmartTableData()"
              >
              </ub-data-source-settings-field>

              <ub-number-settings-field
                [value]="smartTableSettings.pager.perPage"
                label="Items per page"
                [min]="1"
                direction="column"
                (valueChange)="updatePaging($event)"
              >
              </ub-number-settings-field>
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
        <ub-component-name-settings-field [settings]="settings" (nameSettingsChange)="updateProperty.emit($event)">
        </ub-component-name-settings-field>

        <tri-accordion pfAccordionController>
          <tri-accordion-item title="Actions">
            
              <ub-actions-list-settings-field
                [actions]="settings.actions"
                [component]="settings.component"
                (actionsChange)="updateActions.emit($event)"
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
export class SmartTableEditorComponent implements SettingsView {
  @Input()
  set settings(settings: ComponentSettings) {
    this._settings = settings;
    ɵmarkDirty(this);
  }

  get settings(): ComponentSettings {
    return this._settings;
  }

  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  @Output() updateProperty                = new EventEmitter();
  @Output() updateActions                 = new EventEmitter();

  get smartTableSettings() {
    return this.settings.properties.settings;
  }

  get actionAdd() {
    return this.smartTableSettings.actions.add;
  }

  get actionEdit() {
    return this.smartTableSettings.actions.edit;
  }

  get actionDelete() {
    return this.smartTableSettings.actions.delete;
  }

  get columnsIds(): string[] {
    const columns = this.smartTableSettings.columns;
    return Object.keys(columns);
  }

  get options(): SmartTableOption[] {
    const columns = this.smartTableSettings.columns;
    return this.columnsIds.map((columnId: string) => ({
      ...columns[columnId],
      id: columnId
    }));
  }

  get showFilter() {
    return Object.values(this.smartTableSettings.columns).some((column: { filter: boolean }) => column.filter);
  }

  filterTypes: FilterType[] = [FilterType.LIST, FilterType.INPUT];

  private _settings: ComponentSettings;

  constructor() {
  }

  onActionChange(actionName: string, value: boolean) {
    const newActions = { ...this.smartTableSettings.actions, [actionName]: value };
    this.updateProperty.emit({ settings: { ...this.smartTableSettings, actions: newActions } });
  }

  onToggleFilter(showFilter: boolean) {
    const columns    = this.smartTableSettings.columns;
    const newColumns = this.columnsIds.reduce((result, columnId, i) => {
      result[columnId] = { ...columns[columnId], filter: showFilter };
      return result;
    }, {});
    this.updateProperty.emit({ settings: { ...this.smartTableSettings, columns: newColumns } });
  }

  createOption() {
    const takenNames = Object.values(this.smartTableSettings.columns).map((column: { title: string }) => column.title);
    const id         = getUniqueName(this.columnsIds, 'newColumn');
    const name       = getUniqueName(takenNames, 'New Column');
    const newColumns = { ...this.smartTableSettings.columns, [id]: { title: name } };
    this.updateProperty.emit({ settings: { ...this.smartTableSettings, columns: newColumns } });
  }

  updateId({ id, value }: { id: string; value: string }) {
    const columns = this.smartTableSettings.columns;

    const newColumns = this.columnsIds.reduce((result, columnId, i) => {
      const newId   = columnId === id ? value : columnId;
      result[newId] = columns[columnId];
      return result;
    }, {});

    this.updateProperty.emit({ settings: { ...this.smartTableSettings, columns: newColumns } });
  }

  updateTitle({ id, value }: { id: string; value: string }) {
    const columns    = this.smartTableSettings.columns;
    const newColumns = this.columnsIds.reduce((result, columnId, i) => {
      const column     = columns[columnId];
      result[columnId] = columnId === id ? { ...column, title: value } : column;
      return result;
    }, {});
    this.updateProperty.emit({ settings: { ...this.smartTableSettings, columns: newColumns } });
  }

  removeOption(id: string) {
    const columns    = this.smartTableSettings.columns;
    const newColumns = this.columnsIds.reduce((result, columnId) => {
      if (columnId !== id) {
        result[columnId] = columns[columnId];
      }
      return result;
    }, {});
    this.updateProperty.emit({ settings: { ...this.smartTableSettings, columns: newColumns } });
  }

  updateFilter({ id, value }: { id: string; value: string }) {
    const columns    = this.smartTableSettings.columns;
    const newColumns = this.columnsIds.reduce((result, columnId, i) => {
      const column     = columns[columnId];
      result[columnId] = columnId === id ? { ...column, filter: this.prepareFilterType(value) } : column;
      return result;
    }, {});
    this.updateProperty.emit({ settings: { ...this.smartTableSettings, columns: newColumns } });
  }

  getSmartTableData(): any {
    const exampleRow = this.columnsIds.reduce((acc, columnId) => ({ ...acc, [columnId]: 'value' }), {});
    return [exampleRow];
  }

  updateConditionCode(conditionCode: string): void {
    this.updateProperty.emit({ [ComponentLogicPropName.CONDITION_PROPERTY]: conditionCode });
  }

  updateSequence(sequence: SequenceProperty): void {
    this.updateProperty.next({ [ComponentLogicPropName.SEQUENCE_PROPERTY]: sequence });
  }

  updatePaging(perPage: number): void {
    const pager = { perPage };
    this.updateProperty.next({ settings: { ...this.smartTableSettings, pager } });
  }

  private prepareFilterType(type) {
    switch (type) {
      case FilterType.LIST.value:
        return {
          type  : FilterType.LIST.value,
          config: {
            selectText: 'Select ...',
            list      : []
          }
        };
      default:
        return {};
    }
  }
}

export class FilterType {
  static readonly LIST  = new FilterType('List', 'list');
  static readonly INPUT = new FilterType('Input', 'input');

  private constructor(public readonly label: string, public readonly value: string) {
  }
}
