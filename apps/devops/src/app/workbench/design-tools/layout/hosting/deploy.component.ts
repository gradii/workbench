import { Component, OnDestroy, OnInit } from '@angular/core';
import { KitchenApp } from '@common';

import { HostingFacade } from '@root-state/hosting/hosting.facade';
import { Hosting } from '@root-state/hosting/hosting.model';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { getAppState } from '@tools-state/app/app.selectors';
import { getActiveProjectId, getActiveProjectName } from '@tools-state/project/project.selectors';
import { map, take, withLatestFrom } from 'rxjs/operators';

@Component({
  selector : 'len-deploy',
  styleUrls: ['./deploy.component.scss'],
  template : `
    <button
      class="bakery-button"
      triButton
      ghost
      [triPopover]="hostings"
      triPopoverTrigger="noop"
      triPopoverPosition="bottomLeft"
    >
      <bc-icon name="cloud-upload-outline"></bc-icon>
    </button>

    <ng-template #hostings>
      <len-deploy-popup [hostings]="hostings$ | async" [loading]="deploymentLoading$ | async" (deploy)="deploy($event)">
      </len-deploy-popup>
    </ng-template>
  `
})
export class DeployComponent implements OnInit, OnDestroy {
  loading$           = this.hostingFacade.loading$;
  deploymentLoading$ = this.hostingFacade.deploymentLoading$;
  hostings$          = this.hostingFacade.hostings$;

  constructor(
    private hostingFacade: HostingFacade,
    private stateConverter: StateConverterService
  ) {
  }

  ngOnInit() {
    getActiveProjectId.pipe(take(1)).subscribe(projectId => {
      this.hostingFacade.setBackgroundUpdates(true);
      this.hostingFacade.loadHostings(projectId);
    });
  }

  ngOnDestroy() {
    this.hostingFacade.clearState();
  }

  deploy(hostings: Hosting[]) {
    getAppState
      .pipe(
        withLatestFrom(getActiveProjectName),
        map(([app, name]) => [
          this.stateConverter.convertState(app),
          name
        ] as [KitchenApp, string]),
        take(1)
      ).subscribe(([app, name]: [KitchenApp, string]) => {
      this.hostingFacade.deployHostings(hostings, app, name);
    });
  }
}
