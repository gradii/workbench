import { authActionType } from './action-types/auth-action-type';
import { basicActionType } from './action-types/basic-action-type';
import { componentActionType } from './action-types/component-action-type';
import { formActionType } from './action-types/form-action-type';
import { functionActionType } from './action-types/function-action-type';
import { httpActionType } from './action-types/http-action-type';
import { logicActionType } from './action-types/logic-action-type';
import { observableActionType } from './action-types/observable-action-type';
import { triggerActionType } from './action-types/trigger-action-type';


export const ActionType = [
  triggerActionType,
  componentActionType,
  basicActionType,
  functionActionType,
  logicActionType,
  httpActionType,
  formActionType,
  authActionType,
  observableActionType
];