import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import stringifyObject from 'stringify-object';

@Component({
  selector: 'ub-data-format-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./data-format-modal.component.scss'],
  template: `
    <nb-card class="data-format-modal">
      <nb-card-header class="data-format-modal-header">
        <label class="card-title"><span>Data format</span> ({{ dataFormatType }})</label>
        <button nbButton ghost size="tiny" (click)="closeModal()">
          <bc-icon name="close-outline"></bc-icon>
        </button>
      </nb-card-header>
      <nb-card-body>
        <ub-simple-code-editor syntax="json" [text]="getFormatExample()" [readonly]="true"></ub-simple-code-editor>
      </nb-card-body>
    </nb-card>
  `
})
export class DataFormatModalComponent {
  @Input() formatExample: any;
  @Input() dataFormatType: string;

  constructor(private dialogRef: NbDialogRef<DataFormatModalComponent>) {
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  getFormatExample(): string {
    return stringifyObject(this.formatExample, {
      indent: '  ',
      singleQuotes: true,
      inlineCharacterLimit: this.dataFormatType === 'Smart Table Data' ? 1 : 80
    });
  }
}
