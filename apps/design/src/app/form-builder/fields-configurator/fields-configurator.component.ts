import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FieldsConfiguratorService } from './fields-configurator.service';
import { ComponentChange, TemplateChanges } from '../app-changes';
import { BakeryApp } from '@tools-state/app/app.model';
import { BakeryComponent } from '@tools-state/component/component.model';
import { AnalyticsService, BreakpointWidth } from '@common';

@Component({
  selector: 'app-field',
  template: `
    <div class="form-group" *ngIf="components.length">
      <label class="label">{{ groupName }}</label>
      <input
        *ngFor="let component of components; let i = index; trackBy: trackById"
        (keyup)="update($event.target['value'], i)"
        (blur)="logToAnalytics()"
        [value]="getValue(component)"
        nbInput
        fieldSize="medium"
        type="text"
        fullWidth
      />
    </div>
  `,
  styleUrls: ['./fields-configurator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldComponent {
  @Input() components: BakeryComponent[] = [];
  @Input() groupName: string;
  @Input() bindingKey: string | string[];
  @Input() styleKey: string[];
  @Output() valueChange = new EventEmitter<(string | number)[]>();

  constructor(private analyticsService: AnalyticsService) {
  }

  trackById(item: BakeryComponent): string {
    return item.id;
  }

  update(value: string, i: number): void {
    this.valueChange.emit([value, i]);
  }

  getValue(component: BakeryComponent): void {
    if (this.styleKey) {
      return this.styleKey.reduce((acc, cur) => (acc ? acc[cur] : acc), component.styles.xl);
    }
    if (typeof this.bindingKey === 'string') {
      return component.properties[this.bindingKey];
    }
    return this.bindingKey.reduce((acc, cur) => (acc ? acc[cur] : acc), component.properties);
  }

  logToAnalytics(): void {
    this.analyticsService.logFormBuilderConfigFields(this.groupName);
  }
}

@Component({
  selector: 'app-fields-configurator',
  templateUrl: './fields-configurator.component.html',
  styleUrls: ['./fields-configurator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldsConfiguratorComponent {
  images: BakeryComponent[];
  headings: BakeryComponent[];
  buttons: BakeryComponent[];
  links: BakeryComponent[];
  labels: BakeryComponent[];
  inputs: BakeryComponent[];
  checkboxes: BakeryComponent[];
  radios: BakeryComponent[];
  spaceWithBackground: BakeryComponent[];

  @Input() set app(app: BakeryApp) {
    this.images = this.fieldsConfiguratorService.getComponents(app, 'image');
    this.headings = this.fieldsConfiguratorService.getComponents(app, 'heading');
    this.buttons = this.fieldsConfiguratorService.getComponents(app, 'button');
    this.links = this.fieldsConfiguratorService.getComponents(app, 'link');
    this.labels = this.fieldsConfiguratorService.getComponents(app, 'text');
    this.inputs = this.fieldsConfiguratorService.getComponents(app, 'input');
    this.checkboxes = this.fieldsConfiguratorService.getComponents(app, 'checkbox');
    this.radios = this.fieldsConfiguratorService.getComponents(app, 'radio');
    this.spaceWithBackground = this.fieldsConfiguratorService
      .getComponents(app, 'space')
      .filter(d => d.styles.xl.background && d.styles.xl.background.imageSrc && d.styles.xl.background.imageSrc.url);
  }

  @Output() changeTemplate = new EventEmitter<TemplateChanges>();

  constructor(private fieldsConfiguratorService: FieldsConfiguratorService) {
  }

  updateComponentText(event: [string, number], components: BakeryComponent[]) {
    this.updateComponentProperty(event, components, 'text');
  }

  updateComponentLabel(event: [string, number], components: BakeryComponent[]) {
    this.updateComponentProperty(event, components, 'label');
  }

  updateComponentProperty(event: [string, number], components: BakeryComponent[], property: string) {
    const [changeValue, i] = event;
    components[i].properties[property] = changeValue;
    const changes = this.fieldsConfiguratorService.updateValue(components[i], property, i);
    this.emitChanges(changes);
  }

  updateImage(event: [string, number], components: BakeryComponent[]) {
    const [changeValue, i] = event;
    components[i].styles[BreakpointWidth.Desktop].src.url = changeValue;
    const changes = this.fieldsConfiguratorService.updateStyle(components[i], 'src', i);
    this.emitChanges(changes);
  }

  updateBackgroundImage(event: [string, number], components: BakeryComponent[]) {
    const [changeValue, i] = event;
    components[i].styles[BreakpointWidth.Desktop].background.imageSrc.url = changeValue;
    const changes = this.fieldsConfiguratorService.updateStyle(components[i], 'background', i);
    this.emitChanges(changes);
  }

  private emitChanges(changes: ComponentChange[]) {
    this.changeTemplate.emit({ componentChanges: changes });
  }
}
