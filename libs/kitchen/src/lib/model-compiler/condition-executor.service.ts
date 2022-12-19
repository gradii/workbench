import { Injectable } from '@angular/core';
import { ComponentLogicPropName, InterpolationType, KitchenComponent, Scope } from '@common/public-api';

import { InterpolateService } from '../workflow/util/interpolate.service';

@Injectable({ providedIn: 'root' })
export class ConditionExecutorService {
  constructor(private interpolateService: InterpolateService) {
  }

  shouldRenderComponent(component: KitchenComponent, preview: boolean, scope: Scope): boolean {
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
