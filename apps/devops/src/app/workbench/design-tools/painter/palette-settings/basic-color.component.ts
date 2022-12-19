import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ColorInputSource, Theme } from '@common';

import { ColorChange } from '@tools-state/theme/theme.models';

@Component({
  selector: 'len-basic-color',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  template: `
    <span class="label description">
      Choose the grey color for icons. The color shades would be used in text and backgrounds colors
    </span>
    <len-color-input
      label="Basic"
      [color]="theme.colors.basic._600"
      [editable]="!paletteLoading && extendedSettingsAvailable"
      (colorChange)="colorChange.emit($event)"
    ></len-color-input>
    <len-color-shades
      [shades]="theme.colors.basic"
      [loading]="paletteLoading"
      [selectable]="extendedSettingsAvailable"
      [centralColor]="'_600'"
      (colorSelect)="updateFromShade($event)"
    ></len-color-shades>
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
