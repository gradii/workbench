import { environment } from '@environments';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Hosting } from '@root-state/hosting/hosting.model';

@Component({
  selector: 'len-domain-card',
  templateUrl: './domain-card.component.html',
  styleUrls: ['./domain-card.component.scss']
})
export class DomainCardComponent {
  @Input() hosting: Hosting;
  @Input() checkStatusLoading: boolean;
  @Input() deleteLoading: boolean;
  @Input() errors: string[];

  @Output() checkStatus = new EventEmitter();
  @Output() delete = new EventEmitter<void>();

  value = environment.hostingDomain;

  get isLoading() {
    return this.checkStatusLoading || this.deleteLoading;
  }

  get isDevEnvironment() {
    return this.hosting.environment === 'dev';
  }

  get host() {
    return this.hosting?.website?.domain || this.hosting?.domain;
  }

  get icon() {
    return this.errors?.length ? 'domain-warning' : 'domain';
  }

  get isPublished() {
    return this.hosting.publishedDeploymentStatus === 'success';
  }

  get publishedDate() {
    return this.hosting.publishedDeploymentDate;
  }

  check() {
    this.checkStatus.emit();
  }

  deleteDomain() {
    this.delete.next();
  }
}
