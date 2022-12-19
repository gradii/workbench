import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ɵmarkDirty } from '@angular/core';
import { ComponentLogicPropName, SequenceProperty } from '@common/public-api';

import { ComponentSettings, SettingsView } from '../settings-view';

const hintTypeColors = ['label', 'caption', 'caption-2'];

@Component({
  selector       : 'pf-text-editor',
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

          <tri-accordion-item title="Appearance">
            <ub-data-field
              syntax="text"
              [component]="settings.component"
              [resizable]="true"
              [value]="settings.properties['text']"
              (valueChange)="updateProperty.emit({ text: $event })"
            >
            </ub-data-field>
            <ub-dropdown-settings-field
              name="Type"
              [showStyleNotification]="false"
              [selected]="settings.properties['type']"
              [options]="typeOptions"
              (selectedChange)="updateType($event)"
            >
            </ub-dropdown-settings-field>

            <ub-text-style-group
              [alignment]="settings.properties['alignment']"
              [transform]="settings.properties['transform']"
              [decoration]="settings.properties['decoration']"
              [properties]="settings.properties"
              (propertiesChange)="updateProperty.emit($event)"
            >
            </ub-text-style-group>
            <pf-color-editor-field
              name="Color"
              [selected]="settings.styles['color']"
              [options]="colorOptions"
              (selectedChange)="updateStyleAtActiveBreakpoint.emit({ color: $event })"
            >
            </pf-color-editor-field>
          </tri-accordion-item>
        </tri-accordion>
      </tri-tab>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="reiki:workflow"></tri-icon>
        <ub-component-name-settings-field [settings]="settings" (nameSettingsChange)="updateProperty.emit($event)">
        </ub-component-name-settings-field>
        <tri-accordion pfAccordionController>
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
export class TextEditorComponent implements SettingsView {
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

  private _settings: ComponentSettings;

  colorOptions = [
    { label: 'basic', value: 'basic' },
    { label: 'alternate', value: 'alternate' },
    { label: 'disabled', value: 'disabled' },
    { label: 'hint', value: 'hint' },
    { label: 'white', value: 'white' },
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
    { label: 'info', value: 'info' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' }
  ];

  typeOptions = [
    { label: 'subtitle', value: 'subtitle' },
    { label: 'subtitle-2', value: 'subtitle-2' },
    { label: 'paragraph', value: 'paragraph' },
    { label: 'paragraph-2', value: 'paragraph-2' },
    { label: 'caption', value: 'caption' },
    { label: 'caption-2', value: 'caption-2' },
    { label: 'label', value: 'label' }
  ];

  constructor() {
  }

  updateType(type: string) {
    this.updateProperty.emit({ type });
    this.updateStyleAtActiveBreakpoint.emit({ color: hintTypeColors.includes(type) ? 'hint' : 'basic' });
  }

  updateConditionCode(conditionCode: string): void {
    this.updateProperty.next({ [ComponentLogicPropName.CONDITION_PROPERTY]: conditionCode });
  }

  updateSequence(sequence: SequenceProperty): void {
    this.updateProperty.next({ [ComponentLogicPropName.SEQUENCE_PROPERTY]: sequence });
  }
}