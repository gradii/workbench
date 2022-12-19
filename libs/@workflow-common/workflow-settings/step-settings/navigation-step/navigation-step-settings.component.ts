import { mark } from '@angular/compiler-cli/src/ngtsc/perf/src/clock';
import {
  ChangeDetectionStrategy,
  ɵmarkDirty,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  StepType,
  WorkflowStep,
  WorkflowStepParameter,
  NavigationParameterType,
  getStepParametersConfig
} from '@common/public-api';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, filter, tap } from 'rxjs/operators';

import { StepUtilService } from '@tools-state/data/step-util.service';
import { StepSettingsView } from '../step-settings.component';
import { ItemSource } from '@tools-shared/code-editor/used-value.service';

@Component({
  selector       : 'ub-navigation-step-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <form [formGroup]="formGroup">
      <label class="workflow-column workflow-label">
        Page Path
        <ub-code-editor
          formControlName="url"
          [oneLine]="true"
          syntax="text"
          [allowPages]="true"
          [prevStepType]="prevStepType"
        ></ub-code-editor>
        <div class="errors">
          <span *ngIf="formGroup.dirty && url.errors?.required">URL is required.</span>
          <span *ngIf="url.errors?.external">External links are not supported</span>
        </div>
      </label>

      <tri-tab-group class="step-settings-tabset">
        <tri-tab title="Query Params">
          <ub-http-params-control
            formControlName="queryParams"
            addButtonText="Add query param"
            [prevStepType]="prevStepType"
          >
          </ub-http-params-control>
        </tri-tab>
      </tri-tab-group>
    </form>
  `
})
export class NavigationStepSettingsComponent implements StepSettingsView, OnInit, OnDestroy {
  selected: string;

  formGroup: UntypedFormGroup = this.fb.group({
    url        : ['', [this.urlValidator()]],
    newWindow  : [false],
    queryParams: []
  });

  @Input() prevStepType: StepType | ItemSource.EVENT = ItemSource.EVENT;

  @Input() set step(step: WorkflowStep) {
    this._step                                                           = step;
    const { url, queryParams }: { [key: string]: WorkflowStepParameter } = getStepParametersConfig(
      step.params,
      Object.values(NavigationParameterType)
    );

    this.formGroup.patchValue(
      {
        url        : url.value,
        queryParams: this.stepUtils.prepareCustomParam(queryParams)
      },
      { emitEvent: false }
    );
  }

  @Output() paramsChange: EventEmitter<WorkflowStepParameter[]> = new EventEmitter<WorkflowStepParameter[]>();

  get url() {
    return this.formGroup.get('url');
  }

  private destroyed = new Subject<void>();
  private _step: WorkflowStep;

  constructor(private fb: UntypedFormBuilder, private stepUtils: StepUtilService) {
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(
        tap(() => ɵmarkDirty(this)),
        filter(() => this.formGroup.valid),
        takeUntil(this.destroyed)
      )
      .subscribe(() => {
        const paramsToUpdate = this.stepUtils.updateParameters(this._step.params, {
          [NavigationParameterType.URL]         : { value: this.url.value },
          [NavigationParameterType.QUERY_PARAMS]: {
            value: this.stepUtils.parseCustomParam(this.formGroup.controls.queryParams.value)
          }
        });
        this.paramsChange.emit(paramsToUpdate);
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  private urlValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) {
        return { required: true };
      }
      if (/^(http[s]?).*$/.test(value)) {
        return { external: true };
      }
      return null;
    };
  }
}
