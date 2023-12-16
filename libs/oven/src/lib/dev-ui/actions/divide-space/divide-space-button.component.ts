import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { DivideSpaceType } from '@common';

import { DivideSpaceDialogDirective } from './divide-space-dialog.directive';

@Component({
  selector: 'oven-divide-space-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../action-button.scss'],
  styles: [
    `
      :host {
        display: flex;
      }
    `
  ],
  template: `
    <button
      nbButton
      class="action-button clear-icon"
      size="tiny"
      [ovenDivideSpaceDialog]="relativeTo"
      (layoutClick)="divide.emit($event)"
      (click)="dialog.toggle()"
    >
      <bc-icon name="layout"></bc-icon>
    </button>
  `
})
export class DivideSpaceButtonComponent implements OnDestroy {
  @Input() relativeTo: ElementRef;

  @ViewChild(DivideSpaceDialogDirective) dialog: DivideSpaceDialogDirective;

  @Output() divide: EventEmitter<DivideSpaceType> = new EventEmitter<DivideSpaceType>();

  ngOnDestroy() {
    this.dialog.hide();
  }
}
