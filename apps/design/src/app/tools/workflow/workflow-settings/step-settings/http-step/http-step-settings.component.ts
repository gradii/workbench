import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  BcInputSearchOption,
  HttpRequestParameterType,
  StepType,
  WorkflowStep,
  WorkflowStepParameter,
  getStepParametersConfig,
  ParameterValueType,
  BodyType
} from '@common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { NbTabComponent } from '@nebular/theme';

import { StepUtilService } from '@tools-state/data/step-util.service';
import { StepSettingsView } from '../step-settings.component';
import { httpRequestHeaderNames } from './data';
import { ItemSource } from '@tools-shared/code-editor/used-value.service';

const NO_START_HTTP_REGEX = /^(?!\s*http:.*$).*/i;

@Component({
  selector: 'ub-http-step-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./http-step-settings.component.scss'],
  template: `
    <form [formGroup]="formGroup">
      <div class="workflow-row">
        <label class="workflow-column method item-name workflow-label">
          Method
          <nb-select formControlName="method" class="method-select" placeholder="Enter name">
            <nb-option *ngFor="let method of methodOptions" [value]="method">{{ method }}</nb-option>
          </nb-select>
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
            <span *ngIf="formGroup.dirty && url.errors?.pattern">API must be accessible over https.</span>
          </div>
        </label>
      </div>

      <nb-tabset class="step-settings-tabset" (changeTab)="changeTab($event)">
        <nb-tab
          [tabTitle]="headersTab.title"
          [tabId]="headersTab.id"
          [disabled]="headersTab.disabled"
          [active]="headersTab.id === activeTabId"
        >
          <ub-http-params-control
            formControlName="headers"
            addButtonText="Add New Header"
            namePlaceholder="Enter header name"
            [searchOptions]="headerSearchOptions"
            [prevStepType]="prevStepType"
          ></ub-http-params-control>
        </nb-tab>

        <nb-tab
          [tabTitle]="bodyTab.title"
          [tabId]="bodyTab.id"
          [disabled]="bodyTab.disabled"
          [active]="bodyTab.id === activeTabId"
        >
          <nb-radio-group class="body-type-value" formControlName="bodyType">
            <nb-radio [value]="bodyTypeValues.RAW">Raw</nb-radio>
            <nb-radio [value]="bodyTypeValues.OBJECT">JS Object</nb-radio>
          </nb-radio-group>

          <ub-code-editor formControlName="body" [prevStepType]="prevStepType" [syntax]="bodySyntax"> </ub-code-editor>
        </nb-tab>

        <nb-tab
          [tabTitle]="queryParamsTab.title"
          [tabId]="queryParamsTab.id"
          [disabled]="queryParamsTab.disabled"
          [active]="queryParamsTab.id === activeTabId"
        >
          <ub-http-params-control
            formControlName="queryParams"
            addButtonText="Add New Param"
            [prevStepType]="prevStepType"
          ></ub-http-params-control>
        </nb-tab>
      </nb-tabset>

      <nb-checkbox formControlName="withCredentials" class="with-credentials">With credentials</nb-checkbox>
    </form>
  `
})
export class HttpStepSettingsComponent implements StepSettingsView, OnDestroy, OnInit {
  bodySyntax: 'text' | 'json' = 'text';
  bodyTypeValues = BodyType;

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
        url: url.value,
        method: method.value,
        body: body.value,
        bodyType: bodyType.value,
        headers: this.stepUtils.prepareCustomParam(headers),
        queryParams: this.stepUtils.prepareCustomParam(queryParams),
        withCredentials: withCredentials.value
      },
      { emitEvent: false }
    );
  }

  @Output() paramsChange: EventEmitter<WorkflowStepParameter[]> = new EventEmitter<WorkflowStepParameter[]>();

  formGroup: FormGroup = this.fb.group({
    url: ['', [Validators.required, Validators.pattern(NO_START_HTTP_REGEX)]],
    method: ['GET', [Validators.required]],
    body: [''],
    bodyType: [BodyType.RAW],
    headers: [],
    queryParams: [],
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

  get headers(): FormArray {
    return this.formGroup.get('headers') as FormArray;
  }

  get queryParams(): FormArray {
    return this.formGroup.get('queryParams') as FormArray;
  }

  get withCredentials() {
    return this.formGroup.get('withCredentials');
  }

  get bodyType() {
    return this.formGroup.get('bodyType');
  }

  private destroyed$ = new Subject();

  methodOptions = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'OPTIONS', 'PATCH'];

  headersTab: any = {
    title: 'Headers',
    id: 'headers',
    active: true
  };

  bodyTab: any = {
    title: 'Body',
    id: 'body'
  };

  queryParamsTab: any = {
    title: 'Query Params',
    id: 'queryParams'
  };

  activeTabId = 'headers';

  headerSearchOptions: BcInputSearchOption[] = [];

  private _step: WorkflowStep;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef, private stepUtils: StepUtilService) {
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

  changeTab(selectedTab: NbTabComponent) {
    this.activeTabId = selectedTab.tabId;
  }

  updateParams() {
    this.updateTabsInfo();

    this.cd.markForCheck();

    if (this.formGroup.invalid) {
      return;
    }

    const paramsToUpdate = this.stepUtils.updateParameters(this._step.params, {
      [HttpRequestParameterType.URL]: { value: this.url.value },
      [HttpRequestParameterType.METHOD]: { value: this.method.value },
      [HttpRequestParameterType.BODY]: { value: this.body.value },
      [HttpRequestParameterType.BODY_TYPE]: { value: this.bodyType.value },
      [HttpRequestParameterType.HEADERS]: { value: this.stepUtils.parseCustomParam(this.headers.value) },
      [HttpRequestParameterType.QUERY_PARAMS]: { value: this.stepUtils.parseCustomParam(this.queryParams.value) },
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
    const tab = this.bodyTab;

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
    const tab = this.headersTab;

    this.headersTab = {
      ...tab,
      title: `Headers (${length})`
    };
  }

  private updateQueryParamsTab() {
    const length = this.stepUtils.getActualParamsLength(this.queryParams.value);
    const tab = this.queryParamsTab;

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
