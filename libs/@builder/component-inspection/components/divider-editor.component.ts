import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, ComponentMargins, ComponentSize, SequenceProperty, SlotDirection } from '@common/public-api';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-image-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./settings.component.scss', './divider-settings.component.scss'],
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

          <tri-accordion-item title="Sizing">
            
              <ub-size-settings-field
                [value]="settings.styles['size']"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
              >
              </ub-size-settings-field>
            
          </tri-accordion-item>

          <tri-accordion-item title="Appearance">
            
              <ub-button-group-settings-field
                name="Type"
                [value]="settings.styles['direction']"
                [options]="directionOptions"
                (valueChange)="updateDirection($event)"
              >
              </ub-button-group-settings-field>

              <pf-color-editor-field
                name="Color"
                [bg]="true"
                [selected]="color"
                [options]="backgroundOptions"
                (selectedChange)="updateColor($event)"
              >
              </pf-color-editor-field>
            
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
export class DividerEditorComponent implements SettingsView {
  @Input()
  set settings(settings: ComponentSettings) {
    this._settings = settings;
    ɵmarkDirty(this);
  }

  get settings(): ComponentSettings {
    return this._settings;
  }

  @Output() updateProperty                = new EventEmitter();
  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();

  private _settings: ComponentSettings;

  backgroundOptions = [
    { label: 'transparent', value: 'transparent' },
    { label: 'alternate', value: 'alternate' },
    { label: 'disabled', value: 'disabled' },
    { label: 'hint', value: 'hint' },
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
    { label: 'info', value: 'info' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' }
  ];

  directionOptions = [
    { value: 'column', icon: 'divider-line-vertical' },
    { value: 'row', icon: 'divider-line-horizontal' }
  ];

  constructor() {
  }

  get color(): string {
    return this.settings.styles['background'].color;
  }

  updateColor(color: string): void {
    this.updateStyleAtActiveBreakpoint.emit({ background: { color } });
  }

  updateDirection(direction: SlotDirection): void {
    const currentDirection = this.settings.styles['direction'];
    this.updateStyleAtActiveBreakpoint.emit({ direction });
    if (currentDirection !== direction) {
      this.revertSize();
      this.revertMargins(direction);
    }
  }

  private revertSize(): void {
    const {
            heightValue,
            heightUnit,
            heightAuto,
            widthValue,
            widthUnit,
            widthAuto
          }: ComponentSize = this.settings.styles['size'];
    const size             = {
      widthValue : heightValue,
      widthUnit  : heightUnit,
      widthAuto  : heightAuto,
      heightValue: widthValue,
      heightUnit : widthUnit,
      heightAuto : widthAuto
    };
    this.updateStyleAtActiveBreakpoint.emit({ size });
  }

  private revertMargins(direction: SlotDirection): void {
    if (direction === 'row') {
      return this.revertMarginsBack();
    }
    this.revertMarginsForward();
  }

  private revertMarginsForward(): void {
    const {
            marginBottom,
            marginBottomUnit,
            marginLeft,
            marginLeftUnit,
            marginRight,
            marginRightUnit,
            marginTop,
            marginTopUnit
          }: ComponentMargins = this.settings.styles['margins'];

    const margins = {
      marginTop       : marginRight,
      marginTopUnit   : marginRightUnit,
      marginRight     : marginBottom,
      marginRightUnit : marginBottomUnit,
      marginBottom    : marginLeft,
      marginBottomUnit: marginLeftUnit,
      marginLeft      : marginTop,
      marginLeftUnit  : marginTopUnit
    };
    this.updateStyleAtActiveBreakpoint.emit({ margins });
  }

  private revertMarginsBack(): void {
    const {
            marginBottom,
            marginBottomUnit,
            marginLeft,
            marginLeftUnit,
            marginRight,
            marginRightUnit,
            marginTop,
            marginTopUnit
          }: ComponentMargins = this.settings.styles['margins'];

    const margins = {
      marginTop       : marginLeft,
      marginTopUnit   : marginLeftUnit,
      marginRight     : marginTop,
      marginRightUnit : marginTopUnit,
      marginBottom    : marginRight,
      marginBottomUnit: marginRightUnit,
      marginLeft      : marginBottom,
      marginLeftUnit  : marginBottomUnit
    };
    this.updateStyleAtActiveBreakpoint.emit({ margins });
  }

  updateConditionCode(conditionCode: string): void {
    this.updateProperty.next({ [ComponentLogicPropName.CONDITION_PROPERTY]: conditionCode });
  }

  updateSequence(sequence: SequenceProperty): void {
    this.updateProperty.next({ [ComponentLogicPropName.SEQUENCE_PROPERTY]: sequence });
  }
}
