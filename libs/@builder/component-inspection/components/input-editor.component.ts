import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, SequenceProperty } from '@common/public-api';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-input-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./settings.component.scss'],
  template       : `
    <tri-tab-group type="segment" [disableRipple]="true">
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="fill:setting"></tri-icon>
        <ng-template triTabContent>
          <pf-component-type-field [component]="settings.component"></pf-component-type-field>

          <tri-accordion pfAccordionController>
            <tri-accordion-item
              title="Visibility">
              <pf-checkbox-editor-field
                name="Visible"
                [value]="settings.styles['visible']"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ visible: $event })"
              >
              </pf-checkbox-editor-field>
            </tri-accordion-item>
            <tri-accordion-item
              title="Spacing">
              <ub-margin-padding
                [margin]="settings.styles['margins']"
                (marginChange)="updateStyleAtActiveBreakpoint.emit({ margins: $event })"
                [paddingDisabled]="true"
              >
              </ub-margin-padding>
            </tri-accordion-item>
            <tri-accordion-item
              title="Appearance">
              <pf-color-editor-field
                [selected]="settings.properties['status']"
                [options]="statusOptions"
                [showStyleNotification]="false"
                (selectedChange)="updateProperty.emit({ status: $event })"
              ></pf-color-editor-field>
              <ub-dropdown-settings-field
                name="Type"
                [showStyleNotification]="false"
                [selected]="settings.properties['type']"
                [options]="typeOptions"
                (selectedChange)="updateProperty.emit({ type: $event })"
              ></ub-dropdown-settings-field>
              <ub-dropdown-settings-field
                name="Size"
                [selected]="settings.styles['size']"
                [options]="sizeOptions"
                (selectedChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
              >
              </ub-dropdown-settings-field>
              <ub-dropdown-settings-field
                name="Shape"
                [showStyleNotification]="false"
                [selected]="settings.properties['shape']"
                [options]="shapeOptions"
                (selectedChange)="updateProperty.emit({ shape: $event })"
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
              <pf-text-editor-field
                label="Placeholder"
                [value]="settings.properties['placeholder']"
                (valueChange)="updateProperty.emit({ placeholder: $event })"
              >
              </pf-text-editor-field>

              <ub-button-group-settings-field
                name="Icon placement"
                [options]="iconPlacementOptions"
                [showStyleNotification]="false"
                [value]="settings.properties['iconPlacement']"
                (valueChange)="updateProperty.emit({ iconPlacement: $event })"
              >
              </ub-button-group-settings-field>

              <pf-icon-editor-field-action
                [icon]="settings.properties['icon']"
                [disabled]="settings.properties.iconPlacement === 'none'"
                (iconChange)="updateProperty.emit({ icon: $event })"
              >
              </pf-icon-editor-field-action>
            </tri-accordion-item>
          </tri-accordion>
        </ng-template>
      </tri-tab>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="reiki:workflow"></tri-icon>
        <ng-template triTabContent>
          <ub-component-name-settings-field [settings]="settings" (nameSettingsChange)="updateProperty.emit($event)">
          </ub-component-name-settings-field>

          <tri-accordion pfAccordionController>
            <tri-accordion-item
              title="Actions">
              <ub-actions-list-settings-field
                [actions]="settings.actions"
                [component]="settings.component"
                (actionsChange)="updateActions.emit($event)"
              >
              </ub-actions-list-settings-field>
            </tri-accordion-item>
            <tri-accordion-item
              title="Sequence">
              <ub-for-settings-field [component]="settings.component" (valueChange)="updateSequence($event)">
              </ub-for-settings-field>
            </tri-accordion-item>
            <tri-accordion-item
              title="DATA CONDITION">
              <ub-if-settings-field [component]="settings.component" (valueChange)="updateConditionCode($event)">
              </ub-if-settings-field>
            </tri-accordion-item>
          </tri-accordion>
        </ng-template>
      </tri-tab>
    </tri-tab-group>
  `
})
export class InputEditorComponent implements SettingsView {
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

  shapeOptions = [
    { label: 'round', value: 'round' },
    { label: 'semi-round', value: 'semi-round' },
    { label: 'rectangle', value: 'rectangle' }
  ];

  sizeOptions = [
    { label: 'tiny', value: 'tiny' },
    { label: 'small', value: 'small' },
    { label: 'medium', value: 'medium' },
    { label: 'large', value: 'large' },
    { label: 'giant', value: 'giant' }
  ];

  statusOptions = [
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
    { label: 'info', value: 'info' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' },
    { label: 'basic', value: 'basic' },
    { label: 'control', value: 'control' }
  ];

  typeOptions = [
    { label: 'text', value: 'text' },
    { label: 'password', value: 'password' },
    { label: 'email', value: 'email' },
    { label: 'file', value: 'file' },
    { label: 'number', value: 'number' },
    { label: 'url', value: 'url' }
  ];

  stateOptions = [
    { label: 'Active', value: false },
    { label: 'Disabled', value: true }
  ];

  iconPlacementOptions = [
    { value: 'none', icon: 'btn-icon-none' },
    { value: 'start', icon: 'btn-icon-left' },
    { value: 'end', icon: 'btn-icon-right' }
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
