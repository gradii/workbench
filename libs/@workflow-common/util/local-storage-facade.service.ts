import { Injectable, OnDestroy } from '@angular/core';
import {
  getStepParametersConfig, LocalStorageItem, ProjectLocalStorageService, PutInLocalStorageParameterType, StepType,
  Workflow, WorkflowStep, WorkflowStepParameter
} from '@common/public-api';
import { CommunicationService } from '@shared/communication/communication.service';
import { WorkflowFacade } from '@tools-state/data/workflow/workflow-facade.service';
import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class LocalStorageFacadeService implements OnDestroy {
  private destroyed: Subject<void> = new Subject<void>();

  constructor(
    private localStorageUtils: ProjectLocalStorageService,
    private workflowFacade: WorkflowFacade,
    private projectFacade: ProjectFacade,
    private communication: CommunicationService
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }

  attach(): void {
    this.updateWorkflowItems();

    this.communication.updateLocalStorageItem$
      .pipe(withLatestFrom(this.projectFacade.activeProjectId$), takeUntil(this.destroyed))
      .subscribe(([item, projectId]: [LocalStorageItem, string]) => {
        this.localStorageUtils.saveItem(item, projectId);
        this.updateWorkflowItems();
      });
  }

  getWorkflowItems(): Observable<LocalStorageItem[]> {
    // loop through every workflow step and figure out `workflow` local storage items
    return this.workflowFacade.workflowList$.pipe(
      take(1),
      withLatestFrom(this.projectFacade.activeProjectId$),
      map(([workflowList, projectId]: [Workflow[], string]) =>
        this.getWorkflowStorageItemLists(workflowList, projectId)
      ),
      map((storageList: LocalStorageItem[]) => this.removeDuplicates(storageList)),
      takeUntil(this.destroyed)
    );
  }

  private getStepLocalStorageItems(workflow: Workflow, projectId: string): LocalStorageItem[] {
    return workflow.steps
      .filter(wf => wf.type === StepType.PUT_IN_LOCAL_STORAGE)
      .map((step: WorkflowStep) => {
        const params: { [key: string]: WorkflowStepParameter } = getStepParametersConfig(
          step.params,
          Object.values(PutInLocalStorageParameterType)
        );
        const nameParam: WorkflowStepParameter = params[PutInLocalStorageParameterType.STORAGE_ITEM_ID];
        const valueParam: WorkflowStepParameter = params[PutInLocalStorageParameterType.VALUE];

        const valueInLocalStorage = this.localStorageUtils.getItem(nameParam.value, projectId);
        const result: LocalStorageItem = {
          ...valueInLocalStorage,
          name: nameParam.value,
          value: valueParam.value
        };
        return result;
      });
  }

  private getWorkflowStorageItemLists(workflowList: Workflow[], projectId: string): LocalStorageItem[] {
    return workflowList.map((workflow: Workflow) => this.getStepLocalStorageItems(workflow, projectId)).flat();
  }

  private updateWorkflowItems() {
    this.getWorkflowItems()
      .pipe(take(1), takeUntil(this.destroyed))
      .subscribe((storageList: LocalStorageItem[]) => this.communication.setLocalStorageItems(storageList));
  }

  private removeDuplicates(list: LocalStorageItem[]): LocalStorageItem[] {
    return list.filter((item: LocalStorageItem, pos: number, arr: LocalStorageItem[]) => {
      return item.name && arr.map(i => i.name).indexOf(item.name) === pos;
    });
  }
}
