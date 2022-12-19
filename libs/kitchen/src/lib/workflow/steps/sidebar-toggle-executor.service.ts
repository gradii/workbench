import { Injectable } from '@angular/core';
import {
  getStepParametersConfig, Scope, StepType, ToggleParameterType, WorkflowStep, WorkflowStepParameter
} from '@common/public-api';
import { Observable, of } from 'rxjs';

import { StepExecutor } from '../step-executor.model';

export enum ToggleActionType {
  TOGGLE = 'toggle',
  CLOSE  = 'close',
  OPEN   = 'open',
}

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  toggle() {
  }

  collapse() {
  }

  expand() {
  }
}

@Injectable()
export class SidebarToggleExecutorService implements StepExecutor {
  type = StepType.TOGGLE_SIDEBAR;

  private paramTypes: string[] = Object.values(ToggleParameterType);

  constructor(private sidebarService: SidebarService) {
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
