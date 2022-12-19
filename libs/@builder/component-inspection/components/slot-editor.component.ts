import { Component, EventEmitter, Output } from '@angular/core';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { PuffFeature } from '@tools-state/feature/feature.model';
import {
  spaceFeatureFactory
} from 'libs/kitchen/src/lib/definitions/features-definitions/space-feature/space-feature-definition';
import { KitchenFeature, KitchenType } from '../../../@common';
import { SettingsView } from '../settings-view';


@Component({
  selector: 'pf-slot-editor',
  template: `

    <tri-tab-group class="icon-tabs" fullWidth>
      <tri-tab>
        <tri-icon *triTabLabel svgIcon="fill:setting"></tri-icon>

        <div style="display:flex; justify-content: center;">
          <tri-button-toggle-group class="size-small" [value]="selectedBreakpoint">
            <tri-button-toggle value="mobile">mobile</tri-button-toggle>
            <tri-button-toggle value="xs">xs</tri-button-toggle>
            <tri-button-toggle value="sm">sm</tri-button-toggle>
            <tri-button-toggle value="md">md</tri-button-toggle>
            <tri-button-toggle value="xl">xl</tri-button-toggle>
            <tri-button-toggle value="pc">pc</tri-button-toggle>
          </tri-button-toggle-group>
        </div>

        <tri-accordion [bordered]="false" size="small">
          <tri-accordion-item expanded *ngFor="let it of featureList" [title]="it.definitionId">
            <div pfFeatureEditor
                 [selectedBreakpoint]="selectedBreakpoint"
                 [settings]="it"
                 (updateBinding)="onUpdateFeature($event)"
            ></div>
          </tri-accordion-item>
        </tri-accordion>

      </tri-tab>
    </tri-tab-group>

    <div style="display:flex; width: 100%; margin-top: 2rem">
      <button triButton
              triMenuItem
              [triMenuTriggerFor]="menu"
              style="width:100%"
              size="small"
              color="primary">
        Add Feature
      </button>
    </div>

    <ng-template triMenuPanel #menu="triMenuPanel">
      <div class="example-menu" triMenu [triMenuPanel]="menu">
        <button triMenuItem (click)="onClick('space-feature')">
          Space Feature
        </button>
        <button triMenuItem (click)="onClick('italic')">
          Italic
        </button>
      </div>
    </ng-template>
  `
})
export class SlotEditorComponent implements SettingsView {
  selectedBreakpoint: Breakpoint;

  settings: { id: string, name: string };

  featureList: any[];

  //todo remove
  @Output() updateStyleAtActiveBreakpoint = new EventEmitter();
  //todo remove
  @Output() updateProperty                = new EventEmitter();
  //todo remove
  @Output() updateActions                 = new EventEmitter();

  @Output() updateFeature: EventEmitter<Partial<PuffFeature>> = new EventEmitter();
  @Output() addFeature: EventEmitter<PuffFeature>             = new EventEmitter();

  onClick(item) {
    console.log(item);
    const feature: KitchenFeature  = spaceFeatureFactory('vertical');
    const puffFeature: PuffFeature = {
      ...feature,
      type  : KitchenType.Feature,
      hostId: this.settings.id,
      index : -1
    };
    this.addFeature.emit(puffFeature);
  }

  onUpdateFeature(updateFeature: Partial<PuffFeature>) {
    this.updateFeature.emit(updateFeature);
  }
}