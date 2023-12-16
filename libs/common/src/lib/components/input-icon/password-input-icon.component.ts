import { ChangeDetectorRef, Component } from '@angular/core';

import { InputIconComponent } from './input-icon.component';

@Component({
  selector: 'bc-password-input-icon',
  styleUrls: ['./input-icon.component.scss'],
  template: `
    <nb-icon (click)="togglePassword()" pack="eva" [icon]="hidden ? 'eye-off' : 'eye'" [ngClass]="iconClasses">
    </nb-icon>
    <ng-content select="input"></ng-content>
  `,
  exportAs: 'passwordInputIcon'
})
export class PasswordInputIconComponent extends InputIconComponent {
  hidden = true;
  clickableIcon = true;

  constructor(private cd: ChangeDetectorRef) {
    super();
  }

  togglePassword() {
    this.hidden = !this.hidden;
    this.cd.detectChanges();
  }
}
