import { Injectable } from '@angular/core';
import { ComponentLogicPropName, InterpolationType, OvenComponent, Scope } from '@common';

import { InterpolateService } from '../workflow/util/interpolate.service';

@Injectable({ providedIn: 'root' })
export class ConditionExecutorService {
  constructor(private interpolateService: InterpolateService) {
  }

  shouldRenderComponent(component: OvenComponent, preview: boolean, scope: Scope): boolean {
    if (!preview) {
      return true;
    }

    const conditionCode: string = component.properties[ComponentLogicPropName.CONDITION_PROPERTY];

    if (!conditionCode) {
      return true;
    }

    return this.interpolateService.interpolateSafe(conditionCode, scope, InterpolationType.CODE);
  }
}
