import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'ub-step-list-action',
  styleUrls: ['./step-list-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-icon icon="workflow-stroke" pack="bakery" class="arrow-icon"></nb-icon>
    <button nbButton ghost class="bakery-button workflow-icon" (click)="addStep.emit($event)">
      <span class="button-text">
        {{ conditionLabel }}
      </span>
      <nb-icon icon="plus-circle"></nb-icon>
    </button>
    <nb-icon *ngIf="!isLastElement" icon="workflow-arrow" class="arrow-icon" pack="bakery"></nb-icon>
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
  @Output() addStep = new EventEmitter();

  get conditionLabel(): string {
    return this.isForCondition ? this.condition.toString() : '';
  }
}
