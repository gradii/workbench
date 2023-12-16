import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { ComponentSettings, SettingsView } from '../settings-view';
import { ComponentLogicPropName, SequenceProperty } from '@common';

@Component({
  selector: 'ub-radio-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./settings.component.scss'],
  template: `
    <nb-tabset class="icon-tabs" fullWidth ubTabsController>
      <nb-tab tabIcon="settings">
        <ub-component-type-field [component]="settings.component"></ub-component-type-field>

        <ub-space-direction-field
          [value]="settings.styles['direction']"
          (valueChange)="updateStyleAtActiveBreakpoint.emit({ direction: $event })"
        >
        </ub-space-direction-field>

        <ub-space-justify-field
          [value]="justify"
          [direction]="settings.styles['direction']"
          (valueChange)="updateHorizontal($event)"
        >
        </ub-space-justify-field>

        <ub-space-align-field
          [value]="align"
          [direction]="settings.styles['direction']"
          (valueChange)="updateVertical($event)"
        >
        </ub-space-align-field>

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
            <nb-accordion-item-header>Size</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-size-settings-field
                [value]="settings.styles['size']"
                [withAuto]="true"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
              >
              </ub-size-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>Overflow</nb-accordion-item-header>
            <nb-accordion-item-body class="with-padding full-width">
              <ub-overflow-settings-field
                class="full-width"
                [valueX]="settings.styles['overflowX']"
                [valueY]="settings.styles['overflowY']"
                (valueXChange)="updateStyleAtActiveBreakpoint.emit({ overflowX: $event })"
                (valueYChange)="updateStyleAtActiveBreakpoint.emit({ overflowY: $event })"
              >
              </ub-overflow-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>Content</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-options-settings-field
                minOptions="2"
                [options]="settings.properties['options']"
                (createOption)="createOption($event)"
                (removeOption)="removeOption($event)"
                (updateOption)="updateOption($event)"
              ></ub-options-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>Appearance</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-color-settings-field
                [selected]="settings.properties['status']"
                [options]="statusOptions"
                [showStyleNotification]="false"
                (selectedChange)="updateProperty.emit({ status: $event })"
              ></ub-color-settings-field>
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
export class RadioSettingsComponent implements SettingsView {
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

  statusOptions = [
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
    { label: 'info', value: 'info' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' },
    { label: 'basic', value: 'basic' },
    { label: 'control', value: 'control' }
  ];

  private _settings: ComponentSettings;

  constructor(private cd: ChangeDetectorRef) {
  }

  createOption({ value }: { value: string }) {
    this.updateProperty.emit({ options: [...this.settings.properties.options, { value }] });
  }

  updateOption({ index, value }: { index: number; value: string }) {
    this.updateProperty.emit({
      options: this.settings.properties.options.map((el, i) => (i === index ? { value } : el))
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

  get justify() {
    if (this.settings.styles['direction'] === 'row') {
      return this.settings.styles['justify'];
    } else {
      return this.settings.styles['align'];
    }
  }

  get align() {
    if (this.settings.styles['direction'] === 'column') {
      return this.settings.styles['justify'];
    } else {
      return this.settings.styles['align'];
    }
  }

  updateHorizontal(event) {
    if (this.settings.styles['direction'] === 'row') {
      this.updateStyleAtActiveBreakpoint.emit({ justify: event });
    } else {
      this.updateStyleAtActiveBreakpoint.emit({ align: event });
    }
  }

  updateVertical(event) {
    if (this.settings.styles['direction'] === 'column') {
      this.updateStyleAtActiveBreakpoint.emit({ justify: event });
    } else {
      this.updateStyleAtActiveBreakpoint.emit({ align: event });
    }
  }
}
