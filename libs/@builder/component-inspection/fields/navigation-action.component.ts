import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PuffComponent } from '@tools-state/component/component.model';

interface LinkBindingDefinition {
  path: string;
  external: boolean;
  pageId?: string;
}

@Component({
  selector: 'ub-navigation-settings-field-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ub-data-field
      syntax="text"
      label="Link"
      [oneLine]="true"
      [resizable]="false"
      [component]="component"
      [allowPages]="true"
      [value]="code"
      (valueChange)="update($event)"
    >
    </ub-data-field>
  `
})
export class NavigationActionSettingsFieldComponent {
  @Input() value: LinkBindingDefinition;
  @Input() component: PuffComponent;
  @Output() valueChange: EventEmitter<LinkBindingDefinition> = new EventEmitter<LinkBindingDefinition>();

  update(path: string): void {
    const external: boolean = this.isExternal(path);
    this.valueChange.emit({ path, external });
  }

  get code(): string {
    return this.value?.path || '';
  }

  private isExternal(path: string): boolean {
    // Checks whether path starts with http or https
    return /(http(s?)):\/\//i.test(path);
  }
}
