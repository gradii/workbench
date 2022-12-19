import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { TriDialogService } from '@gradii/triangle/dialog';
import { TooltipDirective } from '@gradii/triangle/tooltip';

import { DataFormatModalComponent } from './data-format-modal.component';

@Component({
  selector: 'ub-data-format-hint',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./data-format-hint.component.scss'],
  template: `
    <button triButton ghost size="tiny" triTooltip="Show Data Format" (click)="showModal()">
      <tri-icon name="question-mark-circle-outline"></tri-icon>
    </button>
  `
})
export class DataFormatHintComponent {
  @Input() formatExample: any;
  @Input() dataFormatType: string;

  @ViewChild(TooltipDirective) tooltip: TooltipDirective;

  constructor(private dialogService: TriDialogService) {
  }

  showModal(): void {
    this.dialogService.open(DataFormatModalComponent, {
      context: {
        formatExample: this.formatExample,
        dataFormatType: this.dataFormatType
      }
    });
  }
}
