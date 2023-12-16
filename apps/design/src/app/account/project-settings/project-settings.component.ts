import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';
import { NbGlobalPhysicalPosition } from '@nebular/theme';

import { ProjectSettingsFacade } from '@root-state/project-settings/project-settings-facade.service';
import { ToastrService } from '@shared/toastr/toastr.service';
import { ProjectDialogActionsService } from '../projects/project/project-dialog-actions.service';
import { AclService } from '@common';

const defaultTabs = [
  {
    title: 'general',
    route: './'
  },
  {
    title: 'code',
    route: './code'
  }
];

const hostingTab = { title: 'hosting', route: './hosting' };

@Component({
  selector: 'ub-project-settings',
  styleUrls: ['./project-settings.component.scss'],
  templateUrl: './project-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSettingsComponent implements OnInit, OnDestroy {
  project$ = this.projectSettingsFacade.currentProject$;

  builderLink$ = this.project$.pipe(map(project => (project ? `/tools/${project.viewId}/builder` : '')));

  loading$ = this.projectSettingsFacade.loading$;

  tabs$: Observable<any[]> = this.acl.canUseHosting().pipe(
    map((canUseHosting: boolean) => {
      if (canUseHosting) {
        return [...defaultTabs, hostingTab];
      }
      return defaultTabs;
    })
  );

  private destroyed$ = new Subject();

  constructor(
    private projectSettingsFacade: ProjectSettingsFacade,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private projectDialogActionsService: ProjectDialogActionsService,
    private acl: AclService
  ) {
  }

  ngOnInit() {
    this.handleRouteParamChange();
    this.handleFailed();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  deleteProject() {
    this.project$
      .pipe(
        filter(project => !!project),
        take(1)
      )
      .subscribe(project => {
        this.projectDialogActionsService.delete(project);
      });
  }

  private handleRouteParamChange() {
    this.route.paramMap.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.projectSettingsFacade.setProjectId(params.get('id'));
    });
  }

  private handleFailed() {
    this.projectSettingsFacade.failed$
      .pipe(
        distinctUntilChanged(),
        filter(failed => !!failed),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.toastrService.danger('Something went wrong. Please try again.', {
          preventDuplicates: true,
          limit: 3,
          position: NbGlobalPhysicalPosition.BOTTOM_RIGHT
        });
      });
  }
}
