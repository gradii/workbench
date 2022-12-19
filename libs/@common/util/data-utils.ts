import { WorkflowStepParameter } from '../models/data.models';
// import { KitchenStyles } from '../models/kitchen.models';
// import { BreakpointWidth } from '../models/responsive';
// import { breakpointsOrdering, getBreakpointOrder } from '../responsive/styles-compiler.service';
// import { getDeepValue } from './object-util';

// Find and return { `paramType`: WorkflowStepParameter } in according with `paramTypes`
export function getStepParametersConfig(
  stepParameters: WorkflowStepParameter[],
  paramTypes: string[]
): { [key: string]: WorkflowStepParameter } {
  return stepParameters
    .filter(stepParam => paramTypes.includes(stepParam.type))
    .reduce((result, stepParam) => {
      return { ...result, [stepParam.type]: stepParam };
    }, {});
}
