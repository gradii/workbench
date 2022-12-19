import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, SequenceProperty } from '@common/public-api';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-button-link-editor',
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
            
              <pf-text-editor-field
                [value]="settings.properties['text']"
                (valueChange)="updateProperty.emit({ text: $event })"
              >
              </pf-text-editor-field>

              <ub-navigation-settings-field-action
                [value]="settings.properties['url']"
                (valueChange)="updateProperty.emit({ url: $event })"
              >
              </ub-navigation-settings-field-action>

              <pf-color-editor-field
                [selected]="settings.properties['status']"
                [options]="statusOptions"
                [showStyleNotification]="false"
                (selectedChange)="updateProperty.emit({ status: $event })"
              ></pf-color-editor-field>
              <ub-dropdown-settings-field
                name="Size"
                [selected]="settings.styles['size']"
                [options]="sizeOptions"
                (selectedChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
              >
              </ub-dropdown-settings-field>
              <ub-dropdown-settings-field
                name="Appearance"
                [showStyleNotification]="true"
                [selected]="settings.properties['appearance']"
                [options]="appearanceOptions"
                (selectedChange)="updateProperty.emit({ appearance: $event })"
              ></ub-dropdown-settings-field>
              <ub-form-field-width-settings-field
                [value]="settings.styles['width']"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ width: $event })"
              >
              </ub-form-field-width-settings-field>
              <ub-button-group-settings-field
                name="State"
                [showStyleNotification]="false"
                [value]="settings.properties['disabled']"
                [options]="stateOptions"
                (valueChange)="updateProperty.emit({ disabled: $event })"
              >
              </ub-button-group-settings-field>
              <ub-button-group-settings-field
                name="Icon placement"
                [value]="settings.styles['iconPlacement']"
                [options]="iconPlacementOptions"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ iconPlacement: $event })"
              >
              </ub-button-group-settings-field>
              <pf-icon-editor-field-action
                [icon]="settings.properties['icon']"
                [disabled]="settings.styles.iconPlacement === 'none'"
                (iconChange)="updateProperty.emit({ icon: $event })"
              ></pf-icon-editor-field-action>
            
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
export class ButtonLinkEditorComponent implements SettingsView {
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

  statusOptions = [
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
    { label: 'info', value: 'info' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' },
    { label: 'control', value: 'control' },
    { label: 'basic', value: 'basic' }
  ];

  sizeOptions = [
    { label: 'tiny', value: 'tiny' },
    { label: 'small', value: 'small' },
    { label: 'medium', value: 'medium' },
    { label: 'large', value: 'large' },
    { label: 'giant', value: 'giant' }
  ];

  appearanceOptions = [
    { label: 'filled', value: 'filled' },
    { label: 'hero', value: 'hero' },
    { label: 'outline', value: 'outline' },
    { label: 'ghost', value: 'ghost' }
  ];

  stateOptions = [
    { label: 'Active', value: false },
    { label: 'Disabled', value: true }
  ];

  iconPlacementOptions = [
    { value: 'none', icon: 'btn-icon-none' },
    { value: 'left', icon: 'btn-icon-left' },
    { value: 'right', icon: 'btn-icon-right' },
    { value: 'center', icon: 'btn-icon-center' }
  ];

  private _settings: ComponentSettings;

  constructor() {
  }

  updateConditionCode(conditionCode: string): void {
    this.updateProperty.next({ [ComponentLogicPropName.CONDITION_PROPERTY]: conditionCode });
  }

  updateSequence(sequence: SequenceProperty): void {
    this.updateProperty.next({ [ComponentLogicPropName.SEQUENCE_PROPERTY]: sequence });
  }
}
