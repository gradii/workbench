import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Theme } from '@common';

import { ColorChange } from '@tools-state/theme/theme.models';

@Component({
  selector: 'ub-support-colors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./support-colors.component.scss'],
  template: `
    <button
      nbButton
      fullWidth
      ghost
      size="small"
      class="basic refresh-button"
      [class.loading]="supportLoading"
      [disabled]="supportLoading"
      (click)="refresh.emit()"
    >
      Click to refresh colors
      <nb-icon icon="refresh"></nb-icon>
    </button>
    <ub-color-input
      *ngFor="let color of supportColors"
      [editable]="!paletteLoading && extendedSettingsAvailable"
      [lockable]="true"
      [locked]="theme.colors[color.themeName].locked"
      [color]="theme.colors[color.themeName]._500"
      [label]="color.name"
      [icon]="color.icon"
      (lock)="lockColor.emit({ name: color.themeName, locked: $event })"
      (colorChange)="colorChange.emit({ name: color.themeName, value: $event })"
    ></ub-color-input>
  `
})
export class SupportColorsComponent {
  @Input() theme: Theme;
  @Input() supportLoading: boolean;
  @Input() paletteLoading: boolean;
  @Input() extendedSettingsAvailable: boolean;
  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();
  @Output() colorChange: EventEmitter<{ name: string; value: ColorChange }> = new EventEmitter<{
    name: string;
    value: ColorChange;
  }>();
  @Output() lockColor: EventEmitter<{ name: string; locked: boolean }> = new EventEmitter<{
    name: string;
    locked: boolean;
  }>();

  supportColors = [
    {
      name: 'Success',
      themeName: 'success',
      icon: 'checkmark-circle'
    },
    {
      name: 'Info',
      themeName: 'info',
      icon: 'info-outline'
    },
    {
      name: 'Warning',
      themeName: 'warning',
      icon: 'alert-triangle-outline'
    },
    {
      name: 'Danger',
      themeName: 'danger',
      icon: 'close-circle-outline'
    }
  ];
}
