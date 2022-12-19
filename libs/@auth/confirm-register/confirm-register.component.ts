import { Component, EventEmitter, Output } from '@angular/core';

export class ConfirmState {
  constructor(public announcements?: boolean, public terms?: boolean) {
  }
}

@Component({
  selector: 'ub-confirm-register',
  templateUrl: './confirm-register.component.html',
  styleUrls: ['./confirm-register.component.scss']
})
export class ConfirmRegisterComponent {
  confirmState: ConfirmState = {};

  @Output() valueChange: EventEmitter<ConfirmState> = new EventEmitter<ConfirmState>();

  onChange() {
    this.valueChange.emit(this.confirmState);
  }
}
