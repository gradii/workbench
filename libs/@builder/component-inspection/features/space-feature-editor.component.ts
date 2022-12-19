import { Component, EventEmitter, Output, ɵɵProvidersFeature} from '@angular/core';
import { Breakpoint } from '../../../@core/breakpoint/breakpoint';
import { SettingsView } from '../settings-view';


@Component({
  selector: 'pf-space-feature-editor',
  template: `
    <div>
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
    </div>
  `,
  styleUrls: ['./space-feature-editor.component.scss'],
})
export class SpaceFeatureEditorComponent implements SettingsView {
  selectedBreakpoint: Breakpoint;

  settings;

  @Output()
  updateProperty = new EventEmitter();

  @Output()
  updateStyleAtActiveBreakpoint = new EventEmitter();

  @Output()
  updateActions = new EventEmitter();


  constructor() {
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

}