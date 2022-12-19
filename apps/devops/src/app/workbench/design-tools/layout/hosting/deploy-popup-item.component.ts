import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FinalStatuses, Hosting } from '@root-state/hosting/hosting.model';
import { ProjectFacade } from '@tools-state/project/project-facade.service';

import { environment } from '@devops-tools/devops/environments/environment';

@Component({
  selector       : 'len-deploy-popup-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./deploy-popup-item.component.scss'],
  template       : `
    <div class="left-col">
      <tri-checkbox [checked]="selected" [disabled]="disabled" (checkedChange)="toggleDeployment(hosting)">
      </tri-checkbox>
    </div>
    <tri-card *ngIf="hosting.website && hosting.configured">
      <tri-card-body>
        <div class="env-label">{{ hosting.environment }}</div>

        <div class="url-row">
          <span class="paragraph">{{ getFullDomain(hosting) }}</span>
          <a class="external-link" href="{{ getFullDomain(hosting) }}" target="_blank">
            <tri-icon svgIcon="workbench:external-link-outline"></tri-icon>
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
            <tri-icon *ngIf="succeed(hosting)" svgIcon="workbench:checkmark-circle-outline" status="success"></tri-icon>
            <tri-icon *ngIf="errored(hosting)" svgIcon="workbench:alert-circle-outline" status="danger"></tri-icon>
            <span *ngIf="loadingStatus(hosting)" class="loading-indicator" loading="true">
            </span>
            <span class="status-title {{ hosting.currentDeploymentStatus }}">{{
              hosting.currentDeploymentStatus
              }}</span>
          </span>
        </div>
      </tri-card-body>
    </tri-card>

    <tri-card *ngIf="!hosting.website">
      <tri-card-body class="not-loaded">
        <div class="env-label">{{ hosting.environment }}</div>
        <div class="caption-2">
          <ng-container *ngIf="hosting.configured">Could not load website</ng-container>
          <ng-container *ngIf="!hosting.configured">
            <a [routerLink]="['/projects', viewId$ | async, 'hosting']">Configure Custom Domain</a>
          </ng-container>
        </div>
      </tri-card-body>
    </tri-card>
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
