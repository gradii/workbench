import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Hosting } from '@root-state/hosting/hosting.model';

@Component({
  selector       : 'len-deploy-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./deploy-popup.component.scss'],
  template       : `
    <tri-list>
      <tri-list-item>
        <span class="subtitle-2">Deploy your project</span>
      </tri-list-item>
      <tri-list-item *ngFor="let hosting of hostings; let index = index" [ngClass]="{ 'first-hosting': index === 0 }">
        <len-deploy-popup-item
          [hosting]="hosting"
          [selected]="isSelectedForDeployment(hosting)"
          [disabled]="!canDeploy(hosting)"
          (toggle)="toggleDeployment($event)"
        >
        </len-deploy-popup-item>
      </tri-list-item>
      <tri-list-item>
        <button
          [disabled]="!selectedForDeployment.size"
          triButton
          color="primary"
          size="small"
          fullWidth
          [loading]="loading"
          (click)="emitDeploy()"
        >
          Deploy Selected ({{ selectedForDeployment.size }})
        </button>
      </tri-list-item>
    </tri-list>
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

  hostings: Hosting[]   = [];
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
