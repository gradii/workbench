import { ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { BcInputSearchOption, StepType } from '@common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ub-http-params-control',
  styleUrls: ['./http-params-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HttpParamsControlComponent)
    }
  ],
  template: `
    <form [formGroup]="formGroup">
      <div *ngFor="let paramGroup of params.controls; let i = index" formArrayName="params">
        <div class="workflow-row param-row" [formGroupName]="i">
          <div class="workflow-column param-column">
            <input
              nbInput
              fullWidth
              bcInputSearch
              formControlName="name"
              [placeholder]="namePlaceholder"
              [searchOptions]="searchOptions"
              (selectValue)="selectFromList($event, paramGroup)"
            />
          </div>
          <div class="workflow-column param-column">
            <ub-code-editor
              formControlName="value"
              [oneLine]="true"
              syntax="text"
              [prevStepType]="prevStepType"
            ></ub-code-editor>
          </div>
          <button nbButton class="bakery-button workflow-icon" ghost size="tiny" (click)="deleteParam(i)">
            <nb-icon icon="close-outline"></nb-icon>
          </button>
        </div>
      </div>
      <div class="workflow-row">
        <button
          nbButton
          class="add-param-button bakery-button workflow-icon"
          ghost
          fullWidth
          size="tiny"
          (click)="addParam()"
        >
          {{ addButtonText }}
          <nb-icon icon="plus-outline"></nb-icon>
        </button>
      </div>
    </form>
  `
})
export class HttpParamsControlComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() addButtonText = 'Add New Param';
  @Input() prevStepType: StepType;
  @Input() searchOptions: BcInputSearchOption[] = [];
  @Input() namePlaceholder = 'Enter parameter name';

  formGroup: FormGroup = this.fb.group({
    params: new FormArray([])
  });

  destroyed$ = new Subject();

  get params(): FormArray {
    return this.formGroup.controls.params as FormArray;
  }

  private totalParamsAmount = 0;
  private avoidEmmit = false;

  constructor(private fb: FormBuilder) {
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

  createItem(): FormGroup {
    return this.fb.group({
      name: [''],
      value: ''
    });
  }

  selectFromList(option: BcInputSearchOption, paramGroup: AbstractControl) {
    paramGroup.patchValue({ name: option.displayValue });
  }

  private addItemsIfNeed(needLength: number): void {
    while (this.params.length < needLength) {
      this.addParam();
    }
  }
}
