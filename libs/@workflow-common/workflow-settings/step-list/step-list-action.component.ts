import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, HostBinding } from '@angular/core';

@Component({
  selector       : 'pf-step-list-action',
  styleUrls      : ['./step-list-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-icon svgIcon="workbench:workflow-stroke" class="arrow-icon"></tri-icon>
    <button triButton ghost class="bakery-button workflow-icon" (click)="addStep.emit($event)">
      <span class="button-text">
        {{ conditionLabel }}
      </span>
      <tri-icon svgIcon="outline:plus"></tri-icon>
    </button>
    <tri-icon *ngIf="!isLastElement" svgIcon="workbench:workflow-arrow" class="arrow-icon"></tri-icon>
  `
})
export class StepListActionComponent {
  @Input() condition: boolean = null;

  @HostBinding('class.conditional') get isForCondition() {
    return typeof this.condition === 'boolean';
  }

  @HostBinding('class.condition-true') get conditionTrueClass() {
    return typeof this.condition === 'boolean' && this.condition;
  }

  @HostBinding('class.condition-false') get conditionFalseClass() {
    return typeof this.condition === 'boolean' && !this.condition;
  }

  @Input() isLastElement = false;
  @Output() addStep      = new EventEmitter();

  get conditionLabel(): string {
    return this.isForCondition ? this.condition.toString() : '';
  }
}
