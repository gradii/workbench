import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { ComponentLogicPropName, SequenceProperty } from '@common';

import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { BakeryActions } from '@tools-state/component/component.model';
import { ComponentSettings, SettingsView } from '../settings-view';

@Component({
  selector: 'ub-space-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./settings.component.scss', './space-settings.component.scss'],
  template: `
    <nb-tabset class="icon-tabs" fullWidth ubTabsController>
      <nb-tab tabIcon="settings">
        <ub-component-type-field [component]="settings.component"></ub-component-type-field>

        <ub-space-direction-field
          [value]="settings.styles['direction']"
          (valueChange)="updateStyleAtActiveBreakpoint.emit({ direction: $event })"
        >
        </ub-space-direction-field>

        <ub-space-justify-field
          [value]="justify"
          [direction]="settings.styles['direction']"
          (valueChange)="updateHorizontal($event)"
        >
        </ub-space-justify-field>

        <ub-space-align-field
          [value]="align"
          [direction]="settings.styles['direction']"
          (valueChange)="updateVertical($event)"
        >
        </ub-space-align-field>
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
            <nb-accordion-item-body class="with-padding">
              <ub-margin-padding
                [padding]="settings.styles['paddings']"
                (paddingChange)="updateStyleAtActiveBreakpoint.emit({ paddings: $event })"
                [marginDisabled]="isRootSpace"
                [margin]="settings.styles['margins']"
                (marginChange)="updateStyleAtActiveBreakpoint.emit({ margins: $event })"
              >
              </ub-margin-padding>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>Size</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-space-size-field
                class="full-width"
                [value]="settings.styles"
                [widthDisabled]="isRootSpace"
                (valueChange)="updateStyleAtActiveBreakpoint.emit($event)"
              >
              </ub-space-size-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>Overflow</nb-accordion-item-header>
            <nb-accordion-item-body class="with-padding full-width">
              <ub-overflow-settings-field
                class="full-width"
                [valueX]="settings.styles['overflowX']"
                [valueY]="settings.styles['overflowY']"
                (valueXChange)="updateStyleAtActiveBreakpoint.emit({ overflowX: $event })"
                (valueYChange)="updateStyleAtActiveBreakpoint.emit({ overflowY: $event })"
              >
              </ub-overflow-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded>
            <nb-accordion-item-header>Appearance</nb-accordion-item-header>
            <nb-accordion-item-body class="no-padding">
              <ub-background-settings-field
                class="full-width"
                [value]="settings.styles['background']"
                [component]="settings.component"
                [backgroundOptions]="backgroundOptions"
                (valueChange)="updateStyleAtActiveBreakpoint.emit({ background: $event })"
              >
              </ub-background-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>
        </nb-accordion>
      </nb-tab>

      <nb-tab [tabIcon]="{ icon: 'workflow-data', pack: 'bakery' }">
        <ub-component-name-settings-field [settings]="settings" (nameSettingsChange)="onNameSettingsChange($event)">
        </ub-component-name-settings-field>

        <nb-accordion multi>
          <nb-accordion-item expanded>
            <nb-accordion-item-header>Actions</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-actions-list-settings-field
                [actions]="settings.actions"
                [component]="settings.component"
                (actionsChange)="onActionsChange($event)"
              >
              </ub-actions-list-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>
          <nb-accordion-item expanded *ngIf="!isRootSpace">
            <nb-accordion-item-header>Sequence</nb-accordion-item-header>
            <nb-accordion-item-body>
              <ub-for-settings-field [component]="settings.component" (valueChange)="updateSequence($event)">
              </ub-for-settings-field>
            </nb-accordion-item-body>
          </nb-accordion-item>

          <nb-accordion-item expanded *ngIf="!isRootSpace">
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
export class SpaceSettingsComponent implements SettingsView {
  @Input()
  set settings(settings: ComponentSettings) {
    this._settings = settings;
    this.updateWidthDisabled();
  }

  get settings(): ComponentSettings {
    return this._settings;
  }

  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  @Output() updateProperty = new EventEmitter();
  @Output() updateActions = new EventEmitter();

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

  constructor(private cd: ChangeDetectorRef, private componentFacade: ComponentFacade) {
  }

  get justify() {
    if (this.settings.styles['direction'] === 'row') {
      return this.settings.styles['justify'];
    } else {
      return this.settings.styles['align'];
    }
  }

  get align() {
    if (this.settings.styles['direction'] === 'column') {
      return this.settings.styles['justify'];
    } else {
      return this.settings.styles['align'];
    }
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

  onActionsChange(nextActions: BakeryActions) {
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
        this.cd.markForCheck();
      });
  }

  private updateContainerStatus(nextActions: BakeryActions) {
    const initActions = nextActions['init'];
    if (initActions?.length) {
      this.updateProperty.emit({ container: true });
    }
  }
}
