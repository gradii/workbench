import { Component, Input } from '@angular/core';


@Component({
  selector: 'dt-show-request-modal',
  template: `
    <div></div>
  `
})
export class ShowRequestModalComponent {
  @Input() data: any;

  requestId: string;

  content: string;

}
