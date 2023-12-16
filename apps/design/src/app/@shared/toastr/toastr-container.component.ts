import { Component, QueryList, ViewChildren } from '@angular/core';
import { NbToastrContainerComponent } from '@nebular/theme';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastComponent } from '@shared/toastr/toast.component';

const voidState = style({
  transform: 'translateY(-0.25rem)',
  marginLeft: '0',
  marginRight: '0',
  marginTop: '0',
  marginBottom: '-0.25rem',
  opacity: '0'
});

const defaultOptions = { params: { direction: '' } };

@Component({
  selector: 'ub-toastr-container',
  styleUrls: ['./toastr-container.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [voidState, animate(125)], defaultOptions),
      transition(':leave', [animate(125, voidState)], defaultOptions)
    ])
  ],
  template: ` <ub-toast [@fadeIn]="fadeIn" *ngFor="let toast of content" [toast]="toast"></ub-toast> `
})
export class ToastrContainerComponent extends NbToastrContainerComponent {
  @ViewChildren(ToastComponent) toasts: QueryList<ToastComponent>;
}
