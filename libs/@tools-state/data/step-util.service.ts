import { Injectable } from '@angular/core';
import { WorkflowStepParameter } from '@common/public-api';

@Injectable({ providedIn: 'root' })
export class StepUtilService {
  updateParameters(params, changes: { [paramType: string]: any }): WorkflowStepParameter[] {
    return params.map((param: WorkflowStepParameter) => {
      if (changes.hasOwnProperty(param.type)) {
        return { ...param, ...changes[param.type] };
      }
      return param;
    });
  }

  prepareCustomParam(param: WorkflowStepParameter): { name: string; value: string }[] {
    const customParams = param.value.map(customParam => ({
      name: customParam.name,
      value: customParam.value
    }));
    if (customParams.length < 1) {
      customParams.push({ name: '', value: '' });
    }
    return customParams;
  }

  parseCustomParam(params: { name: string; value: string }[]) {
    return params.filter(param => param.name || param.value);
  }

  getActualParamsLength(params: { name: string; value: string }[]): number {
    return params.filter(param => !!param.name || !!param.value).length;
  }
}
