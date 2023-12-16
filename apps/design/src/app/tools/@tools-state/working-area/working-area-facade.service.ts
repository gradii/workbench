import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

import { LoaderService } from '@core/loader.service';
import { getActivePageFullUrl } from '@tools-state/page/page.selectors';
import { fromTools } from '@tools-state/tools.reducer';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { getWorkingAreaMode } from '@tools-state/working-area/working-area.selectors';
import { CommunicationService } from '@shared/communication/communication.service';
import { IframeProviderService } from '@shared/communication/iframe-provider.service';
import { ProjectFacade } from '@tools-state/project/project-facade.service';

const workingAreaModeToPageUrl = new Map([
  [WorkingAreaMode.PREVIEW, 'preview'],
  [WorkingAreaMode.BUILDER, 'builder'],
  [WorkingAreaMode.PAINTER, 'painter'],
  [WorkingAreaMode.DATA, 'data']
]);

@Injectable({ providedIn: 'root' })
export class WorkingAreaFacade implements OnDestroy {
  readonly workingAreaMode$: Observable<WorkingAreaMode> = this.store.pipe(select(getWorkingAreaMode));
  readonly sendNavigationUntil: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<fromTools.State>,
    private iframeProvider: IframeProviderService,
    private communication: CommunicationService,
    private loaderService: LoaderService,
    private projectFacade: ProjectFacade,
    private router: Router
  ) {
    this.communication.ready$.subscribe(() => this.ready());
  }

  ngOnDestroy() {
    this.detachActivePageNavigation();
  }

  finishLoading() {
    this.store.dispatch(new WorkingAreaActions.FinishLoading());
  }

  ready() {
    this.loaderService.hide();
  }

  setIframeWidth(iframeWidth: number) {
    this.iframeProvider.setIframeWidth(iframeWidth);
  }

  getIframeWidth(): Observable<number> {
    return this.iframeProvider.getIframeWidth();
  }

  setIframe(window: Window) {
    this.iframeProvider.setIframeWindow(window);
  }

  getIframe(): Observable<Window> {
    return this.iframeProvider.getIframeWindow();
  }

  changeMode(mode: WorkingAreaMode) {
    this.store.dispatch(new WorkingAreaActions.ChangeMode(mode));
  }

  attachActivePageNavigation() {
    this.store
      .pipe(
        select(getActivePageFullUrl),
        filter(url => !!url),
        takeUntil(this.sendNavigationUntil)
      )
      .subscribe((url: string) => this.communication.changeActivePage(url));
  }

  detachActivePageNavigation() {
    this.sendNavigationUntil.next();
  }

  navigateByWorkingAreaMode(workingAreaMode: WorkingAreaMode): Observable<boolean> {
    return this.projectFacade.activeProjectId$.pipe(
      take(1),
      switchMap((projectId: string) => {
        const pageUrl: string = workingAreaModeToPageUrl.get(workingAreaMode);
        const url = `tools/${projectId}/${pageUrl}`;
        return this.router.navigateByUrl(url);
      })
    );
  }
}
