import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { LoaderService } from '@core/loader.service';
import { dispatch } from '@ngneat/effects';
import { CommunicationService } from '@shared/communication/communication.service';
import { IframeProviderService } from '@shared/communication/iframe-provider.service';
import { getActivePageFullUrl } from '@tools-state/page/page.selectors';
import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { fromTools } from '@tools-state/tools.reducer';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { WorkingAreaMode, WorkingAreaWorkflowMode } from '@tools-state/working-area/working-area.model';
import { getWorkingAreaMode, getWorkingAreaWorkflowMode } from '@tools-state/working-area/working-area.selectors';
import { Observable, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';

const workingAreaModeToPageUrl = new Map([
  [WorkingAreaMode.PREVIEW, 'preview'],
  [WorkingAreaMode.BUILDER, 'builder'],
  [WorkingAreaMode.PAINTER, 'painter'],
  [WorkingAreaMode.DATA, 'data']
]);

@Injectable({ providedIn: 'root' })
export class WorkingAreaFacade implements OnDestroy {
  readonly workingAreaMode$: Observable<WorkingAreaMode>                 = getWorkingAreaMode;
  readonly workingAreaworkflowMode$: Observable<WorkingAreaWorkflowMode> = getWorkingAreaWorkflowMode;
  readonly sendNavigationUntil: Subject<void>                            = new Subject<void>();

  constructor(
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
    dispatch(WorkingAreaActions.FinishLoading());
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
    dispatch(WorkingAreaActions.ChangeMode(mode));
  }

  changeWorkflowMode(workflowMode: WorkingAreaWorkflowMode) {
    dispatch(WorkingAreaActions.ChangeWorkflowMode(workflowMode));
  }

  attachActivePageNavigation() {
    getActivePageFullUrl
      .pipe(
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
        const url             = `tools/${projectId}/${pageUrl}`;
        return this.router.navigateByUrl(url);
      })
    );
  }
}
