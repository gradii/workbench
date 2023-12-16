import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

import { AvailablePlan } from '../plans/plans';

@Component({
  selector: 'ub-plan',
  styleUrls: ['./plan.component.scss'],
  templateUrl: './plan.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanComponent {
  @Input() plan: AvailablePlan;
  @Output() upgrade = new EventEmitter();

  @Input()
  @HostBinding('class.discounts')
  hasDiscounts = false;

  get withoutAnnuallyPrice(): boolean {
    return !this.plan.annuallyPrice;
  }
}
