import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormTemplate } from '../form-template';
import { AnalyticsService } from '@common';

@Component({
  selector: 'app-templates-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./templates-list.component.scss'],
  template: `
    <h3 class="title">Choose template</h3>
    <app-template
      *ngFor="let template of templates"
      [template]="template"
      [selected]="selectedTemplate.id === template.id"
      (click)="select(template)"
    >
    </app-template>
  `
})
export class TemplatesListComponent {
  @Input() templates: FormTemplate[];
  @Input() selectedTemplate: FormTemplate;

  @Output() selectTemplate = new EventEmitter<FormTemplate>();

  constructor(private analyticsService: AnalyticsService) {
  }

  select(template: FormTemplate) {
    this.analyticsService.logFormBuilderChooseTemplate(template.name, template.id);
    this.selectTemplate.emit(template);
  }
}
