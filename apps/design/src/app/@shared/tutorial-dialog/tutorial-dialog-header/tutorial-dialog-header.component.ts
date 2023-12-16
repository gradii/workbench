import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-tutorial-dialog-header',
  templateUrl: './tutorial-dialog-header.component.html',
  styleUrls: ['./tutorial-dialog-header.component.scss']
})
export class TutorialDialogHeaderComponent {
  @Input() icon: string;
  @Input() title: string;

  @Output() close = new EventEmitter();
}
