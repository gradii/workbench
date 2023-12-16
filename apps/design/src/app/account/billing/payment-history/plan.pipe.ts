import { Pipe, PipeTransform } from '@angular/core';
import { getPlanName, Plan } from '@account-state/billing/billing.service';

@Pipe({ name: 'plan', pure: true })
export class PlanPipe implements PipeTransform {
  transform(plan: Plan): any {
    return getPlanName(plan);
  }
}
