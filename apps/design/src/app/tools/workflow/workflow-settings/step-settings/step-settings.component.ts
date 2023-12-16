import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { StepType, WorkflowStep, WorkflowStepParameter } from '@common';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ItemSource } from '@tools-shared/code-editor/used-value.service';
import { CodeStepSettingsComponent } from './code-step/code-step-settings.component';
import { AsyncCodeStepSettingsComponent } from './async-code-step/async-code-step-settings.component';
import { HttpStepSettingsComponent } from './http-step/http-step-settings.component';
import { NavigationStepSettingsComponent } from './navigation-step/navigation-step-settings.component';
import { SaveStepSettingsComponent } from './save-step/save-step-settings.component';
import { ToggleSidebarStepSettingsComponent } from './toggle-sidebar-step/toggle-sidebar-step-settings.component';
import { SaveLocalStepSettingsComponent } from './save-local-step/save-local-step-settings.component';
import { ExecuteActionStepSettingsComponent } from './execute-action-step/execute-action-step-settings.component';
import { ConditionStepSettingsComponent } from './condition-step/condition-step-settings.component';
import { WorkflowUtilsService } from '@tools-state/data/workflow/workflow-utils.service';

const stepSettingsMap = {
  [StepType.CUSTOM_ASYNC_CODE]: AsyncCodeStepSettingsComponent,
  [StepType.CUSTOM_CODE]: CodeStepSettingsComponent,
  [StepType.TOGGLE_SIDEBAR]: ToggleSidebarStepSettingsComponent,
  [StepType.HTTP_REQUEST]: HttpStepSettingsComponent,
  [StepType.PUT_IN_STORE]: SaveStepSettingsComponent,
  [StepType.PUT_IN_LOCAL_STORAGE]: SaveLocalStepSettingsComponent,
  [StepType.NAVIGATION]: NavigationStepSettingsComponent,
  [StepType.EXECUTE_ACTION]: ExecuteActionStepSettingsComponent,
  [StepType.CONDITION]: ConditionStepSettingsComponent
};

export interface StepSettingsView {
  step: WorkflowStep;
  prevStepType: StepType | ItemSource.EVENT;
  paramsChange: EventEmitter<WorkflowStepParameter[]>;
}

@Component({
  selector: 'ub-step-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ng-container #stepSettings></ng-container> `
})
export class StepSettingsComponent implements OnDestroy {
  @Input() set stepInfo(info: { steps: WorkflowStep[]; workflowId: string; stepId: string }) {
    const step = this.workflowUtilService.getStepById(info.steps, info.stepId);
    const prevStepType = this.stepType;
    const prevStepId = this.stepId;
    const prevResultType = this.workflowUtilService.getPreviousResultType(info.steps, info.stepId);

    this.stepType = step.type;
    this.stepId = step.id;
    this.workflowId = info.workflowId;

    if (prevStepType === this.stepType && prevStepId === this.stepId && this.componentRef) {
      this.componentRef.instance.prevStepType = prevResultType;
      this.componentRef.instance.step = step;
    } else {
      this.container.clear();
      this.unsubscribeFromOutput();
      if (step.type in stepSettingsMap) {
        this.showSettingsComponent(step, prevResultType);
      }
    }
  }

  stepId: string;
  stepType: StepType;
  workflowId: string;

  @Output() paramsChange: EventEmitter<WorkflowStepParameter[]> = new EventEmitter<WorkflowStepParameter[]>();

  @ViewChild('stepSettings', { static: true, read: ViewContainerRef }) container;

  private componentRef: ComponentRef<StepSettingsView>;
  private outputSubscription: Subscription;

  private destroy$ = new Subject<void>();

  constructor(private resolver: ComponentFactoryResolver, private workflowUtilService: WorkflowUtilsService) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    this.unsubscribeFromOutput();
  }

  private showSettingsComponent(step: WorkflowStep, prevResultType: StepType) {
    const factory: ComponentFactory<StepSettingsView> = this.resolver.resolveComponentFactory(
      stepSettingsMap[step.type]
    );
    this.componentRef = this.container.createComponent(factory);
    if (prevResultType) {
      this.componentRef.instance.prevStepType = prevResultType;
    }
    this.componentRef.instance.step = step;
    this.outputSubscription = this.componentRef.instance.paramsChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: WorkflowStepParameter[]) => this.paramsChange.emit(params));
  }

  private unsubscribeFromOutput() {
    if (this.outputSubscription) {
      this.outputSubscription.unsubscribe();
      this.outputSubscription = null;
    }
  }
}
