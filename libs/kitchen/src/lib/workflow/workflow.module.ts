import { NgModule } from '@angular/core';
import { BakeryCommonModule } from '@common/public-api';

import { CodeExecutorService } from './steps/code-executor.service';
import { AsyncCodeExecutorService } from './steps/async-code-executor.service';
import { NavigationExecutorService } from './steps/navigation-executor.service';
import { PutInStoreExecutorService } from './steps/put-in-store-executor.service';
import { RequestExecutorService } from './steps/request-executor.service';
import { ConditionCodeExecutorService } from './steps/condition-code-executor.service';
import { ExecutorUtilService } from './util/executor-util.service';
import { SidebarToggleExecutorService } from './steps/sidebar-toggle-executor.service';
import { StepExecutorRegistry } from './step-executor-registry.service';
import { ScopeService } from './util/scope.service';
import { WorkflowLogger } from './util/workflow-logger.service';
import { WorkflowExecutorService } from './workflow-executor.service';
import { WorkflowRegistryService } from './workflow-registry.service';
import { STEP_EXECUTOR } from './workflow.utils';
import { PutInLocalStorageExecutorService } from './steps/put-in-local-storage-executor.service';
import { ExecuteActionExecutorService } from './steps/execute-action-executor.service';

@NgModule({
  imports: [BakeryCommonModule],
  providers: [
    WorkflowExecutorService,
    WorkflowRegistryService,
    ExecutorUtilService,
    StepExecutorRegistry,
    WorkflowLogger,
    ScopeService,

    { provide: STEP_EXECUTOR, useClass: CodeExecutorService, multi: true },
    { provide: STEP_EXECUTOR, useClass: AsyncCodeExecutorService, multi: true },
    { provide: STEP_EXECUTOR, useClass: PutInStoreExecutorService, multi: true },
    { provide: STEP_EXECUTOR, useClass: PutInLocalStorageExecutorService, multi: true },
    { provide: STEP_EXECUTOR, useClass: SidebarToggleExecutorService, multi: true },
    { provide: STEP_EXECUTOR, useClass: RequestExecutorService, multi: true },
    { provide: STEP_EXECUTOR, useClass: NavigationExecutorService, multi: true },
    { provide: STEP_EXECUTOR, useClass: ExecuteActionExecutorService, multi: true },
    { provide: STEP_EXECUTOR, useClass: ConditionCodeExecutorService, multi: true }
  ]
})
export class WorkflowModule {
}
