import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, SequenceProperty } from '@common/public-api';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-radio-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./settings.component.scss'],
  template       : `
    <tri-tab-group class="icon-tabs" fullWidth pfTabsController>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="fill:setting"></tri-icon>
        <pf-component-type-field [component]="settings.component"></pf-component-type-field>

        <pf-space-direction-field
          [value]="settings.styles['direction']"
          (valueChange)="updateStyleAtActiveBreakpoint.emit({ direction: $event })"
        >
        </pf-space-direction-field>

        <pf-space-horizontal-field
          [value]="justify"
          [direction]="settings.styles['direction']"
          (valueChange)="updateHorizontal($event)"
        >
        </pf-space-horizontal-field>

        <pf-space-vertical-field
          [value]="align"
          [direction]="settings.styles['direction']"
          (valueChange)="updateVertical($event)"
        >
        </pf-space-vertical-field>

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

          <tri-accordion-item title="Size">
            
              <ub-size-settings-field
                [value]="settings.styles['size']"
                [withAuto]="true"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
              >
              </ub-size-settings-field>
            
          </tri-accordion-item>

          <tri-accordion-item title="Overflow">
            <ub-overflow-settings-field
              class="full-width"
              [valueX]="settings.styles['overflowX']"
              [valueY]="settings.styles['overflowY']"
              (valueXChange)="updateStyleAtActiveBreakpoint.emit({ overflowX: $event })"
              (valueYChange)="updateStyleAtActiveBreakpoint.emit({ overflowY: $event })"
            >
            </ub-overflow-settings-field>
          </tri-accordion-item>

          <tri-accordion-item title="Content">
            <ub-options-settings-field
              minOptions="2"
              [options]="settings.properties['options']"
              (createOption)="createOption($event)"
              (removeOption)="removeOption($event)"
              (updateOption)="updateOption($event)"
            ></ub-options-settings-field>
          </tri-accordion-item>

          <tri-accordion-item title="Appearance">
            <pf-color-editor-field
              [selected]="settings.properties['status']"
              [options]="statusOptions"
              [showStyleNotification]="false"
              (selectedChange)="updateProperty.emit({ status: $event })"
            ></pf-color-editor-field>
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
export class RadioEditorComponent implements SettingsView {
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

  constructor() {
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
