import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ColorInputSource, Theme } from '@common';

import { ColorChange } from '@tools-state/theme/theme.models';

@Component({
  selector: 'ub-basic-color',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  template: `
    <span class="label description">
      Choose the grey color for icons. The color shades would be used in text and backgrounds colors
    </span>
    <ub-color-input
      label="Basic"
      [color]="theme.colors.basic._600"
      [editable]="!paletteLoading && extendedSettingsAvailable"
      (colorChange)="colorChange.emit($event)"
    ></ub-color-input>
    <ub-color-shades
      [shades]="theme.colors.basic"
      [loading]="paletteLoading"
      [selectable]="extendedSettingsAvailable"
      [centralColor]="'_600'"
      (colorSelect)="updateFromShade($event)"
    ></ub-color-shades>
  `
})
export class BasicColorComponent {
  @Input() theme: Theme;
  @Input() paletteLoading: boolean;
  @Input() extendedSettingsAvailable: boolean;
  @Output() colorChange: EventEmitter<ColorChange> = new EventEmitter<ColorChange>();

  updateFromShade(color: string) {
    this.colorChange.emit({ color, inputSource: ColorInputSource.SHADE });
  }
}
