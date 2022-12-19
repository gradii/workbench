import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { PuffComponentUpdate } from '@tools-state/component/component.model';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';
import { PuffFeature, PuffFeatureUpdate } from '../../@tools-state/feature/feature.model';

@Component({
  selector       : 'pf-component-inspection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <ng-template pfEditor
                 [selectedBreakpoint]="getSelectedBreakpoint$|async"
                 (componentBinding)="updateComponent($event)"
                 (addFeatureBinding)="addFeature($event)"
                 (featureBinding)="updateFeature($event)"
    ></ng-template>
  `
})
export class ComponentInspectionComponent {
  getSelectedBreakpoint$ = getSelectedBreakpoint;

  constructor(private componentFacade: ComponentFacade) {
  }

  updateComponent(update: PuffComponentUpdate) {
    this.componentFacade.updateComponent(update);
  }

  // addFeature()
  addFeature(feature: PuffFeature) {
    this.componentFacade.addFeature(feature);
  }

  updateFeature(update: PuffFeatureUpdate) {
    this.componentFacade.updateFeature(update);
  }

  updateSlot(update: PuffComponentUpdate) {
    // this.componentFacade.addFeature(update)
  }
}
