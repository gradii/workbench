import { RoleEvaluatorContext, Theme } from '@common/public-api';
import { combineLatest, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

// import { UserFacade } from '@auth/user-facade.service';
// import { Plan } from '@account-state/billing/billing.service';
import { Page } from '@tools-state/page/page.model';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { UserFacade } from '@auth/user-facade.service';

const plansRolesMapping = {
  // [Plan.FREE]: 'free',
  // [Plan.TEMPLATE_MONTHLY]: 'template',
  // [Plan.LIGHT_MONTHLY]: 'light',
  // [Plan.STARTUPS_MONTHLY]: 'STARTUPS',
  // [Plan.STANDARD_MONTHLY]: 'standard',
  //
  // [Plan.TEMPLATE_ANNUALLY]: 'template',
  // [Plan.LIGHT_ANNUALLY]: 'light',
  // [Plan.STARTUPS_ANNUALLY]: 'STARTUPS',
  // [Plan.STANDARD_ANNUALLY]: 'standard'
};

@Injectable({ providedIn: 'root' })
export class PrivilegesEvaluatorDataSource {
  readonly pages$ = new Subject<Page[]>();
  readonly projects$ = new Subject<ProjectBrief[]>();
  readonly themes$ = new Subject<Theme[]>();

  readonly data$: Observable<RoleEvaluatorContext> = combineLatest([
    // this.userFacade.plan$,
    // this.userFacade.admin$,
    // this.userFacade.featureAmplify$,
    this.userFacade.createdAt$,
    this.pages$.asObservable(),
    this.projects$.asObservable(),
    this.themes$.asObservable()
  ]).pipe(
    map(
      ([/*plan, admin, featureAmplify,*/ date, pages, projects, themes]: [
        /*
        any,//Plan,
        boolean,
        boolean,
        */
        Date,
        Page[],
        ProjectBrief[],
        Theme[],
      ]) => {
        return <RoleEvaluatorContext>{
          projectsNumber: projects.filter((p: ProjectBrief) => !p.sharedWithMe).length,
          themesNumber: themes.length,
          pagesNumber: pages.length,
          createdAt: date,
          pages: pages.map((page: Page) => page.id),
          plan: 'admin'
          // plan: admin ? 'admin' : this.getRoleName(plan),
          // featureAmplify
        };
      }
    )
  );

  constructor(private userFacade: UserFacade) {
  }

  private getRoleName(plan/*: Plan*/): string {
    return 'light'
    // return plansRolesMapping[plan];
  }
}
