import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ColorInputSource, Theme } from '@common';

import { ColorChange } from '@tools-state/theme/theme.models';

@Component({
  selector: 'len-primary-color',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <len-color-input
      label="Primary"
      [logoInput]="true"
      [editable]="!paletteLoading"
      [color]="theme.colors.primary._500"
      (colorChange)="colorChange.emit($event)"
    ></len-color-input>
    <len-color-shades
      [shades]="theme.colors.primary"
      [selectable]="extendedSettingsAvailable"
      [loading]="paletteLoading"
      (colorSelect)="updateFromShade($event)"
    ></len-color-shades>
  `
})
export class PrimaryColorComponent {
  @Input() theme: Theme;
  @Input() paletteLoading: boolean;
  @Input() extendedSettingsAvailable: boolean;
  @Output() colorChange: EventEmitter<ColorChange> = new EventEmitter<ColorChange>();

  updateFromShade(color) {
    this.colorChange.emit({ color, inputSource: ColorInputSource.SHADE });
  }
}
