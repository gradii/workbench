import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormControl, Validators } from '@angular/forms';
import { COMMON_NAME_PATTERN, Workflow } from '@common/public-api';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { UniqueWorkflowNameValidator } from '../../util/validator/unique-workflow-name.validator';

@Component({
  selector       : 'ub-workflow-settings-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./workflow-settings-header.component.scss'],
  providers      : [UniqueWorkflowNameValidator],
  template       : `
    <label class="workflow-label">
      <input triInput fullWidth placeholder="Enter name" [formControl]="name"/>
      <div class="errors">
        <span *ngIf="name.dirty && name.errors?.required">Name is required.</span>
        <span *ngIf="name.errors?.pattern"
        >Name can contain only words, numbers and spaces and should start with a word.</span
        >
        <span *ngIf="name.errors?.unique">Action with that name already exists.</span>
      </div>
    </label>
    <div class="action-controls">
      <button triButton size="tiny" color="info" (testStep)="testStep()">测试</button>
      <button *ngIf="canBeDeleted" triButton class="bakery-button workflow-icon" ghost (click)="delete.emit(workflow)">
        <tri-icon svgIcon="outline:trash"></tri-icon>
      </button>
      <button
        *ngIf="canBeDuplicated"
        triButton
        class="bakery-button workflow-icon"
        ghost
        (click)="duplicate.emit(workflow)"
      >
        <tri-icon svgIcon="outline:copy"></tri-icon>
      </button>
    </div>
  `
})
export class WorkflowSettingsHeaderComponent implements OnInit, OnDestroy {
  newAction = false;
  workflow: Workflow;

  @Input('workflow') set workflowSetter(workflow: Workflow) {
    this.uniqueWorkflowNameValidator.setOriginalName(workflow.name);
    this.name.reset(workflow.name, { emitEvent: false });
    // system or new action cannot be deleted
    this.canBeDeleted = workflow.id && workflow.id !== 'toggleSidebar';
    this.canBeDuplicated = !!workflow.id;
    this.newAction = !workflow.id;
    this.workflow = workflow;
  }

  @Output() delete: EventEmitter<Workflow> = new EventEmitter<Workflow>();
  @Output() duplicate: EventEmitter<Workflow> = new EventEmitter<Workflow>();
  @Output() workflowChange: EventEmitter<Workflow> = new EventEmitter<Workflow>();

  name: UntypedFormControl = new UntypedFormControl(
    '',
    [Validators.required, Validators.pattern(COMMON_NAME_PATTERN)],
    [(ctrl: AbstractControl) => this.uniqueWorkflowNameValidator.validate(ctrl)]
  );

  canBeDeleted = false;
  canBeDuplicated = false;

  private destroyed = new Subject<void>();

  constructor(private uniqueWorkflowNameValidator: UniqueWorkflowNameValidator) {
  }

  ngOnInit() {
    this.name.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroyed)).subscribe(value => {
      if (this.name.valid) {
        this.workflowChange.emit({
          ...this.workflow,
          name: value
        });
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  testStep() {
    console.log('test step');
  }
}
