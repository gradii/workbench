import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BakeryComponent } from '@tools-state/component/component.model';

import { ComponentSettingsService } from '../component-settings.service';

@Component({
  selector: 'ub-component-type-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./component-type-field.component.scss'],
  template: `
    <bc-icon class="icon" [name]="iconName$ | async"></bc-icon>
    <span class="component-type-name">{{ componentLabel$ | async }}</span>
  `
})
export class ComponentTypeFieldComponent {
  @Input()
  set component(component: BakeryComponent) {
    this.componentLabel$ = this.componentSettingsService
      .getComponentLabel(component.parentSlotId)
      .pipe(map(label => label || component.definitionId));

    this.iconName$ = this.componentLabel$.pipe(
      map((label: string) => this.componentSettingsService.getComponentIconName(component.definitionId, label))
    );
  }

  componentLabel$: Observable<string>;
  iconName$: Observable<string>;

  constructor(private componentSettingsService: ComponentSettingsService) {
  }
}
