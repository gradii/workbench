import { Component } from '@angular/core';

@Component({
  selector: 'len-subheader',
  template: `
    <div class="content-wrapper">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./subheader.component.scss']
})
export class SubheaderComponent {
}
