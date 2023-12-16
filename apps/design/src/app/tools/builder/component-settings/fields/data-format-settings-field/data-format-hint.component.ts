import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { NbDialogService, NbTooltipDirective } from '@nebular/theme';

import { DataFormatModalComponent } from './data-format-modal.component';

@Component({
  selector: 'ub-data-format-hint',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./data-format-hint.component.scss'],
  template: `
    <button nbButton ghost size="tiny" nbTooltip="Show Data Format" (click)="showModal()">
      <bc-icon name="question-mark-circle-outline"></bc-icon>
    </button>
  `
})
export class DataFormatHintComponent {
  @Input() formatExample: any;
  @Input() dataFormatType: string;

  @ViewChild(NbTooltipDirective) tooltip: NbTooltipDirective;

  constructor(private dialogService: NbDialogService) {
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
