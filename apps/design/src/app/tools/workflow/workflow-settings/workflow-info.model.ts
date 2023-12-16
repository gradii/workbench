import {
  CustomCodeParameterType,
  CustomAsyncCodeParameterType,
  HttpRequestParameterType,
  ParameterValueType,
  PutInStoreParameterType,
  StepType,
  ToggleParameterType,
  NavigationParameterType,
  WorkflowStepParameter,
  PutInLocalStorageParameterType,
  ConditionParameterType,
  WorkflowStep,
  ExecuteActionParameterType,
  Scope,
  BodyType
} from '@common';

export interface StepInfo {
  nameLabel: string;
  descriptionLabel: string;
  iconActive: string;
  iconInactive: string;

  parametersFactory(info: { prevStepType: StepType; subSteps: WorkflowStep[] }): WorkflowStepParameter[];
}

export type StepInfoConfig = {
  [key in StepType]: StepInfo;
};

export const stepInfo: StepInfoConfig = {
  [StepType.DRAFT]: {
    nameLabel: 'New step',
    descriptionLabel: 'Choose step type',
    iconActive: 'workflow-draft-step-active',
    iconInactive: 'workflow-draft-step',
    parametersFactory() {
      return [];
    }
  },
  [StepType.TOGGLE_SIDEBAR]: {
    nameLabel: 'Toggle Sidebar',
    descriptionLabel: 'System action',
    iconActive: 'workflow-sidebar-step-active',
    iconInactive: 'workflow-sidebar-step',
    parametersFactory() {
      return [
        {
          type: ToggleParameterType.ACTION_TYPE,
          value: 'toggle',
          valueType: ParameterValueType.STRING
        }
      ];
    }
  },
  [StepType.CUSTOM_CODE]: {
    nameLabel: 'Code',
    descriptionLabel: 'Data mapping, sorting, filtering',
    iconActive: 'workflow-code-step-active',
    iconInactive: 'workflow-code-step',
    parametersFactory(info: { prevStepType: StepType; subSteps: WorkflowStep[] }) {
      const previous = !info.prevStepType ? Scope.PARAM : `${Scope.RESULT}.data`;
      return [
        {
          type: CustomCodeParameterType.CODE,
          value: `return {{${previous}}};`,
          valueType: ParameterValueType.INTERPOLATED_VALUE
        }
      ];
    }
  },
  [StepType.CUSTOM_ASYNC_CODE]: {
    nameLabel: 'Async Code',
    descriptionLabel: 'Requests, async logic',
    iconActive: 'workflow-code-step-active',
    iconInactive: 'workflow-code-step',
    parametersFactory(info: { prevStepType: StepType; subSteps: WorkflowStep[] }) {
      const previous = !info.prevStepType ? Scope.PARAM : `${Scope.RESULT}.data`;
      return [
        {
          type: CustomAsyncCodeParameterType.ASYNC_CODE,
          value: `return await {{${previous}}};`,
          valueType: ParameterValueType.INTERPOLATED_VALUE
        }
      ];
    }
  },
  [StepType.CONDITION]: {
    nameLabel: 'Condition',
    descriptionLabel: 'Add condition to the action steps flow',
    iconActive: 'condition-active',
    iconInactive: 'condition-inactive',
    parametersFactory(info: { prevStepType: StepType; subSteps: WorkflowStep[] }) {
      const previous = !info.prevStepType ? Scope.PARAM : `${Scope.RESULT}.data`;
      return [
        {
          type: ConditionParameterType.CODE,
          value: `return !!{{${previous}}};`,
          valueType: ParameterValueType.INTERPOLATED_VALUE
        },
        {
          type: ConditionParameterType.STEPS,
          value: [
            {
              condition: true,
              steps: info.subSteps || []
            },
            {
              condition: false,
              steps: []
            }
          ],
          valueType: ParameterValueType.CUSTOM
        }
      ];
    }
  },
  [StepType.HTTP_REQUEST]: {
    nameLabel: 'HTTP request',
    descriptionLabel: 'Send a request to the server',
    iconActive: 'workflow-http-step-active',
    iconInactive: 'workflow-http-step',
    parametersFactory() {
      return [
        {
          type: HttpRequestParameterType.METHOD,
          value: 'GET',
          valueType: ParameterValueType.STRING
        },
        {
          type: HttpRequestParameterType.URL,
          value: '',
          valueType: ParameterValueType.INTERPOLATED_VALUE
        },
        {
          type: HttpRequestParameterType.HEADERS,
          value: [],
          valueType: ParameterValueType.CUSTOM
        },
        {
          type: HttpRequestParameterType.QUERY_PARAMS,
          value: [],
          valueType: ParameterValueType.CUSTOM
        },
        {
          type: HttpRequestParameterType.BODY,
          value: '',
          valueType: ParameterValueType.INTERPOLATED_VALUE
        },
        {
          type: HttpRequestParameterType.BODY_TYPE,
          value: BodyType.RAW,
          valueType: ParameterValueType.STRING
        },
        {
          type: HttpRequestParameterType.WITH_CREDENTIALS,
          value: false,
          valueType: ParameterValueType.STRING
        }
      ];
    }
  },
  [StepType.PUT_IN_STORE]: {
    nameLabel: 'Save Data to App State',
    descriptionLabel: 'Put previous result to App State',
    iconActive: 'workflow-save-step-active',
    iconInactive: 'workflow-save-step',
    parametersFactory(info: { prevStepType: StepType; subSteps: WorkflowStep[] }) {
      const previous = !info.prevStepType ? Scope.PARAM : `${Scope.RESULT}.data`;
      return [
        {
          type: PutInStoreParameterType.STORE_ITEM_ID,
          value: '',
          valueType: ParameterValueType.STRING
        },
        {
          type: PutInStoreParameterType.VALUE,
          value: `{{${previous}}}`,
          valueType: ParameterValueType.INTERPOLATED_VALUE
        }
      ];
    }
  },
  [StepType.PUT_IN_LOCAL_STORAGE]: {
    nameLabel: 'Save Data to Local Storage',
    descriptionLabel: 'Put previous result to Local Storage',
    iconActive: 'workflow-save-local-step-active',
    iconInactive: 'workflow-save-local-step',
    parametersFactory(info: { prevStepType: StepType; subSteps: WorkflowStep[] }) {
      const previous = !info.prevStepType ? Scope.PARAM : `${Scope.RESULT}.data`;
      return [
        {
          type: PutInLocalStorageParameterType.STORAGE_ITEM_ID,
          value: '',
          valueType: ParameterValueType.STRING
        },
        {
          type: PutInLocalStorageParameterType.VALUE,
          value: `{{${previous}}}`,
          valueType: ParameterValueType.INTERPOLATED_VALUE
        }
      ];
    }
  },
  [StepType.NAVIGATION]: {
    nameLabel: 'Navigation',
    descriptionLabel: 'Navigate to a page',
    iconActive: 'workflow-navigation-step-active',
    iconInactive: 'workflow-navigation-step',
    parametersFactory() {
      return [
        {
          type: NavigationParameterType.URL,
          value: '',
          valueType: ParameterValueType.INTERPOLATED_VALUE
        },
        {
          type: NavigationParameterType.QUERY_PARAMS,
          value: [],
          valueType: ParameterValueType.CUSTOM
        }
      ];
    }
  },
  [StepType.EXECUTE_ACTION]: {
    nameLabel: 'Execute Action',
    descriptionLabel: 'Execute Another Action',
    iconActive: 'workflow-execute-action-step-active',
    iconInactive: 'workflow-execute-action-step',
    parametersFactory() {
      return [
        {
          type: ExecuteActionParameterType.ACTION,
          value: '',
          valueType: ParameterValueType.CUSTOM
        }
      ];
    }
  }
};
