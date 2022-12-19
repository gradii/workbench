import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, SequenceProperty } from '@common/public-api';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-icon-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./settings.component.scss'],
  template       : `
    <tri-tab-group class="icon-tabs" type="segment" [disableRipple]="true">
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="fill:setting"></tri-icon>

        <pf-component-type-field [component]="settings.component"></pf-component-type-field>

        <tri-accordion pfAccordionController >
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

          <tri-accordion-item expanded title="Properties">
            <pf-icon-editor-field-action
              [icon]="settings.properties['icon']"
              (iconChange)="updateProperty.emit({ icon: $event })"
            ></pf-icon-editor-field-action>
            <pf-color-editor-field
              name="Color"
              [selected]="settings.styles['color']"
              [options]="colorOptions"
              (selectedChange)="updateStyleAtActiveBreakpoint.emit({ color: $event })"
            >
            </pf-color-editor-field>
            <ub-icon-size-settings-field-action
              [size]="settings.styles['size']"
              (sizeChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
            >
            </ub-icon-size-settings-field-action>
            <pf-text-editor-field
              label="Tooltip"
              [value]="settings.properties['tooltip']"
              [placeholder]="'Icon description'"
              (valueChange)="updateProperty.emit({ tooltip: $event })"
            >
            </pf-text-editor-field>
            <span class="setting-hint">Tooltip is shown in preview only</span>
          </tri-accordion-item>
        </tri-accordion>
      </tri-tab>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="reiki:workflow"></tri-icon>
        <ub-component-name-settings-field
          [settings]="settings" (nameSettingsChange)="updateProperty.emit($event)">
        </ub-component-name-settings-field>

        <tri-accordion pfAccordionController>
          <tri-accordion-item expanded title="Sequence">
            <ub-for-settings-field [component]="settings.component" (valueChange)="updateSequence($event)">
            </ub-for-settings-field>
          </tri-accordion-item>

          <tri-accordion-item expanded title="Data Condition">
            <ub-if-settings-field [component]="settings.component" (valueChange)="updateConditionCode($event)">
            </ub-if-settings-field>
          </tri-accordion-item>
        </tri-accordion>
      </tri-tab>
    </tri-tab-group>
  `
})
export class IconEditorComponent implements SettingsView {
  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  @Output() updateProperty                = new EventEmitter();

  colorOptions = [
    { label: 'basic', value: 'basic' },
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

  private _settings: ComponentSettings;

  get settings(): ComponentSettings {
    return this._settings;
  }

  @Input()
  set settings(settings: ComponentSettings) {
    this._settings = settings;
    ɵmarkDirty(this);
  }

  updateConditionCode(conditionCode: string): void {
    this.updateProperty.next({ [ComponentLogicPropName.CONDITION_PROPERTY]: conditionCode });
  }

  updateSequence(sequence: SequenceProperty): void {
    this.updateProperty.next({ [ComponentLogicPropName.SEQUENCE_PROPERTY]: sequence });
  }
}
