import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import {
  COMMON_VARIABLE_NAME_PATTERN,
  ComponentLogicPropName,
  reservedNamesValidator,
  SequenceProperty
} from '@common';
import { Observable, Subject } from 'rxjs';
import { takeUntil, repeatWhen } from 'rxjs/operators';

import { BakeryComponent } from '@tools-state/component/component.model';
import { UIActionIntentService } from '@tools-state/ui-action/ui-action-intent.service';
import { ACTIVATE$, DEACTIVATE$ } from '../../settings.directive';

@Component({
  selector: 'ub-for-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../field.scss', './for-setting-field.component.scss'],
  template: `
    <div class="data-source-container">
      <label class="data-source-main-label">
        <nb-icon class="data-consumer" icon="database" pack="bakery"></nb-icon>
        Sequence Variable
      </label>
    </div>
    <label class="data-source-sub-label">
      Add an Array element to multiply your component.
      <span class="code-highlight">{{ itemNameControl.value }}</span> and
      <span class="code-highlight">{{ itemIndexControl.value }}</span> variables of the Array are available in all
      children components.
    </label>
    <ub-data-field
      [value]="codeControl.value"
      [component]="component"
      [noLabel]="true"
      [oneLine]="true"
      [selfSequence]="true"
      [focusCodeEditor]="focusCodeEditor$ | async"
      (valueChange)="updateCode($event)"
    >
    </ub-data-field>

    <label class="settings-field-label">Sequence Item Name</label>
    <input nbInput fullWidth [formControl]="itemNameControl" [attr.disabled]="inputDisabled ? '' : null" />
    <div *ngIf="!inputDisabled" class="validation-errors">
      <div *ngIf="itemNameControl.errors?.pattern">
        Item name should start with a letter and contain letters, numbers and underscores.
      </div>
      <div *ngIf="itemNameControl.errors?.required">
        Item name is required.
      </div>
      <div *ngIf="itemNameControl.errors?.reserved">
        This variable name is reserved
      </div>
    </div>

    <label class="settings-field-label">Sequence Index Name</label>
    <input nbInput fullWidth [formControl]="itemIndexControl" [attr.disabled]="inputDisabled ? '' : null" />
    <div *ngIf="!inputDisabled" class="validation-errors">
      <div *ngIf="itemIndexControl.errors?.pattern">
        Item index should start with a letter and contain letters, numbers and underscores.
      </div>
      <div *ngIf="itemIndexControl.errors?.required">
        Item index is required.
      </div>
      <div *ngIf="itemIndexControl.errors?.reserved">
        This variable name is reserved
      </div>
    </div>
  `
})
export class ForSettingFieldComponent implements OnInit, OnDestroy, AfterViewInit {
  component: BakeryComponent;

  @Input('component') set _component(component: BakeryComponent) {
    this.component = component;
    const sequence = this.component.properties[ComponentLogicPropName.SEQUENCE_PROPERTY];
    if (sequence) {
      this.sequenceForm.patchValue(sequence, { emitEvent: false });
    }
  }

  @Output() valueChange: EventEmitter<SequenceProperty> = new EventEmitter<SequenceProperty>();

  sequenceForm = this.fb.group({
    code: [''],
    itemName: ['item', [Validators.required, Validators.pattern(COMMON_VARIABLE_NAME_PATTERN), reservedNamesValidator]],
    indexName: [
      'index',
      [Validators.required, Validators.pattern(COMMON_VARIABLE_NAME_PATTERN), reservedNamesValidator]
    ]
  });

  private readonly focusCodeEditor = new Subject();
  readonly focusCodeEditor$ = this.focusCodeEditor.asObservable();

  get itemNameControl(): AbstractControl {
    return this.sequenceForm.controls['itemName'];
  }

  get itemIndexControl(): AbstractControl {
    return this.sequenceForm.controls['indexName'];
  }

  get codeControl(): AbstractControl {
    return this.sequenceForm.controls['code'];
  }

  get inputDisabled() {
    return !this.codeControl.value;
  }

  private destroyed = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private actionIntentService: UIActionIntentService,
    @Inject(ACTIVATE$) private activate$: Observable<boolean>,
    @Inject(DEACTIVATE$) private deactivate$: Observable<boolean>
  ) {
  }

  ngOnInit() {
    this.sequenceForm.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(() => {
      if (this.sequenceForm.valid || !this.codeControl.value) {
        this.valueChange.emit({
          code: this.codeControl.value,
          itemName: this.itemNameControl.value,
          indexName: this.itemIndexControl.value
        });
      }
    });
  }

  ngAfterViewInit() {
    this.listenConnectOrFixDataSource();
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  updateCode(code: string) {
    this.sequenceForm.patchValue({ code });
  }

  private listenConnectOrFixDataSource() {
    this.actionIntentService.showSequenceSource$
      .pipe(
        takeUntil(this.deactivate$),
        repeatWhen(() => this.activate$),
        takeUntil(this.destroyed)
      )
      .subscribe(() => {
        this.focusCodeEditor.next({});
      });
  }
}
