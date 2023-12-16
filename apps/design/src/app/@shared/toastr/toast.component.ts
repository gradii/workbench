import { Component } from '@angular/core';
import { NbToastComponent } from '@nebular/theme';

@Component({
  selector: 'ub-toast',
  styleUrls: ['./toast.component.scss'],
  template: `
    <div class="icon-container" *ngIf="hasIcon && icon">
      <nb-icon [config]="iconConfig"></nb-icon>
    </div>
    <div class="content-container">
      <span class="message">{{ toast.message }}</span>
    </div>
  `
})
export class ToastComponent extends NbToastComponent {
}
