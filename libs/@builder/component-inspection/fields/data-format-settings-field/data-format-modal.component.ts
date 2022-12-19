import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TriDialogRef } from '@gradii/triangle/dialog';
import stringifyObject from 'stringify-object';

@Component({
  selector       : 'pf-data-format-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./data-format-modal.component.scss'],
  template       : `
    <tri-card class="data-format-modal">
      <tri-card-header class="data-format-modal-header">
        <label class="card-title"><span>Data format</span> ({{ dataFormatType }})</label>
        <button triButton ghost size="xsmall" (click)="closeModal()">
          <tri-icon svgIcon="workbench:close-outline"></tri-icon>
        </button>
      </tri-card-header>
      <tri-card-body>
        <ub-simple-code-editor syntax="json" [text]="getFormatExample()" [readonly]="true"></ub-simple-code-editor>
      </tri-card-body>
    </tri-card>
  `
})
export class DataFormatModalComponent {
  @Input() formatExample: any;
  @Input() dataFormatType: string;

  constructor(private dialogRef: TriDialogRef<DataFormatModalComponent>) {
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  getFormatExample(): string {
    return stringifyObject(this.formatExample, {
      indent              : '  ',
      singleQuotes        : true,
      inlineCharacterLimit: this.dataFormatType === 'Smart Table Data' ? 1 : 80
    });
  }
}
