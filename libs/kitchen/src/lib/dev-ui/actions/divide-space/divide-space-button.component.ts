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
import { DivideSpaceType } from '@common/public-api';

import { DivideSpaceDialogDirective } from './divide-space-dialog.directive';

@Component({
  selector: 'kitchen-divide-space-button',
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
      triButton
      class="action-button clear-icon"
      size="xsmall"
      [kitchenDivideSpaceDialog]="relativeTo"
      (layoutClick)="divide.emit($event)"
      (click)="dialog.toggle()"
    >
      <tri-icon svgIcon="outline:layout"></tri-icon>
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
