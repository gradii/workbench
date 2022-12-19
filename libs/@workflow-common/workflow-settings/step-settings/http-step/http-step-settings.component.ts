import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ɵmarkDirty
} from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  BodyType, getStepParametersConfig, HttpRequestParameterType, StepType, WorkflowStep, WorkflowStepParameter
} from '@common/public-api';
import { TriTab } from '@gradii/triangle/tabs';
import { ItemSource } from '@tools-shared/code-editor/used-value.service';

import { StepUtilService } from '@tools-state/data/step-util.service';
import { combineLatest, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { StepSettingsView } from '../step-settings.component';
import { httpRequestHeaderNames } from './data';

const NO_START_HTTP_REGEX = /^(?!\s*http:.*$).*/i;

@Component({
  selector       : 'ub-http-step-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./http-step-settings.component.scss'],
  template       : `
    <form [formGroup]="formGroup">
      <div class="workflow-row">
        <label class="workflow-column method item-name workflow-label">
          Method
          <tri-select formControlName="method" class="method-select" placeholder="Enter name">
            <tri-option *ngFor="let method of methodOptions" [value]="method">{{ method }}</tri-option>
          </tri-select>
        </label>

        <label class="workflow-column url item-name workflow-label">
          URL
          <ub-code-editor
            formControlName="url"
            [oneLine]="true"
            syntax="text"
            [prevStepType]="prevStepType"
          ></ub-code-editor>
          <div class="errors">
            <span *ngIf="formGroup.dirty && url.errors?.required">URL is required.</span>
            <!--            <span *ngIf="formGroup.dirty && url.errors?.pattern">API must be accessible over https.</span>-->
          </div>
        </label>
      </div>

      <tri-tab-group class="step-settings-tabset" (changeTab)="changeTab($event)">
        <tri-tab
          [title]="headersTab.title"
          [name]="headersTab.id"
          [disabled]="headersTab.disabled"
        >
          <ub-http-params-control
            formControlName="headers"
            addButtonText="Add New Header"
            namePlaceholder="Enter header name"
            [searchOptions]="headerSearchOptions"
            [prevStepType]="prevStepType"
          ></ub-http-params-control>
        </tri-tab>

        <tri-tab
          [title]="bodyTab.title"
          [name]="bodyTab.id"
          [disabled]="bodyTab.disabled"
        >
          <tri-radio-group class="body-type-value" formControlName="bodyType">
            <label tri-radio [value]="bodyTypeValues.RAW">Raw</label>
            <label tri-radio [value]="bodyTypeValues.OBJECT">JS Object</label>
          </tri-radio-group>

          <ub-code-editor formControlName="body" [prevStepType]="prevStepType" [syntax]="bodySyntax"></ub-code-editor>
        </tri-tab>

        <tri-tab
          [title]="queryParamsTab.title"
          [name]="queryParamsTab.id"
          [disabled]="queryParamsTab.disabled"
        >
          <ub-http-params-control
            formControlName="queryParams"
            addButtonText="Add New Param"
            [prevStepType]="prevStepType"
          ></ub-http-params-control>
        </tri-tab>
      </tri-tab-group>

      <tri-checkbox formControlName="withCredentials" class="with-credentials">With credentials</tri-checkbox>
    </form>
  `
})
export class HttpStepSettingsComponent implements StepSettingsView, OnDestroy, OnInit {
  bodySyntax: 'text' | 'json' = 'text';
  bodyTypeValues              = BodyType;

  @Input() prevStepType: StepType | ItemSource.EVENT = ItemSource.EVENT;

  @Input() set step(step: WorkflowStep) {
    this._step = step;

    const {
            url,
            method,
            body,
            bodyType,
            headers,
            queryParams,
            withCredentials
          }: { [key: string]: WorkflowStepParameter } = getStepParametersConfig(
      step.params,
      Object.values(HttpRequestParameterType)
    );

    this.formGroup.patchValue(
      {
        url            : url.value,
        method         : method.value,
        body           : body.value,
        bodyType       : bodyType.value,
        headers        : this.stepUtils.prepareCustomParam(headers),
        queryParams    : this.stepUtils.prepareCustomParam(queryParams),
        withCredentials: withCredentials.value
      },
      { emitEvent: false }
    );
  }

  @Output() paramsChange: EventEmitter<WorkflowStepParameter[]> = new EventEmitter<WorkflowStepParameter[]>();

