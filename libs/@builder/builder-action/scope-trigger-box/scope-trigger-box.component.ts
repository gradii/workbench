import { Component } from '@angular/core';
import { TriDialogService } from '@gradii/triangle/dialog';
import { AddScopeTriggerComponent } from '../dialogs/add-scope-trigger.component';

@Component({
  selector : 'pf-scope-trigger-box',
  template : `
    <div class="scope-trigger-box">
      <form>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <input size="small" triInput placeholder="Simple placeholder" value="init" required>
        </tri-form-field>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <input size="small" triInput placeholder="Simple placeholder" value="do check" required>
        </tri-form-field>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <input size="small" triInput placeholder="Simple placeholder" value="on changes" required>
        </tri-form-field>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <input size="small" triInput placeholder="Simple placeholder" value="after view init" required>
        </tri-form-field>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <input size="small" triInput placeholder="Simple placeholder" value="form button clicked" required>
        </tri-form-field>
      </form>
      <button class="add-scope-trigger" triButton color="success" ghost size="xsmall" (click)="addScopeTrigger()">Add
        <tri-icon svgIcon="outline:plus"></tri-icon>
      </button>
    </div>
  `,
  styleUrls: ['./scope-trigger-box.component.scss']
})
export class ScopeTriggerBoxComponent {
  constructor(
    private dialogService: TriDialogService,
  ) {
  }

  addScopeTrigger() {
    this.dialogService.open(AddScopeTriggerComponent, {});
  }
}