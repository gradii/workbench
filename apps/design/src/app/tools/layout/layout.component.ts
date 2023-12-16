import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AclService } from '@common';

import { WorkingAreaFacade } from '@tools-state/working-area/working-area-facade.service';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';

@Component({
  selector: 'ub-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./layout.component.scss'],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <ub-header
          [mode]="mode$ | async"
          [canDownloadDataCode]="canDownloadDataCode$ | async"
          [canUseHosting]="canUseHosting$ | async"
        ></ub-header>
      </nb-layout-header>
      <nb-sidebar *ngIf="showSidebar$ | async" class="tools-menu" tag="tools-menu">
        <ub-tools-menu></ub-tools-menu>
        <ub-learn-menu></ub-learn-menu>
      </nb-sidebar>
      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
        <ng-content select="ub-working-area"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `
})
export class LayoutComponent {
  showSidebar$: Observable<boolean> = this.workingAreaFacade.workingAreaMode$.pipe(
    map((mode: WorkingAreaMode) => mode !== WorkingAreaMode.PREVIEW)
  );

  mode$: Observable<WorkingAreaMode> = this.workingAreaFacade.workingAreaMode$;

  canDownloadDataCode$: Observable<boolean> = this.acl.canDownloadDataCode();
  canUseHosting$: Observable<boolean> = this.acl.canUseHosting();

  constructor(private acl: AclService, private workingAreaFacade: WorkingAreaFacade) {
  }
}
