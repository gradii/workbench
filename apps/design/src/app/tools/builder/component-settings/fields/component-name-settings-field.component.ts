import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { COMMON_VARIABLE_NAME_PATTERN } from '@common';

import {
  AngularComponentValidator,
  UniqueComponentNameValidator,
  UniquePageNameValidator
} from './unique-component-validator.service';
import { ComponentSettings } from '../settings-view';
import { ComponentSettingsService } from '../component-settings.service';
import { BakeryActions } from '@tools-state/component/component.model';

@Component({
  selector: 'ub-component-name-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UniqueComponentNameValidator, UniquePageNameValidator, AngularComponentValidator],
  styleUrls: ['component-name-settings-field.component.scss'],
  template: `
    <form class="name-settings" [formGroup]="containerForm">
      <p class="message">Set Name to identify it within your app</p>
      <input
        class="component-name-input"
        nbInput
        fullWidth
        placeholder="Component Name"
        formControlName="name"
        type="text"
      />
      <div *ngIf="canBeContainer" class="checkbox-container">
        <nb-checkbox formControlName="container">
          <span class="checkbox-label">Angular component</span>
        </nb-checkbox>
        <nb-icon
          nbTooltip="Choose to mark element as separate Angular Component"
          nbTooltipPlacement="bottom"
          nbTooltipClass="component-name-settings-tooltip"
          icon="alert-circle-outline"
        ></nb-icon>
      </div>
    </form>
    <p class="message container-info-message" *ngIf="containerCheckboxDisabled">
      OnInit action requires Angular Component
    </p>
    <div class="validation-errors">
      <div *ngIf="nameControl.errors?.required">
        Name is required.
      </div>
      <div *ngIf="nameControl.errors?.pattern">
        Name should start with a letter and contain letters, numbers and underscores.
      </div>
      <div *ngIf="nameControl.errors?.unique">
        Component or Page with that name already exists.
      </div>
    </div>
  `
})
export class ComponentNameSettingsFieldComponent implements OnInit, OnDestroy {
  private readonly parentSlotId = new BehaviorSubject<string>('');
  private name: string;
  private container: boolean;
  private componentSettings: ComponentSettings;
  private destroyed: Subject<void> = new Subject<void>();

  @Input() set settings(componentSettings: ComponentSettings) {
    this.parentSlotId.next(componentSettings.component.parentSlotId);
    this.name = componentSettings.properties['name'];
    this.container = componentSettings.properties['container'];
    this.componentSettings = componentSettings;
    this.uniqueComponentNameValidator.setIgnoreComponentId(componentSettings.component.id);
    this.containerForm.patchValue({ name: this.name }, { emitEvent: false });
    if (this.container) {
      this.angularComponentValidator.setIsAngularComponent(this.container);
      this.containerForm.patchValue({ container: this.container }, { emitEvent: false });
    }

    if (componentSettings.actions) {
      this.disableContainerCheckbox(componentSettings.actions);
    }
  }

  get containerCheckboxDisabled(): boolean {
    return this.containerForm.get('container').disabled;
  }

  @Output() nameSettingsChange: EventEmitter<{ name: string; container: boolean }> = new EventEmitter<{
    name: string;
    container: boolean;
  }>();

  readonly containerForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        // only words number and spaces, should starts from char
        Validators.pattern(COMMON_VARIABLE_NAME_PATTERN)
      ],
      [this.angularComponentValidator, this.uniqueComponentNameValidator, this.uniquePageValidator]
    ],
    container: [false]
  });

  get definitionId(): string {
    return this.componentSettings.component.definitionId;
  }

  get nameControl(): AbstractControl {
    return this.containerForm.controls['name'];
  }

  get canBeContainer(): boolean {
    return typeof this.container === 'boolean';
  }

  constructor(
    private componentSettingsService: ComponentSettingsService,
    private uniqueComponentNameValidator: UniqueComponentNameValidator,
    private uniquePageValidator: UniquePageNameValidator,
    private angularComponentValidator: AngularComponentValidator,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.containerForm.controls.container.valueChanges.subscribe(value => {
      this.angularComponentValidator.setIsAngularComponent(value);
      this.containerForm.controls.name.setValue(this.containerForm.controls.name.value);
    });

    this.containerForm.valueChanges
      .pipe(
        map(() => this.containerForm.getRawValue()),
        debounceTime(300),
        takeUntil(this.destroyed)
      )
      .subscribe((changes: { name: string; container: boolean }) => {
        if (!this.containerForm.valid) {
          return;
        }
        if (!this.canBeContainer) {
          delete changes.container;
        }
        this.nameSettingsChange.emit(changes);
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }

  private disableContainerCheckbox(actions: BakeryActions) {
    if (!this.canBeContainer) {
      return;
    }
    if (actions?.init?.length) {
      this.containerForm.get('container').disable({ onlySelf: true, emitEvent: false });
    } else {
      this.containerForm.get('container').enable({ onlySelf: true, emitEvent: false });
    }
  }
}
