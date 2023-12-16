import { Component, OnDestroy, OnInit } from '@angular/core';
import { withLatestFrom, take, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { HostingFacade } from '@root-state/hosting/hosting.facade';
import { Hosting } from '@root-state/hosting/hosting.model';
import { fromTools } from '@tools-state/tools.reducer';
import { getAppState } from '@tools-state/app/app.selectors';
import { getActiveProjectName, getActiveProjectId } from '@tools-state/project/project.selectors';
import { OvenApp } from '@common';
import { StateConverterService } from '@shared/communication/state-converter.service';

@Component({
  selector: 'ub-deploy',
  styleUrls: ['./deploy.component.scss'],
  template: `
    <button
      class="bakery-button"
      nbButton
      ghost
      [nbPopover]="hostings"
      nbPopoverAdjustment="noop"
      nbPopoverPlacement="bottom-start"
    >
      <bc-icon name="cloud-upload-outline"></bc-icon>
    </button>

    <ng-template #hostings>
      <ub-deploy-popup [hostings]="hostings$ | async" [loading]="deploymentLoading$ | async" (deploy)="deploy($event)">
      </ub-deploy-popup>
    </ng-template>
  `
})
export class DeployComponent implements OnInit, OnDestroy {
  loading$ = this.hostingFacade.loading$;
  deploymentLoading$ = this.hostingFacade.deploymentLoading$;
  hostings$ = this.hostingFacade.hostings$;

  constructor(
    private hostingFacade: HostingFacade,
    private store: Store<fromTools.State>,
    private stateConverter: StateConverterService
  ) {
  }

  ngOnInit() {
    this.store.pipe(select(getActiveProjectId), take(1)).subscribe(projectId => {
      this.hostingFacade.setBackgroundUpdates(true);
      this.hostingFacade.loadHostings(projectId);
    });
  }

  ngOnDestroy() {
    this.hostingFacade.clearState();
  }

  deploy(hostings: Hosting[]) {
    this.store
      .pipe(
        select(getAppState),
        withLatestFrom(this.store.pipe(select(getActiveProjectName))),
        map(([app, name]) => [this.stateConverter.convertState(app), name] as [OvenApp, string]),
        take(1)
      )
      .subscribe(([app, name]: [OvenApp, string]) => {
        this.hostingFacade.deployHostings(hostings, app, name);
      });
  }
}
