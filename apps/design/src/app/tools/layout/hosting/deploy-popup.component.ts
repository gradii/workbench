import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Hosting } from '@root-state/hosting/hosting.model';

@Component({
  selector: 'ub-deploy-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./deploy-popup.component.scss'],
  template: `
    <nb-list>
      <nb-list-item>
        <span class="subtitle-2">Deploy your project</span>
      </nb-list-item>
      <nb-list-item *ngFor="let hosting of hostings; let index = index" [ngClass]="{ 'first-hosting': index === 0 }">
        <ub-deploy-popup-item
          [hosting]="hosting"
          [selected]="isSelectedForDeployment(hosting)"
          [disabled]="!canDeploy(hosting)"
          (toggle)="toggleDeployment($event)"
        >
        </ub-deploy-popup-item>
      </nb-list-item>
      <nb-list-item>
        <button
          [disabled]="!selectedForDeployment.size"
          nbButton
          status="primary"
          size="small"
          fullWidth
          [nbSpinner]="loading"
          nbSpinnerSize="tiny"
          nbSpinnerMessage="Requesting"
          (click)="emitDeploy()"
        >
          Deploy Selected ({{ selectedForDeployment.size }})
        </button>
      </nb-list-item>
    </nb-list>
  `
})
export class DeployPopupComponent {
  @Input('hostings') set setHostings(hostings: Hosting[]) {
    this.hostings = hostings;

    const selected = hostings.find(hosting => hosting.configured && hosting.environment === 'dev');
    if (selected) {
      this.toggleDeployment(selected);
    }
  }

  @Input() loading: boolean;

  @Output() deploy: EventEmitter<Hosting[]> = new EventEmitter<Hosting[]>();

  hostings: Hosting[] = [];
  selectedForDeployment = new Map<number, Hosting>();

  toggleDeployment(hosting: Hosting) {
    if (!this.canDeploy(hosting)) {
      return;
    }

    if (this.selectedForDeployment.has(hosting.id)) {
      this.selectedForDeployment.delete(hosting.id);
    } else {
      this.selectedForDeployment.set(hosting.id, hosting);
    }
  }

  canDeploy(hosting: Hosting): boolean {
    return hosting.website && hosting.configured && !hosting.currentShouldRetry;
  }

  isSelectedForDeployment(hosting: Hosting): boolean {
    return this.selectedForDeployment.has(hosting.id);
  }

  emitDeploy() {
    this.deploy.emit([...this.selectedForDeployment.values()]);
    this.selectedForDeployment.clear();
  }
}
