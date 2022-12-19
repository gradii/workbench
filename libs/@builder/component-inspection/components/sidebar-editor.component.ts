import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName } from '@common/public-api';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-header-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./settings.component.scss'],
  template       : `
    <tri-tab-group class="icon-tabs" fullWidth pfTabsController>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="fill:setting"></tri-icon>
        <pf-component-type-field [component]="settings.component"></pf-component-type-field>

        <tri-accordion pfAccordionController>
          <tri-accordion-item>
            <pf-setting-label-container accordion-title>Spacing</pf-setting-label-container>
              <ub-margin-padding
                [padding]="settings.styles['paddings']"
                (paddingChange)="updateStyleAtActiveBreakpoint.emit({ paddings: $event })"
                [marginDisabled]="true"
              >
              </ub-margin-padding>
            
          </tri-accordion-item>

          <tri-accordion-item>
            <pf-setting-label-container accordion-title>Sizing</pf-setting-label-container>
            <ub-size-settings-field
              [value]="settings.styles['size']"
              [withAuto]="false"
              [withoutHeight]="true"
              (valueChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
            >
            </ub-size-settings-field>
          </tri-accordion-item>

          <tri-accordion-item title="Appearance">
            <ub-button-group-settings-field
              name="Position on scroll"
              [showStyleNotification]="false"
              [value]="settings.properties.fixed"
              [options]="typeOptions"
              (valueChange)="updateProperty.emit({ fixed: $event })"
            >
            </ub-button-group-settings-field>

            <pf-checkbox-editor-field
              name="Hide on small screen"
              [showStyleNotification]="false"
              [value]="settings.properties.responsiveValue"
              (valueChange)="updateProperty.emit({ responsiveValue: $event })"
            >
            </pf-checkbox-editor-field>

            <ub-background-settings-field
              [value]="settings.styles['background']"
              [backgroundOptions]="backgroundOptions"
              [noImage]="true"
              (valueChange)="updateStyleAtActiveBreakpoint.emit({ background: $event })"
            >
            </ub-background-settings-field>
          </tri-accordion-item>
        </tri-accordion>
      </tri-tab>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="reiki:workflow"></tri-icon>
        <ub-component-name-settings-field [settings]="settings" (nameSettingsChange)="updateProperty.emit($event)">
        </ub-component-name-settings-field>
        <tri-accordion pfAccordionController>
          <tri-accordion-item title="DATA CONDITION">
            <ub-if-settings-field [component]="settings.component" (valueChange)="updateConditionCode($event)">
            </ub-if-settings-field>
          </tri-accordion-item>
        </tri-accordion>
      </tri-tab>
    </tri-tab-group>
  `
})
export class SidebarEditorComponent implements SettingsView {
  @Output() updateProperty                = new EventEmitter();
  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  typeOptions                             = [
    { label: 'Static', value: false },
    { label: 'Sticky', value: true }
  ];
  backgroundOptions                       = [
    { label: 'default', value: 'default' },
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
}
