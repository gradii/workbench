import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FinalStatuses, Hosting } from '@root-state/hosting/hosting.model';
import { ProjectFacade } from '@tools-state/project/project-facade.service';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ub-deploy-popup-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./deploy-popup-item.component.scss'],
  template: `
    <div class="left-col">
      <nb-checkbox [checked]="selected" [disabled]="disabled" (checkedChange)="toggleDeployment(hosting)">
      </nb-checkbox>
    </div>
    <nb-card *ngIf="hosting.website && hosting.configured">
      <nb-card-body>
        <div class="env-label">{{ hosting.environment }}</div>

        <div class="url-row">
          <span class="paragraph">{{ getFullDomain(hosting) }}</span>
          <a class="external-link" href="{{ getFullDomain(hosting) }}" target="_blank">
            <nb-icon icon="external-link-outline"></nb-icon>
          </a>
        </div>

        <div class="publish-info caption-2">
          <ng-container *ngIf="hosting.publishedDeploymentDate">
            Deployed {{ hosting.publishedDeploymentDate | date: 'short' }}
          </ng-container>
          <ng-container *ngIf="!hosting.publishedDeploymentDate">
            Never Deployed
          </ng-container>
        </div>

        <div class="deploy-status caption-2" *ngIf="hosting.currentDeploymentStatus">
          Latest Deployment:
          <span class="status-icon">
            <nb-icon *ngIf="succeed(hosting)" icon="checkmark-circle-outline" status="success"></nb-icon>
            <nb-icon *ngIf="errored(hosting)" icon="alert-circle-outline" status="danger"></nb-icon>
            <span *ngIf="loadingStatus(hosting)" class="loading-indicator" nbSpinner="true" nbSpinnerSize="tiny">
            </span>
            <span class="status-title {{ hosting.currentDeploymentStatus }}">{{
              hosting.currentDeploymentStatus
            }}</span>
          </span>
        </div>
      </nb-card-body>
    </nb-card>

    <nb-card *ngIf="!hosting.website">
      <nb-card-body class="not-loaded">
        <div class="env-label">{{ hosting.environment }}</div>
        <div class="caption-2">
          <ng-container *ngIf="hosting.configured">Could not load website</ng-container>
          <ng-container *ngIf="!hosting.configured">
            <a [routerLink]="['/projects', viewId$ | async, 'hosting']">Configure Custom Domain</a>
          </ng-container>
        </div>
      </nb-card-body>
    </nb-card>
  `
})
export class DeployPopupItemComponent {
  @Input() hosting: Hosting;
  @Input() selected: boolean;
  @Input() disabled: boolean;

  @Output() toggle: EventEmitter<Hosting> = new EventEmitter<Hosting>();

  viewId$ = this.projectFacade.activeProjectId$;

  constructor(private projectFacade: ProjectFacade) {
  }

  toggleDeployment(hosting: Hosting) {
    this.toggle.emit(hosting);
  }

  getFullDomain(hosting: Hosting): string {
    if (hosting.environment === 'dev') {
      return `https://${hosting.domain}.${environment.cloudDomain}`;
    }
    return `https://${hosting.domain}`;
  }

  loadingStatus(hosting: Hosting): boolean {
    return !FinalStatuses.includes(hosting.currentDeploymentStatus);
  }

  errored(hosting: Hosting): boolean {
    return hosting.currentDeploymentStatus === 'fail';
  }

  succeed(hosting: Hosting): boolean {
    return hosting.currentDeploymentStatus === 'success';
  }
}
