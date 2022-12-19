import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, doughnutChartSample, SequenceProperty } from '@common/public-api';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-doughnut-chart-editor',
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

          <tri-accordion-item title="Content">
            
              <ub-data-source-settings-field
                [component]="settings.component"
                [formatExample]="doughnutChartData"
                (valueChange)="updateProperty.emit({ data: $event })"
                dataFormatType="Doughnut Chart"
              >
              </ub-data-source-settings-field>
            
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

          <tri-accordion-item>
            <pf-setting-label-container accordion-title>Size</pf-setting-label-container>
            
              <ub-size-settings-field
                [value]="settings.styles['size']"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
              >
              </ub-size-settings-field>
            
          </tri-accordion-item>
        </tri-accordion>
      </tri-tab>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="reiki:workflow"></tri-icon>
        <ub-component-name-settings-field [settings]="settings" (nameSettingsChange)="updateProperty.emit($event)">
        </ub-component-name-settings-field>

        <tri-accordion pfAccordionController>
          <tri-accordion-item title="Actions">
            
              <ub-actions-list-settings-field
                [actions]="settings.actions"
                [component]="settings.component"
                (actionsChange)="updateActions.emit($event)"
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
export class DoughnutChartEditorComponent implements SettingsView {
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

  private _settings: ComponentSettings;

  constructor() {
  }

  doughnutChartData: any = doughnutChartSample;

  updateConditionCode(conditionCode: string): void {
    this.updateProperty.next({ [ComponentLogicPropName.CONDITION_PROPERTY]: conditionCode });
  }

  updateSequence(sequence: SequenceProperty): void {
    this.updateProperty.next({ [ComponentLogicPropName.SEQUENCE_PROPERTY]: sequence });
  }
}
