import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { FormTemplate } from '../form-template';

@Component({
  selector: 'app-template',
  styleUrls: ['./template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class.selected]="selected">
      <img [attr.src]="template.preview" [alt]="template.name + ' template'" />
    </div>
  `
})
export class TemplateComponent {
  @Input() template: FormTemplate;
  @Input() selected: boolean;
}
