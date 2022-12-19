import { Subject, Observable } from 'rxjs';
import { filter, distinctUntilChanged, takeUntil, map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

import { HostingFacade } from '@root-state/hosting/hosting.facade';
import { Hosting } from '@root-state/hosting/hosting.model';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { ProjectSettingsFacade } from '@root-state/project-settings/project-settings-facade.service';
import { TriDialogService } from '@gradii/triangle/dialog';
import { DeleteDomainDialogComponent } from '../delete-domain-dialog/delete-domain-dialog.component';

@Component({
  selector: 'len-project-settings-hosting',
  styleUrls: ['./project-settings-hosting.component.scss'],
  templateUrl: './project-settings-hosting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSettingsHostingComponent implements OnInit, OnDestroy {
  hostings$ = this.hostingFacade.hostings$.pipe(
    map(hostings => hostings.sort((a, b) => b.environment.localeCompare(a.environment)))
  );

  hostingView$ = this.hostingFacade.hostingView$;

  loading$ = this.hostingFacade.loading$;

  private destroyed$ = new Subject<void>();

  constructor(
    private dialogService: TriDialogService,
    private hostingFacade: HostingFacade,
    private projectSettingsFacade: ProjectSettingsFacade
  ) {
  }

  ngOnInit() {
    this.projectSettingsFacade.currentProject$
      .pipe(
        filter(project => !!project),
        distinctUntilChanged(),
        takeUntil(this.destroyed$)
      )
      .subscribe((project: ProjectBrief) => {
        this.hostingFacade.loadHostings(project.viewId);
      });
  }

  ngOnDestroy(): void {
    this.hostingFacade.clearState();
    this.destroyed$.next();
  }

  addDomain(domain: string, hosting: Hosting) {
    this.hostingFacade.addDomain(hosting.id, domain);
  }

  assignDomain(hosting: Hosting) {
    this.hostingFacade.assignDomain(hosting.id, hosting.domain);
  }

  deleteDomain(hosting: Hosting) {
    this.dialogService.open(DeleteDomainDialogComponent, {
      disableClose: true,
      context: { hosting }
    });
  }

  getErrorsByHostingId(id: number): Observable<string[]> {
    return this.hostingView$.pipe(
      map(hostingView => {
        const result = [];

        if (hostingView[id]?.assignDomainError) {
          result.push('Cannot assign domain. Please check that you correctly configured your DNS settings.');
        }

        if (hostingView[id]?.deleteDomainError) {
          result.push('Failed to delete the domain assignment.');
        }

        return result;
      })
    );
  }
}
