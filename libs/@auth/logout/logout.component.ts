import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, getDeepFromObject } from '@nebular/auth';

import { RootFacade } from '@root-state/root-facade.service';

@Component({
  selector: 'nb-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit, OnDestroy {
  private strategy = '';
  private destroy$ = new Subject<void>();

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected router: Router,
    private rootFacade: RootFacade
  ) {
    this.strategy = this.getConfigValue('forms.logout.strategy');
  }

  ngOnInit(): void {
    this.logout(this.strategy);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  logout(strategy: string): void {
    this.service
      .logout(strategy)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: NbAuthResult) => {
        const redirect = result.getRedirect();
        if (redirect) {
          this.rootFacade.clearStore();
          return this.router.navigateByUrl(redirect);
        }
      });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
