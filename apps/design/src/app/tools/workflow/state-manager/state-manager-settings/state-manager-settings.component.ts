import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import stringifyObject from 'stringify-object';

import { COMMON_VARIABLE_NAME_PATTERN, StoreItem, StoreItemType } from '@common';

import { WorkflowDialogService } from '../../dialog/workflow-dialog.service';
import { StoreItemUtilService } from '../../util/store-item-util.service';
import { UniqueStoreItemNameValidator } from '../../util/validator/unique-store-item-name-validator.service';
import { JsonValidator } from '../../util/validator/json.validator';

const initialValueConfig = {
  [StoreItemType.STRING]: 'initialValueString',
  [StoreItemType.BOOLEAN]: 'initialValueBoolean',
  [StoreItemType.NUMBER]: 'initialValueNumber',
  [StoreItemType.OBJECT]: 'initialValueObject',
  [StoreItemType.ARRAY]: 'initialValueArray'
};

const initialFormState = {
  initialValueString: '',
  initialValueNumber: 0,
  initialValueBoolean: false,
  initialValueObject: '{}',
  initialValueArray: '[]'
};

@Component({
  selector: 'ub-state-manager-settings',
  templateUrl: './state-manager-settings.component.html',
  styleUrls: ['./state-manager-settings.component.scss'],
  providers: [UniqueStoreItemNameValidator, JsonValidator]
})
export class StateManagerSettingsComponent implements OnDestroy, OnInit, AfterViewInit {
  @HostBinding('class.nebular-scroll') nebularScroll = true;

  @Input() unSaved: boolean;
  @Input() createMode: boolean;

  @Output() save: EventEmitter<StoreItem> = new EventEmitter<StoreItem>();
  @Output() delete: EventEmitter<StoreItem> = new EventEmitter<StoreItem>();
  @Output() duplicate: EventEmitter<StoreItem> = new EventEmitter<StoreItem>();
  @Output() unsavedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('nameInput', { static: false }) nameInput: ElementRef;

  storeItem: StoreItem;
  // filter without `date` type, not used now
  storeItemTypes = Object.values(StoreItemType).filter(item => item !== StoreItemType.DATE);
  storeItemType = StoreItemType;
  noItems: boolean;

