import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, SequenceProperty } from '@common';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector: 'ub-heading-settings',
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
              <ub-data-field
                syntax="text"
                [resizable]="true"
                [component]="settings.component"
                [value]="settings.properties['text']"
                (valueChange)="updateProperty.emit({ text: $event })"
              >
              </ub-data-field>

              <ub-dropdown-settings-field
                name="Type"
                [showStyleNotification]="false"
                [selected]="settings.properties['type']"
                [options]="typeOptions"
                (selectedChange)="updateProperty.emit({ type: $event })"
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
              <ub-color-settings-field
                name="Color"
                [selected]="settings.styles['color']"
                [options]="colorOptions"
                (selectedChange)="updateStyleAtActiveBreakpoint.emit({ color: $event })"
              >
              </ub-color-settings-field>
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
export class HeadingSettingsComponent implements SettingsView {
  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  @Output() updateProperty = new EventEmitter();

  typeOptions = [
    { label: 'h1', value: 'h1' },
    { label: 'h2', value: 'h2' },
    { label: 'h3', value: 'h3' },
    { label: 'h4', value: 'h4' },
    { label: 'h5', value: 'h5' },
    { label: 'h6', value: 'h6' }
  ];

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

  constructor(private cd: ChangeDetectorRef) {
  }

  private _settings: ComponentSettings;

  get settings(): ComponentSettings {
    return this._settings;
  }

  @Input()
  set settings(settings: ComponentSettings) {
    this._settings = settings;
    this.cd.markForCheck();
  }

  updateConditionCode(conditionCode: string): void {
    this.updateProperty.next({ [ComponentLogicPropName.CONDITION_PROPERTY]: conditionCode });
  }

  updateSequence(sequence: SequenceProperty): void {
    this.updateProperty.next({ [ComponentLogicPropName.SEQUENCE_PROPERTY]: sequence });
  }
}
