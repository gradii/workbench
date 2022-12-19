import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AclService } from '@common';

import { WorkingAreaFacade } from '@tools-state/working-area/working-area-facade.service';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector       : 'len-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./layout.component.scss'],
  template       : `
    <tri-layout class="layout">
      <tri-header style="line-height:32px;height: auto; padding: 0">
        <tri-navbar>
          <tri-navbar-row>
            <len-header
              [mode]="mode$ | async"
              [canDownloadDataCode]="canDownloadDataCode$ | async"
              [canUseHosting]="canUseHosting$ | async"
            ></len-header>
          </tri-navbar-row>
        </tri-navbar>
      </tri-header>
      <tri-content>
        <!--<nb-sidebar *ngIf="showSidebar$ | async" class="tools-menu" tag="tools-menu">
          <len-tools-menu></len-tools-menu>
        </nb-sidebar>-->
        <ng-content select="router-outlet"></ng-content>
        <ng-content select="len-working-area"></ng-content>
      </tri-content>
    </tri-layout>
  `
})
export class LayoutComponent {
  showSidebar$: Observable<boolean> = this.workingAreaFacade.workingAreaMode$.pipe(
    map((mode: WorkingAreaMode) => mode !== WorkingAreaMode.PREVIEW)
  );

  mode$: Observable<WorkingAreaMode> = this.workingAreaFacade.workingAreaMode$;

  canDownloadDataCode$: Observable<boolean> = this.acl.canDownloadDataCode();
  canUseHosting$: Observable<boolean>       = this.acl.canUseHosting();

  constructor(private acl: AclService, private workingAreaFacade: WorkingAreaFacade) {
  }
}
