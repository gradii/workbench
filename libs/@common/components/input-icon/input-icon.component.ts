import { Component, ContentChild, HostBinding, Input } from '@angular/core';
import { InputDirective } from '@gradii/triangle/input';

@Component({
  selector: 'bc-input-icon',
  styleUrls: ['./input-icon.component.scss'],
  template: `
    <tri-icon *ngIf="showIcon" [svgIcon]="icon" [ngClass]="iconClasses"></tri-icon>
    <ng-content select="input"></ng-content>
  `
})
export class InputIconComponent {
  get iconClasses(): string[] {
    const classes = [
      `size-${this.inputDirective.size}`,
      this.iconPosition
    ];
    if (this.disabled) {
      classes.push('disabled');
    }
    if (this.clickableIcon) {
      classes.push('clickable');
    }

    return classes;
  }

  @Input() icon: string;
  @Input() iconPack = 'eva';
  @Input() clickableIcon = false;
  @Input() @HostBinding('class.show-icon') showIcon = true;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() disabled: boolean;

  @HostBinding('class.icon-left')
  get isIconLeft(): boolean {
    return this.iconPosition === 'left';
  }

  @HostBinding('class.icon-right')
  get isIconRight(): boolean {
    return this.iconPosition === 'right';
  }

  @ContentChild(InputDirective) inputDirective: InputDirective;
}
