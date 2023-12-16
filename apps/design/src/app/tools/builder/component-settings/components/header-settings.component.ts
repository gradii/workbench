import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, SequenceProperty } from '@common';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector: 'ub-header-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./settings.component.scss'],
  template: `
    <nb-tabset class="icon-tabs" fullWidth ubTabsController>
      <nb-tab tabIcon="settings">
        <ub-component-type-field [component]="settings.component"></ub-component-type-field>

        <nb-accordion multi>
          <nb-accordion-item expanded>
            <nb-accordion-item-header>
              <ub-setting-label-container>Spacing</ub-setting-label-container>
            </nb-accordion-item-header>
            <nb-accordion-item-body class="with-padding">
              <ub-margin-padding
                [padding]="settings.styles['paddings']"
                (paddingChange)="updateStyleAtActiveBreakpoint.emit({ paddings: $event })"
                [marginDisabled]="true"
              >
              </ub-margin-padding>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>
              <ub-setting-label-container>Sizing</ub-setting-label-container>
            </nb-accordion-item-header>
            <nb-accordion-item-body class="with-padding">
              <ub-size-settings-field
                [value]="settings.styles['size']"
                [withAuto]="false"
                [withoutWidth]="true"
                [heightUnitList]="heightUnitList"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
              >
              </ub-size-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>Appearance</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-button-group-settings-field
                name="Position on scroll"
                [showStyleNotification]="false"
                [value]="settings.properties.fixed"
                [options]="typeOptions"
                (valueChange)="updateProperty.emit({ fixed: $event })"
              >
              </ub-button-group-settings-field>

              <ub-background-settings-field
                [value]="settings.styles['background']"
                [backgroundOptions]="backgroundOptions"
                [noImage]="true"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ background: $event })"
              >
              </ub-background-settings-field>
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
export class HeaderSettingsComponent implements SettingsView {
  @Output() updateProperty = new EventEmitter();
  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  typeOptions = [
    { label: 'Static', value: false },
    { label: 'Sticky', value: true }
  ];
  backgroundOptions = [
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
  heightUnitList = [{ label: 'px', value: 'px' }];

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
