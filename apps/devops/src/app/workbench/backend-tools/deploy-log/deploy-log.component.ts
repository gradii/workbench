import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ɵmarkDirty as markDirty
} from '@angular/core';
import { TerminalComponent } from '@devops-tools/ui';
import { TriDialogService } from '@gradii/triangle/dialog';
import { TriNotificationService } from '@gradii/triangle/notification';
import { WebsocketClient } from '@gradii/websocket-client';
import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { combineLatest } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DeployServiceDialogComponent } from '../deploy-service-dialog/deploy-service-dialog.component';

@Component({
  selector       : 'dt-deploy-log',
  templateUrl    : './deploy-log.component.html',
  styleUrls      : ['./deploy-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeployLogComponent implements OnInit, OnDestroy {

  ws: WebsocketClient;

  data: any = {};

  outChunk = '';

  prodDisabled = environment.production;

  // reset$ = new Subject();

  @ViewChild('terminal', { static: true })
  terminal: TerminalComponent;

  constructor(
    private projectFacade: ProjectFacade,
    private projectBriefFacade: ProjectBriefFacade,
    private http: HttpClient,
    private dialogService: TriDialogService,
    private toastrService: TriNotificationService
  ) {
  }

  initService() {
    // this.projectBriefFacade.projects$.pipe(
    //   tap((data) => {
    //     console.log(data);
    //   })
    // ).subscribe();
    // this.projectFacade.activeProjectId$.pipe(
    //   tap((data) => {
    //     console.log(data);
    //
    //   })
    // ).subscribe();
  }

  onReDeployDependency() {
    this.reset();
    combineLatest(
      [
        this.projectFacade.activeProjectId$
      ]
    ).pipe(
      switchMap(([viewId]) => {
        return this.http.put(`/api/workbench/build-project/${viewId}`, {
          type: 'install_dependency'
        }).pipe(
          tap((data: { id, ws }) => {
            this.ws.send('get-command-detail-log', { 'id': data.id }).subscribe();
          })
        );
      })
    ).subscribe();
  }

  onReDeployBuild() {
    this.reset();
    combineLatest(
      [
        this.projectFacade.activeProjectId$
      ]
    ).pipe(
      switchMap(([viewId]) => {
        return this.http.put(`/api/workbench/build-project/${viewId}`, {
          type: 'build_backend'
        }).pipe(
          tap((data: { id, ws }) => {
            this.ws.send('get-command-detail-log', { 'id': data.id }).subscribe();
          })
        );
      })
    ).subscribe();
  }


  ngOnInit(): void {
    this.ws = new WebsocketClient({ url: `${environment.wsHost}/ws/gateway` });

    this.ws.send('get-command-detail-log', { 'id': 'yarn install 0' }).subscribe();

    this.ws.on('command-detail-output').pipe(
      tap((data: string) => {
        // console.log(JSON.parse(event.data));
        this.outChunk = data;

        markDirty(this);
      })
    ).subscribe();

    this.initService();
  }

  reset() {
    this.terminal.reset();
    // this.reset$.next();
    markDirty(this);
  }

  onReDeployRestart() {

    this.dialogService.open(DeployServiceDialogComponent, {})
      .afterClosed().pipe(
      tap(() => {

      }),
      tap(res => {
        console.log(res);
        if (res && res.runningId) {
          this.toastrService.success(`服务重启成功, 任务名 ${res.runningId}`, '重启成功');
          this.reset();
          this.showServerLog();
        }
      }),
      tap(() => {

      })
    ).subscribe();
  }

  showServerLog() {
    this.reset();
    combineLatest(
      [
        this.projectFacade.activeProjectId$
      ]
    ).pipe(
      switchMap(([viewId]) => {
        return this.http.get(`/api/workbench/deploy-restart-service/${viewId}/log`);
      }),
      tap((data: any) => {
        this.terminal.out = data.log;
        markDirty(this);
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.ws.ngOnDestroy();
    // this.ws.close();
    // this.reset$.next();
    // this.reset$.complete();
  }

  onReDeployStop() {
    this.projectFacade.activeProjectId$.pipe(
      switchMap((viewId) => {
        return this.http.get(`/api/workbench/deploy-stop-service/${viewId}`);
      })
      // tap((data: any) => {
      //   this.terminal.out = data.log;
      //   markDirty(this);
      // })
    ).subscribe();
  }

  onReDeployGenerateCode() {
    this.projectFacade.activeProjectId$.pipe(
      switchMap((viewId) => {
        return this.http.get(`/api/workbench/generate-project/${viewId}`);
      }),
      tap(() => {
        this.toastrService.success('代码生成成功', '生成成功');
      }),
      catchError((err) => {
        this.toastrService.error(`代码生成失败, ${err.message}`, '生成失败');
        throw err;
      })
      // tap((data: any) => {
      //   this.terminal.out = data.log;
      //   markDirty(this);
      // })
    ).subscribe();

  }
}
