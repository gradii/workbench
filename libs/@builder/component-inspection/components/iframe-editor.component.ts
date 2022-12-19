import {
  ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output, ViewChild
} from '@angular/core';
import { ComponentLogicPropName, SequenceProperty } from '@common/public-api';
import { TooltipDirective, TriggerType } from '@gradii/triangle/tooltip';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-iframe-settings',
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

          <tri-accordion-item title="Properties">
            
              <ub-data-field
                syntax="text"
                label="URL"
                [oneLine]="true"
                [resizable]="false"
                placeholder="https://example.com"
                triTooltip="Valid urls: http(s)://*.*"
                triTooltipPosition="bottom"
                [triTooltipTrigger]="tooltipTrigger"
                [component]="settings.component"
                [value]="settings.properties['url']"
                (valueChange)="updateProperty.emit({ url: $event })"
              >
              </ub-data-field>
            
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
export class IframeEditorComponent implements SettingsView {
  @ViewChild(TooltipDirective, { static: true }) tooltip: TooltipDirective;

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

  private _settings: ComponentSettings;

  constructor() {
  }

  get isValidUrl(): boolean {
    return this.url.match(/^https?:\/\/.+\..+/g);
  }

  get tooltipTrigger(): TriggerType {
    if (this.isValidUrl) {
      if (this.tooltip._isTooltipVisible()) {
        this.tooltip.hide();
      }
      return TriggerType.NOOP;
    }
    return TriggerType.HINT;
  }

  get urlInputStatus(): string {
    return this.isValidUrl || !this.url ? 'basic' : 'danger';
  }

  get url() {
    return this.settings.properties['url'] || '';
  }

  updateConditionCode(conditionCode: string): void {
    this.updateProperty.next({ [ComponentLogicPropName.CONDITION_PROPERTY]: conditionCode });
  }

  updateSequence(sequence: SequenceProperty): void {
    this.updateProperty.next({ [ComponentLogicPropName.SEQUENCE_PROPERTY]: sequence });
  }
}
