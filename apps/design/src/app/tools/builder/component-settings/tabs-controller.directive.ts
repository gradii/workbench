import { AfterViewInit, ChangeDetectorRef, Directive, Host, Inject, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { delay, distinctUntilChanged, map, repeatWhen, skip, takeUntil } from 'rxjs/operators';
import { NbTabComponent, NbTabsetComponent } from '@nebular/theme';

import { UIActionIntentService } from '@tools-state/ui-action/ui-action-intent.service';
import { ACTIVATE$, DEACTIVATE$ } from './settings.directive';
import { ComponentSettingsTabsService } from './component-settings-tabs.service';

@Directive({ selector: '[ubTabsController]' })
export class TabsControllerDirective implements OnDestroy, AfterViewInit {
  private readonly DATA_TAB_INDEX = 1;
  private destroy$ = new Subject();

  constructor(
    private cd: ChangeDetectorRef,
    private actionIntentService: UIActionIntentService,
    private componentSettingsTabsService: ComponentSettingsTabsService,
    @Host() private tabset: NbTabsetComponent,
    @Inject(ACTIVATE$) private activate$: Observable<boolean>,
    @Inject(DEACTIVATE$) private deactivate$: Observable<boolean>
  ) {
  }

  ngAfterViewInit() {
    this.subscribeToTabChanges();
    this.subscribeToShowSequenceSource();
    this.subscribeToConnectOrFixDataSource();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  selectDataTab() {
    this.componentSettingsTabsService.setNextSelectedTab(this.DATA_TAB_INDEX);
  }

  selectFirstTab() {
    this.componentSettingsTabsService.setNextSelectedTab(0);
  }

  selectTab(index: number): void {
    const tab = this.tabset.tabs.toArray()[index];
    this.tabset.selectTab(tab);
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  private subscribeToConnectOrFixDataSource(): void {
    this.actionIntentService.connectOrFixDataSource$
      .pipe(
        takeUntil(this.deactivate$),
        repeatWhen(() => this.activate$),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.selectFirstTab());
  }

  private subscribeToShowSequenceSource(): void {
    this.actionIntentService.showSequenceSource$
      .pipe(
        takeUntil(this.deactivate$),
        repeatWhen(() => this.activate$),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.selectDataTab());
  }

  private subscribeToTabChanges(): void {
    this.tabset.changeTab
      .pipe(
        takeUntil(this.deactivate$),
        repeatWhen(() => this.activate$),
        // skip first value of changeTab event
        skip(1),
        map((tab: NbTabComponent) => this.tabset.tabs.toArray().findIndex(t => t === tab)),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(tabIndex => this.componentSettingsTabsService.setNextSelectedTab(tabIndex));

    this.componentSettingsTabsService.currentSelectedTabIndex$
      .pipe(
        takeUntil(this.deactivate$),
        /**
         * we need to use this delay because in nebular tabset component
         * (https://github.com/akveo/nebular/blob/master/src/framework/theme/components/tabset/tabset.component.ts#L315)
         * is used delay and because of it the event from currentSelectedTabIndex$
         * comes faster than from changeTab and * we can't set valid tab
         *
         * mb we can remove it after refactoring of nebular tabset component
         */
        delay(0),
        repeatWhen(() => this.activate$),
        takeUntil(this.destroy$)
      )
      .subscribe((tabIndex: number) => this.selectTab(tabIndex));
  }
}
