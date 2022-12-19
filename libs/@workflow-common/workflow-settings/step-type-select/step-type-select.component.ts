import {
  AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, ViewChild
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { StepType, WorkflowStep } from '@common/public-api';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { ComponentActions } from '@tools-state/component/component.actions';

import { stepInfo, StepInfoConfig } from '../workflow-info.model';
import { WorkingAreaFacade } from '@tools-state/working-area/working-area-facade.service';
import { WorkingAreaWorkflowMode } from '@tools-state/working-area/working-area.model';
import { TriSelect } from '@gradii/triangle/select';

@Component({
  selector       : 'ub-step-type-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./step-type-select.component.scss'],
  template       : `
    <tri-select [formControl]="stepTypeControl">
      <tri-select-trigger>
        <ub-step-item [stepItem]="stepInfo[stepTypeControl.value]"></ub-step-item>
      </tri-select-trigger>
      <tri-option *ngFor="let stepType of stepTypes" class="step-type-option" [ngClass]="[stepType]" [value]="stepType">
        <ub-step-item
          *ngIf="isValidStepType(stepType)"
          [stepItem]="stepInfo[stepType]"
          [isActive]="stepType === stepTypeControl.value"
        >
        </ub-step-item>
      </tri-option>
    </tri-select>
  `
})
export class StepTypeSelectComponent implements AfterViewInit, OnDestroy {
  @Input() set step(step: WorkflowStep) {
    this.showSelectComponent.next(step.type === StepType.DRAFT);
    this.stepLevel = step.level;

    setTimeout(() => this.stepTypeControl.patchValue(step.type, { emitEvent: false }));
  }

  @Output() changeType: EventEmitter<StepType> = new EventEmitter<StepType>();
  @ViewChild(TriSelect) selectComponent: TriSelect;

  showSelectComponent          = new BehaviorSubject<boolean>(false);
  stepInfo: StepInfoConfig     = stepInfo;
  stepTypeControl: UntypedFormControl = new UntypedFormControl(StepType.DRAFT);
  stepTypes: string[]          = Object.keys(stepInfo);

  private stepLevel: number;
  private MAX_STEP_LEVEL = 2;
  private destroyed$     = new Subject<void>();

  constructor(private workingAreaFacade: WorkingAreaFacade) {
  }

  ngAfterViewInit() {
    this.showSelectComponent
      .asObservable()
      .pipe(filter(Boolean), takeUntil(this.destroyed$))
      .subscribe(show => {
        // we need to open select when step type is draft, but nebular show doesn't work
        setTimeout(() => {
          if (this.stepTypeControl.value === StepType.DRAFT) {
            this.selectComponent.open();
            // this.selectComponent.positionStrategy.apply();
          }
        });
      });

    this.stepTypeControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(type => this.changeType.emit(type));

    this.workingAreaFacade.workingAreaworkflowMode$.pipe(
      takeUntil(this.destroyed$),
      tap((workflowMode: WorkingAreaWorkflowMode) => {
        this.stepTypes = Object.keys(stepInfo).filter(it => stepInfo[it].visible.includes(workflowMode));
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  isValidStepType(stepType: string): boolean {
    return !(stepType === StepType.DRAFT || (stepType === StepType.CONDITION && this.stepLevel >= this.MAX_STEP_LEVEL));
  }
}
