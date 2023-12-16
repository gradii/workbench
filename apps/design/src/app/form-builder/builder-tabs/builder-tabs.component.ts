import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { TemplateChanges } from '../app-changes';
import { FormTemplate } from '../form-template';
import { NbTabComponent } from '@nebular/theme';
import { AnalyticsService } from '@common';

@Component({
  selector: 'app-builder-tabs',
  styleUrls: ['./builder-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-tabset class="tabs" fullWidth (changeTab)="onTabChanged($event)">
      <nb-tab tabIcon="browser" tabId="choose_template">
        <app-templates-list
          *ngIf="templates"
          [templates]="templates"
          [selectedTemplate]="selectedTemplate"
          (selectTemplate)="selectCurrentTemplate($event)"
        >
        </app-templates-list>
      </nb-tab>

      <nb-tab tabIcon="edit" tabId="config_fields">
        <app-fields-configurator
          *ngIf="selectedTemplate"
          (changeTemplate)="changeCurrentTemplate($event)"
          [app]="selectedTemplate.app"
        >
        </app-fields-configurator>
      </nb-tab>

      <nb-tab tabIcon="color-palette" tabId="config_color">
        <app-styles-configurator
          *ngIf="selectedTemplate"
          (changeTemplate)="changeCurrentTemplate($event)"
          [theme]="selectedTemplate.app.theme"
        >
        </app-styles-configurator>
      </nb-tab>
    </nb-tabset>
  `
})
export class BuilderTabsComponent {
  @Input() templates: FormTemplate[];
  @Input() selectedTemplate: FormTemplate;

  @Output() selectTemplate = new EventEmitter<FormTemplate>();
  @Output() changeTemplate = new EventEmitter<TemplateChanges>();

  constructor(private analyticsService: AnalyticsService) {
  }

  selectCurrentTemplate(template: FormTemplate): void {
    this.selectTemplate.emit(template);
  }

  changeCurrentTemplate(event): void {
    this.changeTemplate.emit(event);
  }

  onTabChanged(currentTab: NbTabComponent): void {
    this.analyticsService.logFormBuilderOpenTab(currentTab.tabId);
  }
}
