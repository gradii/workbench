import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, ComponentMargins, ComponentSize, SlotDirection, SequenceProperty } from '@common';

import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector: 'ub-image-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./settings.component.scss', './divider-settings.component.scss'],
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
            <nb-accordion-item-header>Sizing</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-size-settings-field
                [value]="settings.styles['size']"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ size: $event })"
              >
              </ub-size-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>Appearance</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-button-group-settings-field
                name="Type"
                [value]="settings.styles['direction']"
                [options]="directionOptions"
                (valueChange)="updateDirection($event)"
              >
              </ub-button-group-settings-field>

              <ub-color-settings-field
                name="Color"
                [bg]="true"
                [selected]="color"
                [options]="backgroundOptions"
                (selectedChange)="updateColor($event)"
              >
              </ub-color-settings-field>
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
export class DividerSettingsComponent implements SettingsView {
  @Input()
  set settings(settings: ComponentSettings) {
    this._settings = settings;
    this.cd.markForCheck();
  }

  get settings(): ComponentSettings {
    return this._settings;
  }

  @Output() updateProperty = new EventEmitter();
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

  constructor(private cd: ChangeDetectorRef) {
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
    const size = {
      widthValue: heightValue,
      widthUnit: heightUnit,
      widthAuto: heightAuto,
      heightValue: widthValue,
      heightUnit: widthUnit,
      heightAuto: widthAuto
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
      marginTop: marginRight,
      marginTopUnit: marginRightUnit,
      marginRight: marginBottom,
      marginRightUnit: marginBottomUnit,
      marginBottom: marginLeft,
      marginBottomUnit: marginLeftUnit,
      marginLeft: marginTop,
      marginLeftUnit: marginTopUnit
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
      marginTop: marginLeft,
      marginTopUnit: marginLeftUnit,
      marginRight: marginTop,
      marginRightUnit: marginTopUnit,
      marginBottom: marginRight,
      marginBottomUnit: marginRightUnit,
      marginLeft: marginBottom,
      marginLeftUnit: marginBottomUnit
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
