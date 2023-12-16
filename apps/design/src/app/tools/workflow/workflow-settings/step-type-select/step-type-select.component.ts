import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { StepType, WorkflowStep } from '@common';
import { NbSelectComponent } from '@nebular/theme';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { stepInfo, StepInfoConfig } from '../workflow-info.model';

@Component({
  selector: 'ub-step-type-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./step-type-select.component.scss'],
  template: `
    <nb-select [formControl]="stepTypeControl">
      <nb-select-label>
        <ub-step-item [stepItem]="stepInfo[stepTypeControl.value]"></ub-step-item>
      </nb-select-label>
      <nb-option *ngFor="let stepType of stepTypes" class="step-type-option" [ngClass]="[stepType]" [value]="stepType">
        <ub-step-item
          *ngIf="isValidStepType(stepType)"
          [stepItem]="stepInfo[stepType]"
          [isActive]="stepType === stepTypeControl.value"
        >
        </ub-step-item>
      </nb-option>
    </nb-select>
  `
})
export class StepTypeSelectComponent implements AfterViewInit, OnDestroy {
  @Input() set step(step: WorkflowStep) {
    this.showSelectComponent.next(step.type === StepType.DRAFT);
    this.stepLevel = step.level;

    setTimeout(() => this.stepTypeControl.patchValue(step.type, { emitEvent: false }));
  }

  @Output() changeType: EventEmitter<StepType> = new EventEmitter<StepType>();
  @ViewChild(NbSelectComponent) selectComponent: NbSelectComponent;

  showSelectComponent = new BehaviorSubject<boolean>(false);
  stepInfo: StepInfoConfig = stepInfo;
  stepTypeControl: FormControl = new FormControl(StepType.DRAFT);
  stepTypes: string[] = Object.keys(stepInfo);

  private stepLevel: number;
  private MAX_STEP_LEVEL = 2;
  private destroyed$ = new Subject();

  ngAfterViewInit() {
    this.showSelectComponent
      .asObservable()
      .pipe(filter(Boolean), takeUntil(this.destroyed$))
      .subscribe(show => {
        // we need to open select when step type is draft, but nebular show doesn't work
        setTimeout(() => {
          if (this.stepTypeControl.value === StepType.DRAFT) {
            this.selectComponent.show();
            this.selectComponent.positionStrategy.apply();
          }
        });
      });

    this.stepTypeControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(type => this.changeType.emit(type));
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  isValidStepType(stepType: string): boolean {
    return !(stepType === StepType.DRAFT || (stepType === StepType.CONDITION && this.stepLevel >= this.MAX_STEP_LEVEL));
  }
}
