import { Injectable } from '@angular/core';
import {
  getStepParametersConfig,
  StepType,
  ToggleParameterType,
  WorkflowStep,
  WorkflowStepParameter,
  Scope
} from '@common';
import { NbSidebarService } from '@nebular/theme';
import { Observable, of } from 'rxjs';

import { StepExecutor } from '../step-executor.model';

export enum ToggleActionType {
  TOGGLE = 'toggle',
  CLOSE = 'close',
  OPEN = 'open',
}

@Injectable()
export class SidebarToggleExecutorService implements StepExecutor {
  type = StepType.TOGGLE_SIDEBAR;

  private paramTypes: string[] = Object.values(ToggleParameterType);

  constructor(private sidebarService: NbSidebarService) {
  }

  execute(scope: Scope, step: WorkflowStep): Observable<any> {
    const stepParameters = step.params;

    const params: { [name: string]: WorkflowStepParameter } = getStepParametersConfig(stepParameters, this.paramTypes);

    const actionTypeParam: WorkflowStepParameter = params[ToggleParameterType.ACTION_TYPE];

    const actionTypeName = actionTypeParam.value;

    if (actionTypeName === ToggleActionType.TOGGLE) {
      this.sidebarService.toggle();
    } else if (actionTypeName === ToggleActionType.CLOSE) {
      this.sidebarService.collapse();
    } else if (actionTypeName === ToggleActionType.OPEN) {
      this.sidebarService.expand();
    }

    return of(null);
  }
}
