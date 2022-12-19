import { Component, ɵdetectChanges } from '@angular/core';

import { InputIconComponent } from './input-icon.component';

@Component({
  selector : 'bc-password-input-icon',
  styleUrls: ['./input-icon.component.scss'],
  template : `
    <tri-icon (click)="togglePassword()"
              [svgIcon]="hidden ? 'outline:eye-invisible' : 'outline:eye'" [ngClass]="iconClasses">
    </tri-icon>
    <ng-content select="input"></ng-content>
  `,
  exportAs : 'passwordInputIcon'
})
export class PasswordInputIconComponent extends InputIconComponent {
  hidden        = true;
  clickableIcon = true;

  constructor() {
    super();
  }

  togglePassword() {
    this.hidden = !this.hidden;
    ɵdetectChanges(this);
  }
}
