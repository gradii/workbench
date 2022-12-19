import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector       : 'ub-text-style-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./text-style.component.scss'],
  template       : `
    <ub-button-group-settings-field
      name="Alignment"
      [showStyleNotification]="false"
      [value]="alignment"
      [options]="alignmentOptions"
      (valueChange)="propertiesChange.emit({ alignment: $event })"
    >
    </ub-button-group-settings-field>
    <ub-button-group-settings-field
      name="Style"
      [showStyleNotification]="false"
      [values]="styleValues"
      [options]="styleOptions"
      (valueChange)="updateTextStyle($event)"
    >
    </ub-button-group-settings-field>
    <ub-dropdown-settings-field
      name="Transform"
      [showStyleNotification]="false"
      [selected]="transform"
      [options]="transformOptions"
      (selectedChange)="propertiesChange.emit({ transform: $event })"
    >
    </ub-dropdown-settings-field>
    <ub-button-group-settings-field
      name="Decoration"
      [showStyleNotification]="false"
      [value]="decoration"
      [options]="decorationOptions"
      (valueChange)="toggleDecoration($event)"
    >
    </ub-button-group-settings-field>
  `
})
export class TextStyleComponent {
  @Input() alignment: string;
  @Input() properties: any;
  @Input() transform: string;
  @Input() decoration: string;

  get styleValues(): string[] {
    return this.styleOptions.filter(option => this.properties[option.value]).map(option => option.value);
  }

  @Output() propertiesChange = new EventEmitter();

  styleOptions = [
    { icon: 'workbench:text-italic', value: 'italic' },
    { icon: 'workbench:text-bold', value: 'bold' }
  ];

  alignmentOptions = [
    { icon: 'workbench:text-left', value: 'left' },
    { icon: 'workbench:text-center', value: 'center' },
    { icon: 'workbench:text-right', value: 'right' },
    { icon: 'workbench:text-justify', value: 'justify' }
  ];

  decorationOptions = [
    { icon: 'workbench:text-underline', value: 'underline' },
    { icon: 'workbench:text-strikethrough', value: 'strikethrough' },
    { icon: 'workbench:text-overline', value: 'overline' }
  ];

  transformOptions = [
    { label: 'none', value: 'none' },
    { icon: 'workbench:text-uppercase', label: 'uppercase', value: 'uppercase' },
    { icon: 'workbench:text-lowercase', label: 'lowercase', value: 'lowercase' },
    { icon: 'workbench:text-capitalize', label: 'capitalize', value: 'capitalize' }
  ];

  updateTextStyle(bindingName: string) {
    this.propertiesChange.emit({ [bindingName]: !this.properties[bindingName] });
  }

  toggleDecoration(value: string) {
    const updatedValue = this.decoration === value ? null : value;
    this.propertiesChange.emit({ decoration: updatedValue });
  }
}
