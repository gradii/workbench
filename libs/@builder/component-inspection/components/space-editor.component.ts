import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentLogicPropName, SequenceProperty } from '@common/public-api';
import { PuffActions } from '@tools-state/component-common.model';

import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { take } from 'rxjs/operators';
import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector       : 'pf-space-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : [
    './settings.component.scss',
    './space-editor.component.scss'
  ],
  template       : `
    <tri-tab-group type="segment" [disableRipple]="true" pfTabsController>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="fill:setting"></tri-icon>

        <ng-template triTabContent>
          <pf-component-type-field [component]="settings.component"></pf-component-type-field>

          <tri-accordion pfAccordionController>
            <tri-accordion-item
              title="Display">
              <pf-space-direction-field
                [value]="settings.styles['direction']"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ direction: $event })"
              >
              </pf-space-direction-field>

              <pf-space-horizontal-field
                [value]="horizontal"
                [direction]="settings.styles['direction']"
                (valueChange)="updateHorizontal($event)"
              >
              </pf-space-horizontal-field>

              <pf-space-vertical-field
                [value]="vertical"
                [direction]="settings.styles['direction']"
                (valueChange)="updateVertical($event)"
              >
              </pf-space-vertical-field>

              <pf-space-wrap-field
                [value]="wrap"
                (valueChange)="updateWrap($event)"
              >
              </pf-space-wrap-field>
              <pf-space-gap-field
                [value]="gap"
                (valueChange)="updateGap($event)"
              >
              </pf-space-gap-field>

            </tri-accordion-item>
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
                [padding]="settings.styles['paddings']"
                (paddingChange)="updateStyleAtActiveBreakpoint.emit({ paddings: $event })"
                [marginDisabled]="isRootSpace"
                [margin]="settings.styles['margins']"
                (marginChange)="updateStyleAtActiveBreakpoint.emit({ margins: $event })"
              >
              </ub-margin-padding>
            </tri-accordion-item>
            <tri-accordion-item
              title="Size">
              <pf-space-size-field
                class="full-width"
                [value]="settings.styles"
                [widthDisabled]="isRootSpace"
                (valueChange)="updateStyleAtActiveBreakpoint.emit($event)"
              >
              </pf-space-size-field>
            </tri-accordion-item>
            <tri-accordion-item
              title="Overflow">
              <ub-overflow-settings-field
                class="full-width"
                [valueX]="settings.styles['overflowX']"
                [valueY]="settings.styles['overflowY']"
                (valueXChange)="updateStyleAtActiveBreakpoint.emit({ overflowX: $event })"
                (valueYChange)="updateStyleAtActiveBreakpoint.emit({ overflowY: $event })"
              >
              </ub-overflow-settings-field>
            </tri-accordion-item>
            <tri-accordion-item
              title="Appearance">
              <ub-background-settings-field
                class="full-width"
                [value]="settings.styles['background']"
                [component]="settings.component"
                [backgroundOptions]="backgroundOptions"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ background: $event })"
              >
              </ub-background-settings-field>
            </tri-accordion-item>
          </tri-accordion>
        </ng-template>
      </tri-tab>

      <tri-tab>
        <tri-icon *triTabLabel svgIcon="reiki:workflow"></tri-icon>

        <ng-template triTabContent>
          <ub-component-name-settings-field [settings]="settings" (nameSettingsChange)="onNameSettingsChange($event)">
          </ub-component-name-settings-field>

          <tri-accordion pfAccordionController>
            <tri-accordion-item
              title="Actions">
              <ub-actions-list-settings-field
                [actions]="settings.actions"
                [component]="settings.component"
                (actionsChange)="onActionsChange($event)">
              </ub-actions-list-settings-field>
            </tri-accordion-item>
            <tri-accordion-item *ngIf="!isRootSpace"
                                title="Sequence">
              <ub-for-settings-field
                [component]="settings.component"
                (valueChange)="updateSequence($event)">
              </ub-for-settings-field>
            </tri-accordion-item>
            <tri-accordion-item *ngIf="!isRootSpace"
                                title="Data Condition">
              <ub-if-settings-field
                [component]="settings.component"
                (valueChange)="updateConditionCode($event)">
              </ub-if-settings-field>
            </tri-accordion-item>
          </tri-accordion>
        </ng-template>
      </tri-tab>
    </tri-tab-group>
  `
})
export class SpaceEditorComponent implements SettingsView {
  @Input()
  set settings(settings: ComponentSettings) {
    this._settings = settings;
    this.updateWidthDisabled();
  }

  get settings(): ComponentSettings {
    return this._settings;
  }

  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  @Output() updateProperty                = new EventEmitter();
  @Output() updateActions                 = new EventEmitter();

  backgroundOptions = [
    { label: 'transparent', value: 'transparent' },
    { label: 'default background', value: 'default' },
    { label: 'alternate', value: 'alternate' },
    { label: 'disabled', value: 'disabled' },
    { label: 'hint', value: 'hint' },
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
    { label: 'info', value: 'info' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' }
  ];

  isRootSpace: boolean;
  private _settings: ComponentSettings;

  constructor( private componentFacade: ComponentFacade) {
  }

  get horizontal() {
    if (this.settings.styles['direction'] === 'row') {
      return this.settings.styles['justify'];
    } else {
      return this.settings.styles['align'];
    }
  }

  get vertical() {
    if (this.settings.styles['direction'] === 'column') {
      return this.settings.styles['justify'];
    } else {
      return this.settings.styles['align'];
    }
  }

  get wrap() {
    return this.settings.styles['wrap'];
  }

  get gap() {
    return this.settings.styles['gap'] || {};
  }

  updateHorizontal(event) {
    if (this.settings.styles['direction'] === 'row') {
      this.updateStyleAtActiveBreakpoint.emit({ justify: event });
    } else {
      this.updateStyleAtActiveBreakpoint.emit({ align: event });
    }
  }

  updateVertical(event) {
    if (this.settings.styles['direction'] === 'column') {
      this.updateStyleAtActiveBreakpoint.emit({ justify: event });
    } else {
      this.updateStyleAtActiveBreakpoint.emit({ align: event });
    }
  }

  updateWrap(event) {
    this.updateStyleAtActiveBreakpoint.emit({ wrap: event });
  }

  updateGap(event) {
    this.updateStyleAtActiveBreakpoint.emit({ gap: event });
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

  private updateWidthDisabled() {
    this.componentFacade
      .isRootComponent(this.settings.component)
      .pipe(take(1))
      .subscribe((isRoot: boolean) => {
        this.isRootSpace = isRoot;
        ɵmarkDirty(this);
      });
  }

  private updateContainerStatus(nextActions: PuffActions) {
    const initActions = nextActions['init'];
    if (initActions?.length) {
      this.updateProperty.emit({ container: true });
    }
  }
}
