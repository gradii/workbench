import { ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl, ControlValueAccessor, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, NG_VALUE_ACCESSOR
} from '@angular/forms';
import { StepType } from '@common/public-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector       : 'ub-http-params-control',
  styleUrls      : ['./http-params-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers      : [
    {
      provide    : NG_VALUE_ACCESSOR,
      multi      : true,
      useExisting: forwardRef(() => HttpParamsControlComponent)
    }
  ],
  template       : `
    <form [formGroup]="formGroup">
      <div *ngFor="let paramGroup of params.controls; let i = index" formArrayName="params">
        <div class="workflow-row param-row" [formGroupName]="i">
          <div class="workflow-column param-column">
            <tri-select
              triInput
              fullWidth
              formControlName="name"
              [placeholder]="namePlaceholder"
              (valueChange)="selectFromList($event, paramGroup)"
            >
              <tri-option *ngFor="let it of searchOptions" [value]="it.id">{{it.displayValue}}</tri-option>
            </tri-select>
          </div>
          <div class="workflow-column param-column">
            <ub-code-editor
              formControlName="value"
              [oneLine]="true"
              syntax="text"
              [prevStepType]="prevStepType"
            ></ub-code-editor>
          </div>
          <button triButton class="bakery-button workflow-icon" ghost size="xsmall" (click)="deleteParam(i)">
            <tri-icon svgIcon="outline:close"></tri-icon>
          </button>
        </div>
      </div>
      <div class="workflow-row">
        <button
          triButton
          class="add-param-button bakery-button workflow-icon"
          ghost
          fullWidth
          size="xsmall"
          (click)="addParam()"
        >
          {{ addButtonText }}
          <tri-icon svgIcon="outline:plus"></tri-icon>
        </button>
      </div>
    </form>
  `
})
export class HttpParamsControlComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() addButtonText        = 'Add New Param';
  @Input() prevStepType: StepType;
  @Input() searchOptions: any[] = [];
  @Input() namePlaceholder      = 'Enter parameter name';

  formGroup: UntypedFormGroup = this.fb.group({
    params: new UntypedFormArray([])
  });

  destroyed$ = new Subject<void>();

  get params(): UntypedFormArray {
    return this.formGroup.controls.params as UntypedFormArray;
  }

  private totalParamsAmount = 0;
  private avoidEmmit        = false;

  constructor(private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.params.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((params: { name: string; value: string }[]) => {
      if (!this.avoidEmmit) {
        this.onChange(params);
      } else {
        this.avoidEmmit = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  onTouched: () => void = () => {
  };

  onChange: (value: any) => any = () => {
  };

  writeValue(value: { name: string; value: string }[]): void {
    const needLength = value.length;

    this.totalParamsAmount = needLength;
    this.addItemsIfNeed(needLength);

    this.params.patchValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  addParam() {
    this.avoidEmmit = true;
    this.params.push(this.createItem());
  }

  deleteParam(index: number): void {
    this.params.removeAt(index);
  }

  createItem(): UntypedFormGroup {
    return this.fb.group({
      name : [''],
      value: ''
    });
  }

  selectFromList(option: any, paramGroup: AbstractControl) {
    paramGroup.patchValue({ name: option.displayValue });
  }

  private addItemsIfNeed(needLength: number): void {
    while (this.params.length < needLength) {
      this.addParam();
    }
  }
}
