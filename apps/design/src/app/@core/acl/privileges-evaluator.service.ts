import { NbAclService } from '@nebular/security';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { aclConfig, evaluatePrivileges, PlanConfig, plansConfig, RoleEvaluatorContext } from '@common';

import { PrivilegesEvaluatorDataSource } from './privileges-evaluator-data-source';
import { Plan } from '@account-state/billing/billing.service';

@Injectable({ providedIn: 'root' })
export class PrivilegesEvaluator {
  readonly privileges$: Observable<string[]> = this.dataSource.data$.pipe(
    map((context: RoleEvaluatorContext) => {
      const plan = context.plan;

      // TODO: we need this temporary to apply different limit to new and old users
      if (plan === String(Plan.FREE).toLowerCase()) {
        this.patchFreePlanPagesLimit(plansConfig[plan], context);
      }

      this.updateAclConfigWithAvailablePages(context);
      const privileges = [...plansConfig[plan].privileges];

      // if amplify feature is available for this user, add a privilege
      if (context.featureAmplify) {
        privileges.push('accessFeatureAmplify');
      }

      return [...privileges, ...evaluatePrivileges(context)];
    })
  );

  constructor(private acl: NbAclService, private dataSource: PrivilegesEvaluatorDataSource) {
  }

  private updateAclConfigWithAvailablePages(context: RoleEvaluatorContext) {
    const { plan, pages } = context;
    const availablePages: string[] = pages.slice(0, plansConfig[plan].limits.pages);

    this.acl.setAccessControl({ ...aclConfig.accessControl, pageOpener: { open: [...availablePages] } });
  }

  private patchFreePlanPagesLimit(planConfig: PlanConfig, context: RoleEvaluatorContext) {
    // this is the date when we changed pricing limit for Free plans to 1 page available
    const newPlanDeliveryDate = new Date(2020, 1, 27);
    if (context.createdAt.getTime() < newPlanDeliveryDate.getTime()) {
      planConfig.limits.pages = 6;
    }
  }
}
