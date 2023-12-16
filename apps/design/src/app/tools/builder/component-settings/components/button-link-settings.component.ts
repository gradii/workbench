import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, SequenceProperty } from '@common';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector: 'ub-button-link-settings',
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
            <nb-accordion-item-header>Appearance</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-text-settings-field
                [value]="settings.properties['text']"
                (valueChange)="updateProperty.emit({ text: $event })"
              >
              </ub-text-settings-field>

              <ub-navigation-settings-field-action
                [value]="settings.properties['url']"
                (valueChange)="updateProperty.emit({ url: $event })"
              >
              </ub-navigation-settings-field-action>

              <ub-color-settings-field
                [selected]="settings.properties['status']"
                [options]="statusOptions"
                [showStyleNotification]="false"
                (selectedChange)="updateProperty.emit({ status: $event })"
              ></ub-color-settings-field>
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
              <ub-icon-settings-field-action
                [icon]="settings.properties['icon']"
                [disabled]="settings.styles.iconPlacement === 'none'"
                (iconChange)="updateProperty.emit({ icon: $event })"
              ></ub-icon-settings-field-action>
            </nb-accordion-item-body>
          </nb-accordion-item>
        </nb-accordion>
      </nb-tab>
      <nb-tab [tabIcon]="{ icon: 'workflow-data', pack: 'bakery' }">
        <ub-component-name-settings-field [settings]="settings" (nameSettingsChange)="updateProperty.emit($event)">
        </ub-component-name-settings-field>

        <nb-accordion multi>
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
export class ButtonLinkSettingsComponent implements SettingsView {
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

  constructor(private cd: ChangeDetectorRef) {
  }

  updateConditionCode(conditionCode: string): void {
    this.updateProperty.next({ [ComponentLogicPropName.CONDITION_PROPERTY]: conditionCode });
  }

  updateSequence(sequence: SequenceProperty): void {
    this.updateProperty.next({ [ComponentLogicPropName.SEQUENCE_PROPERTY]: sequence });
  }
}
