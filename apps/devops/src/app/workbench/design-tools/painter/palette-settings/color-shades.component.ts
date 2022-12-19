import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ShadedColor } from '@common';

@Component({
  selector: 'len-color-shades',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./color-shades.component.scss'],
  template: `
    <div
      *ngFor="let colorKey of objectKeys(shades)"
      [style.background-color]="shades[colorKey]"
      [class.active]="colorKey === centralColor"
      (click)="selectable && colorSelect.emit(shades[colorKey])"
    ></div>
  `
})
export class ColorShadesComponent {
  objectKeys = Object.keys;
  @Input() centralColor = '_500';
  @Input() shades: ShadedColor;
  @Input() @HostBinding('class.selectable') selectable: boolean;
  @Input() @HostBinding('class.loading') loading: boolean;
  @Output() colorSelect: EventEmitter<string> = new EventEmitter<string>();
}
