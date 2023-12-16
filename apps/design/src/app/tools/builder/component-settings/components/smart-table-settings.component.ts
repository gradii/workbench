import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { getUniqueName, ComponentLogicPropName, SequenceProperty } from '@common';

import { SmartTableOption } from '../fields/table-options-settings-field.component';
import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector: 'ub-table-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./settings.component.scss'],
  template: `
    <nb-tabset class="icon-tabs" fullWidth ubTabsController>
      <nb-tab tabIcon="settings">
        <ub-component-type-field [component]="settings.component"></ub-component-type-field>

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
            <nb-accordion-item-header>Actions</nb-accordion-item-header>
            <nb-accordion-item-body class="row">
              <div class="column">
                <ub-checkbox-settings-field
                  name="Add action"
                  [showStyleNotification]="false"
                  [value]="actionAdd"
                  (valueChange)="onActionChange('add', $event)"
                >
                </ub-checkbox-settings-field>
                <ub-checkbox-settings-field
                  name="Delete action"
                  [showStyleNotification]="false"
                  [value]="actionDelete"
                  (valueChange)="onActionChange('delete', $event)"
                >
                </ub-checkbox-settings-field>
              </div>
              <div class="column">
                <ub-checkbox-settings-field
                  name="Edit action"
                  [showStyleNotification]="false"
                  [value]="actionEdit"
                  (valueChange)="onActionChange('edit', $event)"
                >
                </ub-checkbox-settings-field>
                <ub-checkbox-settings-field
                  name="Show filter"
                  [showStyleNotification]="false"
                  [value]="showFilter"
                  (valueChange)="onToggleFilter($event)"
                >
                </ub-checkbox-settings-field>
              </div>
            </nb-accordion-item-body>
          </nb-accordion-item>
          <nb-accordion-item expanded>
            <nb-accordion-item-header>Content</nb-accordion-item-header>
            <nb-accordion-item-body>
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
        <ub-component-name-settings-field [settings]="settings" (nameSettingsChange)="updateProperty.emit($event)">
        </ub-component-name-settings-field>

        <nb-accordion multi>
          <nb-accordion-item expanded>
            <nb-accordion-item-header>Actions</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-actions-list-settings-field
                [actions]="settings.actions"
                [component]="settings.component"
                (actionsChange)="updateActions.emit($event)"
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
export class SmartTableSettingsComponent implements SettingsView {
  @Input()
  set settings(settings: ComponentSettings) {
    this._settings = settings;
    this.cd.markForCheck();
  }

  get settings(): ComponentSettings {
    return this._settings;
  }

  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  @Output() updateProperty = new EventEmitter();
  @Output() updateActions = new EventEmitter();

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

  constructor(private cd: ChangeDetectorRef) {
  }

  onActionChange(actionName: string, value: boolean) {
    const newActions = { ...this.smartTableSettings.actions, [actionName]: value };
    this.updateProperty.emit({ settings: { ...this.smartTableSettings, actions: newActions } });
  }

  onToggleFilter(showFilter: boolean) {
    const columns = this.smartTableSettings.columns;
    const newColumns = this.columnsIds.reduce((result, columnId, i) => {
      result[columnId] = { ...columns[columnId], filter: showFilter };
      return result;
    }, {});
    this.updateProperty.emit({ settings: { ...this.smartTableSettings, columns: newColumns } });
  }

  createOption() {
    const takenNames = Object.values(this.smartTableSettings.columns).map((column: { title: string }) => column.title);
    const id = getUniqueName(this.columnsIds, 'newColumn');
    const name = getUniqueName(takenNames, 'New Column');
    const newColumns = { ...this.smartTableSettings.columns, [id]: { title: name } };
    this.updateProperty.emit({ settings: { ...this.smartTableSettings, columns: newColumns } });
  }

  updateId({ id, value }: { id: string; value: string }) {
    const columns = this.smartTableSettings.columns;

    const newColumns = this.columnsIds.reduce((result, columnId, i) => {
      const newId = columnId === id ? value : columnId;
      result[newId] = columns[columnId];
      return result;
    }, {});

    this.updateProperty.emit({ settings: { ...this.smartTableSettings, columns: newColumns } });
  }

  updateTitle({ id, value }: { id: string; value: string }) {
    const columns = this.smartTableSettings.columns;
    const newColumns = this.columnsIds.reduce((result, columnId, i) => {
      const column = columns[columnId];
      result[columnId] = columnId === id ? { ...column, title: value } : column;
      return result;
    }, {});
    this.updateProperty.emit({ settings: { ...this.smartTableSettings, columns: newColumns } });
  }

  removeOption(id: string) {
    const columns = this.smartTableSettings.columns;
    const newColumns = this.columnsIds.reduce((result, columnId) => {
      if (columnId !== id) {
        result[columnId] = columns[columnId];
      }
      return result;
    }, {});
    this.updateProperty.emit({ settings: { ...this.smartTableSettings, columns: newColumns } });
  }

  updateFilter({ id, value }: { id: string; value: string }) {
    const columns = this.smartTableSettings.columns;
    const newColumns = this.columnsIds.reduce((result, columnId, i) => {
      const column = columns[columnId];
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
          type: FilterType.LIST.value,
          config: {
            selectText: 'Select ...',
            list: []
          }
        };
      default:
        return {};
    }
  }
}

export class FilterType {
  static readonly LIST = new FilterType('List', 'list');
  static readonly INPUT = new FilterType('Input', 'input');

  private constructor(public readonly label: string, public readonly value: string) {
  }
}
