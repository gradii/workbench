import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { BuilderSidebarService } from './builder-sidebar.service';
import { IframeFocusService } from './iframe-focus.service';

@Component({
  selector: 'ub-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./builder.component.scss'],
  template: `
    <nb-layout>
      <nb-sidebar class="pages-sidebar" [state]="sidebarState | async" left fixed tag="page-sidebar">
        <nb-tabset fullWidth class="icon-tabs">
          <nb-tab tabIcon="file">
            <ub-navigator-panel></ub-navigator-panel>
          </nb-tab>
          <nb-tab tabIcon="layout">
            <ub-layout-panel></ub-layout-panel>
          </nb-tab>
        </nb-tabset>
      </nb-sidebar>
      <nb-sidebar right tag="settings-sidebar">
        <ub-component-settings></ub-component-settings>
      </nb-sidebar>
    </nb-layout>
  `
})
export class BuilderComponent implements OnInit, OnDestroy {
  sidebarState: Observable<string> = this.builderSidebarService.opened$.pipe(
    map((opened: boolean) => (opened ? 'expanded' : 'collapsed'))
  );

  private destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private builderSidebarService: BuilderSidebarService,
    private cd: ChangeDetectorRef,
    private iframeFocusService: IframeFocusService
  ) {
  }

  ngOnInit() {
    this.builderSidebarService.opened$.pipe(takeUntil(this.destroyed$)).subscribe(() => this.cd.markForCheck());

    this.iframeFocusService.attach();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.iframeFocusService.detach();
  }
}
