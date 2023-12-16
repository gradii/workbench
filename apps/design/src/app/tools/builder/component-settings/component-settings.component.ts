import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { BakeryComponentUpdate } from '@tools-state/component/component.model';

@Component({
  selector: 'ub-component-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ng-template ubSettings (binding)="updateComponent($event)"></ng-template> `
})
export class ComponentSettingsComponent {
  constructor(private componentFacade: ComponentFacade) {
  }

  updateComponent(update: BakeryComponentUpdate) {
    this.componentFacade.updateComponent(update);
  }
}
