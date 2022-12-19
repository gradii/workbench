import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'len-color-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./color-preview.component.scss'],
  template: ` <tri-icon *ngIf="icon" [svgIcon]="icon"></tri-icon>`
})
export class ColorPreviewComponent {
  @Input() size: string;
  @Input() icon: string;
  @Input() @HostBinding('class.active') active: boolean;
  @Input() @HostBinding('class.editable') editable: boolean;
  @Input() @HostBinding('style.background-color') color: string;

  @HostBinding('class.size-tiny') get tiny() {
    return this.size === 'tiny';
  }

  @HostBinding('class.size-small') get small() {
    return this.size === 'small';
  }
}
