import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, SequenceProperty } from '@common/public-api';
import { PuffActions } from '@tools-state/component-common.model';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-card-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./settings.component.scss'],
  template       : `
    <tri-tab-group class="icon-tabs" style="width:100%" pfTabsController>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="fill:setting"></tri-icon>
        <pf-component-type-field [component]="settings.component"></pf-component-type-field>

        <tri-accordion pfAccordionController>
          <tri-accordion-item title="Visibility">
            <pf-checkbox-editor-field
              name="Visible"
              [value]="settings.styles['visible']"
              (valueChange)="updateStyleAtActiveBreakpoint.emit({ visible: $event })"
            ></pf-checkbox-editor-field>
          </tri-accordion-item>

          <tri-accordion-item>
            <pf-setting-label-container accordion-title>Spacing</pf-setting-label-container>
            <ub-margin-padding
              [margin]="settings.styles['margins']"
              (marginChange)="updateStyleAtActiveBreakpoint.emit({ margins: $event })"
              [paddingDisabled]="true"
            >
            </ub-margin-padding>

            <pf-checkbox-editor-field
              name="Header padding"
              [value]="settings.styles['headerPadding']"
              (valueChange)="updateStyleAtActiveBreakpoint.emit({ headerPadding: $event })"
            >
            </pf-checkbox-editor-field>

            <pf-checkbox-editor-field
              name="Body padding"
              [value]="settings.styles['bodyPadding']"
              (valueChange)="updateStyleAtActiveBreakpoint.emit({ bodyPadding: $event })"
            >
            </pf-checkbox-editor-field>

            <pf-checkbox-editor-field
              name="Footer padding"
              [value]="settings.styles['footerPadding']"
              (valueChange)="updateStyleAtActiveBreakpoint.emit({ footerPadding: $event })"
            >
            </pf-checkbox-editor-field>
          </tri-accordion-item>

          <tri-accordion-item title="Content">
            <pf-checkbox-editor-field
              name="With header"
              [showStyleNotification]="false"
              [value]="settings.properties['showHeader']"
              (valueChange)="updateProperty.emit({ showHeader: $event })"
            >
            </pf-checkbox-editor-field>
            <pf-checkbox-editor-field
              name="With footer"
              [showStyleNotification]="false"
              [value]="settings.properties['showFooter']"
              (valueChange)="updateProperty.emit({ showFooter: $event })"
            >
            </pf-checkbox-editor-field>
          </tri-accordion-item>

          <tri-accordion-item title="Appearance">
            <pf-color-editor-field
              class="no-tab-container"
              [selected]="settings.styles['status']"
              [options]="statusOptions"
              [bg]="true"
              (selectedChange)="updateStyleAtActiveBreakpoint.emit({ status: $event })"
            ></pf-color-editor-field>
            <pf-color-editor-field
              name="Accent"
              class="no-tab-container no-top-margin no-bottom-padding"
              [selected]="settings.styles['accent']"
              [options]="accentOptions"
              [bg]="true"
              (selectedChange)="updateStyleAtActiveBreakpoint.emit({ accent: $event })"
            ></pf-color-editor-field>
            <ub-background-settings-field
              class="no-top-margin"
              [component]="settings.component"
              [value]="settings.styles['background']"
              [backgroundOptions]="backgroundOptions"
              (valueChange)="updateStyleAtActiveBreakpoint.emit({ background: $event })"
            >
            </ub-background-settings-field>
          </tri-accordion-item>

          <tri-accordion-item>
            <pf-setting-label-container accordion-title>Size</pf-setting-label-container>
            <ub-size-settings-field
              [value]="settings.styles['size']"
              [withAuto]="true"
              (valueChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
            >
            </ub-size-settings-field>
          </tri-accordion-item>
        </tri-accordion>
      </tri-tab>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="reiki:workflow"></tri-icon>
        <ub-component-name-settings-field [settings]="settings" (nameSettingsChange)="onNameSettingsChange($event)">
        </ub-component-name-settings-field>

        <tri-accordion pfAccordionController>
          <tri-accordion-item title="Actions">
            <ub-actions-list-settings-field
              [actions]="settings.actions"
              [component]="settings.component"
              (actionsChange)="onActionsChange($event)"
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
export class CardEditorComponent implements SettingsView {

  @Input()
  get settings(): ComponentSettings {
    return this._settings;
  }

  set settings(settings: ComponentSettings) {
    this._settings = settings;
    ɵmarkDirty(this);
  }

  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  @Output() updateProperty                = new EventEmitter();
  @Output() updateActions                 = new EventEmitter();

  statusOptions = [
    { label: 'default', value: '' },
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
    { label: 'info', value: 'info' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' }
  ];

  accentOptions = [
    { label: 'default', value: '' },
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
    { label: 'info', value: 'info' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' }
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

  private _settings: ComponentSettings;

  constructor() {
  }

  updateConditionCode(conditionCode: string): void {
    this.updateProperty.next({ [ComponentLogicPropName.CONDITION_PROPERTY]: conditionCode });
  }

  updateSequence(sequence: SequenceProperty): void {
    this.updateProperty.next({ [ComponentLogicPropName.SEQUENCE_PROPERTY]: sequence });
  }

  onNameSettingsChange(nextNameSettings) {
    this.updateProperty.emit(nextNameSettings);
    if (!nextNameSettings.container) {
      this.clearActions();
    }
  }

  onActionsChange(nextActions: PuffActions) {
    this.updateContainerStatus(nextActions);
    this.updateActions.emit(nextActions);
  }

  clearActions() {
    if (this.settings.actions) {
      const clearedActions = {};
      for (const action of Object.keys(this.settings.actions)) {
        clearedActions[action] = [];
      }
      this.onActionsChange(clearedActions);
    }
  }

  private updateContainerStatus(nextActions: PuffActions) {
    const initActions = nextActions['init'];
    if (initActions?.length) {
      this.updateProperty.emit({ container: true });
    }
  }
}
