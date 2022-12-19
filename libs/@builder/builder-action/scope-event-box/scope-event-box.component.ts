import { Component } from '@angular/core';


@Component({
  selector: 'pf-scope-event-box',
  template: `
    <div class="scope-event-box">
      <form>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <tri-checkbox triPrefix></tri-checkbox>
          <input size="small" triInput placeholder="Simple placeholder" value="output" required>
        </tri-form-field>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <tri-checkbox triPrefix></tri-checkbox>
          <input size="small" triInput placeholder="Simple placeholder" value="output1" required>
        </tri-form-field>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <tri-checkbox triPrefix></tri-checkbox>
          <input size="small" triInput placeholder="Simple placeholder" value="output2" required>
        </tri-form-field>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <tri-checkbox triPrefix></tri-checkbox>
          <input size="small" triInput placeholder="Simple placeholder" value="output3" required>
        </tri-form-field>
        <tri-form-field variant="fill" [labelOrientation]="'vertical'">
          <tri-checkbox triPrefix></tri-checkbox>
          <input size="small" triInput placeholder="Simple placeholder" value="output4" required>
        </tri-form-field>
      </form>
    </div>
  `,
  styleUrls: ['./scope-event-box.component.scss'],
})
export class ScopeEventBoxComponent {

}