  formGroup: UntypedFormGroup = this.fb.group({
    url            : ['', [Validators.required]], /*, Validators.pattern(NO_START_HTTP_REGEX)*/
    method         : ['GET', [Validators.required]],
    body           : [''],
    bodyType       : [BodyType.RAW],
    headers        : [],
    queryParams    : [],
    withCredentials: [false]
  });

  get url() {
    return this.formGroup.get('url');
  }

  get method() {
    return this.formGroup.get('method');
  }

  get body() {
    return this.formGroup.get('body');
  }

  get headers(): UntypedFormArray {
    return this.formGroup.get('headers') as UntypedFormArray;
  }

  get queryParams(): UntypedFormArray {
    return this.formGroup.get('queryParams') as UntypedFormArray;
  }

  get withCredentials() {
    return this.formGroup.get('withCredentials');
  }

  get bodyType() {
    return this.formGroup.get('bodyType');
  }

  private destroyed$ = new Subject<void>();

  methodOptions = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'OPTIONS', 'PATCH'];

  headersTab: any = {
    title : 'Headers',
    id    : 'headers',
    active: true
  };

  bodyTab: any = {
    title: 'Body',
    id   : 'body'
  };

  queryParamsTab: any = {
    title: 'Query Params',
    id   : 'queryParams'
  };

  activeTabId = 'headers';

  headerSearchOptions: any[] = [];

  private _step: WorkflowStep;

  constructor(private fb: UntypedFormBuilder, private stepUtils: StepUtilService) {
  }

  ngOnInit(): void {
    this.formGroup.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => this.updateParams());

    combineLatest([
      this.formGroup.controls.method.valueChanges,
      this.formGroup.controls.headers.valueChanges,
      this.formGroup.controls.queryParams.valueChanges
    ])
      .pipe(startWith(null), takeUntil(this.destroyed$))
      .subscribe(() => this.updateTabsInfo());

    this.fillHeaderSearchOptions();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  changeTab(selectedTab: TriTab) {
    this.activeTabId = selectedTab.tabName;
  }

  updateParams() {
    this.updateTabsInfo();

    ɵmarkDirty(this);

    if (this.formGroup.invalid) {
      return;
    }

    const paramsToUpdate = this.stepUtils.updateParameters(this._step.params, {
      [HttpRequestParameterType.URL]             : { value: this.url.value },
      [HttpRequestParameterType.METHOD]          : { value: this.method.value },
      [HttpRequestParameterType.BODY]            : { value: this.body.value },
      [HttpRequestParameterType.BODY_TYPE]       : { value: this.bodyType.value },
      [HttpRequestParameterType.HEADERS]         : { value: this.stepUtils.parseCustomParam(this.headers.value) },
      [HttpRequestParameterType.QUERY_PARAMS]    : { value: this.stepUtils.parseCustomParam(this.queryParams.value) },
      [HttpRequestParameterType.WITH_CREDENTIALS]: { value: this.withCredentials.value }
    });
    this.paramsChange.emit(paramsToUpdate);
  }

  updateTabsInfo() {
    this.updateBodyTab();
    this.updateHeadersTab();
    this.updateQueryParamsTab();
  }

  private updateBodyTab() {
    const disableBody = ['GET', 'HEAD'].includes(this.formGroup.controls.method.value);
    const tab         = this.bodyTab;

    this.bodyTab = {
      ...tab,
      disabled: disableBody
    };

    if (this.activeTabId === tab.id && disableBody) {
      this.activeTabId = this.headersTab.id;
    }

    this.bodySyntax = this.bodyType.value === BodyType.OBJECT ? 'json' : 'text';
  }

  private updateHeadersTab() {
    const length = this.stepUtils.getActualParamsLength(this.headers.value);
    const tab    = this.headersTab;

    this.headersTab = {
      ...tab,
      title: `Headers (${length})`
    };
  }

  private updateQueryParamsTab() {
    const length = this.stepUtils.getActualParamsLength(this.queryParams.value);
    const tab    = this.queryParamsTab;

    this.queryParamsTab = {
      ...tab,
      title: `Query Params (${length})`
    };
  }

  private fillHeaderSearchOptions() {
    for (const headerName of httpRequestHeaderNames) {
      this.headerSearchOptions.push({
        displayValue: headerName,
        filterValues: [headerName]
      });
    }
  }
}
