import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, SequenceProperty } from '@common';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector: 'ub-progress-bar-settings',
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
              <ub-color-settings-field
                [selected]="settings.properties['status']"
                [options]="statusOptions"
                (selectedChange)="updateProperty.emit({ status: $event })"
              ></ub-color-settings-field>
              <ub-dropdown-settings-field
                name="Size"
                [selected]="settings.styles['size']"
                [options]="sizeOptions"
                (selectedChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
              >
              </ub-dropdown-settings-field>
              <ub-checkbox-settings-field
                name="Display Value"
                [showStyleNotification]="false"
                [value]="settings.properties['displayValue']"
                (valueChange)="updateProperty.emit({ displayValue: $event })"
              >
              </ub-checkbox-settings-field>
              <ub-number-settings-field
                [value]="settings.properties['value']"
                [min]="0"
                (valueChange)="updateProperty.emit({ value: $event })"
              >
              </ub-number-settings-field>
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
export class ProgressBarSettingsComponent implements SettingsView {
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
    { label: 'basic', value: 'basic' },
    { label: 'control', value: 'control' }
  ];

  sizeOptions = [
    { label: 'tiny', value: 'tiny' },
    { label: 'small', value: 'small' },
    { label: 'medium', value: 'medium' },
    { label: 'large', value: 'large' },
    { label: 'giant', value: 'giant' }
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
