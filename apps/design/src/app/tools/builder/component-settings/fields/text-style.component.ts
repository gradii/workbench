import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-text-style-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./text-style.component.scss'],
  template: `
    <ub-button-group-settings-field
      name="Alignment"
      [showStyleNotification]="false"
      [value]="alignment"
      [options]="alignmentOptions"
      (valueChange)="propertiesChange.emit({ alignment: $event })"
    >
    </ub-button-group-settings-field>
    <div class="style-row">
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
    </div>
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
    { icon: 'text-italic', value: 'italic' },
    { icon: 'text-bold', value: 'bold' }
  ];

  alignmentOptions = [
    { icon: 'text-left', value: 'left' },
    { icon: 'text-center', value: 'center' },
    { icon: 'text-right', value: 'right' },
    { icon: 'text-justify', value: 'justify' }
  ];

  decorationOptions = [
    { icon: 'text-underline', value: 'underline' },
    { icon: 'text-strikethrough', value: 'strikethrough' },
    { icon: 'text-overline', value: 'overline' }
  ];

  transformOptions = [
    { label: 'none', value: 'none' },
    { icon: 'text-uppercase', label: 'uppercase', value: 'uppercase' },
    { icon: 'text-lowercase', label: 'lowercase', value: 'lowercase' },
    { icon: 'text-capitalize', label: 'capitalize', value: 'capitalize' }
  ];

  updateTextStyle(bindingName: string) {
    this.propertiesChange.emit({ [bindingName]: !this.properties[bindingName] });
  }

  toggleDecoration(value: string) {
    const updatedValue = this.decoration === value ? null : value;
    this.propertiesChange.emit({ decoration: updatedValue });
  }
}