  formGroup: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.pattern(COMMON_VARIABLE_NAME_PATTERN)],
      (ctrl: AbstractControl) => this.uniqueStoreItemNameValidator.validate(ctrl)
    ],
    type: [StoreItemType.STRING, Validators.required],
    initialValueString: [''],
    initialValueNumber: [0],
    initialValueBoolean: [false],
    initialValueObject: ['{}', null, [(ctrl: AbstractControl) => this.jsonValidator.validate(ctrl)]],
    initialValueArray: ['[]', null, [(ctrl: AbstractControl) => this.jsonValidator.validateArray(ctrl)]]
  });

  get name(): AbstractControl {
    return this.formGroup.get('name');
  }

  get type(): AbstractControl {
    return this.formGroup.get('type');
  }

  get initialValueObject(): AbstractControl {
    return this.formGroup.get('initialValueObject');
  }

  get initialValueArray(): AbstractControl {
    return this.formGroup.get('initialValueArray');
  }

  // TODO create pipe
  get storeItemValue(): string {
    let { value } = this.storeItem;
    if (this.storeItem.valueType !== this.type.value) {
      value = this.formGroup.controls[initialValueConfig[this.type.value]].value;
    }

    if (
      this.type.value === StoreItemType.OBJECT ||
      (this.type.value === StoreItemType.ARRAY && typeof value === 'object')
    ) {
      value = this.stringifyObject(value);
    }
    return value;
  }

  private lastSavedStoreItem;
  private destroyed$: Subject<void> = new Subject();

  constructor(
    private workflowDialogService: WorkflowDialogService,
    private storeItemUtils: StoreItemUtilService,
    private uniqueStoreItemNameValidator: UniqueStoreItemNameValidator,
    private jsonValidator: JsonValidator,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.subscribeToSelectedStoreItemChanges();
    this.subscribeToStoreItemListChanges();
    this.updateObjectEditorAfterAsyncValidation();
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  ngAfterViewInit() {
    this.focusNameInput();
    this.subscribeToFormChanges();
  }

  saveStoreItem() {
    if (this.formGroup.invalid) {
      return;
    }
    this.getUpdateStoreItem()
      .pipe(take(1))
      .subscribe(value => this.save.emit(value));
  }

  deleteStoreItem() {
    this.delete.emit(this.storeItem);
  }

  duplicateStoreItem() {
    this.duplicate.emit(this.storeItem);
  }

  private initStoreItem(storeItem: StoreItem) {
    this.storeItemUtils
      .initializeOrCopy(storeItem)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((updatedStoreItem: StoreItem) => {
        this.storeItem = updatedStoreItem;

        this.uniqueStoreItemNameValidator.setOriginalName(this.storeItem.name);
        this.uniqueStoreItemNameValidator.setCreateMode(!storeItem);

        this.updateLastSavedStoreItem(this.storeItem);

        let { initialValue } = this.storeItem;

        if (initialValue && typeof initialValue === 'object') {
          initialValue = this.stringifyObject(initialValue);
        }

        this.formGroup.reset(
          {
            name: this.storeItem.name,
            ...initialFormState,
            [initialValueConfig[this.storeItem.valueType]]: initialValue,
            type: this.storeItem.valueType
          },
          { emitEvent: false }
        );

        this.focusNameInput();
      });
  }

  private checkUnsavedChangesAndEmit() {
    this.hasUnsavedChanges().subscribe(val => {
      this.unsavedChange.emit(val);
      this.cd.markForCheck();
    });
  }

  private hasUnsavedChanges(): Observable<boolean> {
    return this.getUpdateStoreItem().pipe(
      map(newStoreItem => {
        return JSON.stringify(newStoreItem) !== JSON.stringify(this.lastSavedStoreItem);
      })
    );
  }

  private updateLastSavedStoreItem(storeItem: StoreItem) {
    this.lastSavedStoreItem = JSON.parse(JSON.stringify(storeItem));
  }

  private getUpdateStoreItem(): Observable<StoreItem> {
    const controls: { [key: string]: AbstractControl } = this.formGroup.controls;
    const type = controls.type.value;
    const initialValue = controls[initialValueConfig[type]].value;

    return this.getInitialValue(initialValue, type).pipe(
      map(result => {
        let value = this.storeItem.value;
        if (type !== this.storeItem.valueType || result !== this.storeItem.initialValue) {
          value = result;
        }

        this.checkHiddenInvalidObjectValue();

        return {
          ...this.storeItem,
          name: controls.name.value,
          valueType: type,
          value,
          initialValue: result
        };
      })
    );
  }

  private subscribeToFormChanges() {
    this.formGroup.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => this.checkUnsavedChangesAndEmit());
  }

  private subscribeToSelectedStoreItemChanges() {
    this.storeItemUtils.selectedStoreItem$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((storeItem: StoreItem) => this.initStoreItem(storeItem));
  }

  private subscribeToStoreItemListChanges() {
    this.storeItemUtils.storeItemList$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((storeItemList: StoreItem[]) => (this.noItems = !storeItemList.length));
  }

  private checkHiddenInvalidObjectValue() {
    // We should disable `initialValue` control with `object` editor when another active type chosen
    // because if there is invalid hidden field, `formGroup` will be invalid too
    if (this.type.value !== 'object' && this.initialValueObject.enabled) {
      this.initialValueObject.disable({ emitEvent: false });
    } else if (this.initialValueObject.disabled) {
      this.initialValueObject.enable({ emitEvent: false });
    }

    if (this.type.value !== 'array' && this.initialValueArray.enabled) {
      this.initialValueArray.disable({ emitEvent: false });
    } else if (this.initialValueArray.disabled) {
      this.initialValueArray.enable({ emitEvent: false });
    }
  }

  private updateObjectEditorAfterAsyncValidation() {
    // We should manually call update to show changes in ui right after status change
    this.initialValueObject.statusChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.formGroup.updateValueAndValidity();
    });
    this.initialValueArray.statusChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.formGroup.updateValueAndValidity();
    });
  }

  private focusNameInput() {
    if (this.nameInput) {
      this.nameInput.nativeElement.focus();
    }
  }

  // We should convert `string` to `js object` if there are `object` or `array` types using `eval`
  private getInitialValue(value: string, type: StoreItemType) {
    const isValidObjectField = type === StoreItemType.OBJECT && this.initialValueObject.valid;
    const isValidArrayField = type === StoreItemType.ARRAY && this.initialValueArray.valid;

    if (typeof value === 'string' && (isValidObjectField || isValidArrayField)) {
      return this.jsonValidator.executeEvalConverter(value);
    } else {
      return of(value);
    }
  }

  private stringifyObject(value: string) {
    return stringifyObject(value, {
      indent: '  ',
      singleQuotes: true
    });
  }
}
