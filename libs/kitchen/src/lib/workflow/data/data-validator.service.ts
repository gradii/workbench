import { Injectable } from '@angular/core';
import { KitchenComponent } from '@common/public-api';

import { NotValidError } from './exception';
import { DefinitionsService } from '../../definitions/definitions.service';

export type KitchenDataValidator = (data: any, component: KitchenComponent) => boolean;

@Injectable({ providedIn: 'root' })
export class DataValidator {
  constructor(private definitions: DefinitionsService) {
  }

  validate(component: KitchenComponent, data: any): null | string {
    const definition = this.definitions.getDefinition(component.definitionId);

    if (!definition.dataConsumer) {
      throw new Error('Data Validator: cannot validate component data as it is not marked as dataConsumer: true');
    }
    if (!definition.dataValidator) {
      throw new Error('Data Validator: dataValidator must be provided');
    }

    const validator = definition.dataValidator;
    let error = null;

    try {
      validator(data, component);
    } catch (e) {
      if (e instanceof NotValidError) {
        error = e.message;
      }
    }
    return error;
  }
}
