import { Component } from '@angular/core';
import { TriDialogRef } from '@gradii/triangle/dialog';


@Component({
  selector: 'add-custom-trigger',
  template: `
    <tri-card>
      <tri-card-header>
        Add Custom Trigger
      </tri-card-header>
      <tri-card-body>
        <form>
          <tri-form-field>
            <input name="triggerName" tri-input [(ngModel)]="triggerName" placeholder="Trigger Name" />
          </tri-form-field>
        </form>
      </tri-card-body>
      <tri-card-footer>
        <button tri-button [type]="'primary'" (click)="addTrigger()">
          Add
        </button>
      </tri-card-footer>
    </tri-card>
  `,
  styles  : [
    `
    `
  ]
})
export class AddCustomTriggerComponent {
  triggerName: string = '';

  constructor(private dialogRef: TriDialogRef<any>) {
  }

  addTrigger() {
    this.dialogRef.close(this.triggerName);
  }
}