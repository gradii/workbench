import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TriDialogRef } from '@gradii/triangle/dialog';
import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { combineLatest } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector   : 'dt-deploy-service-dialog',
  templateUrl: './deploy-service-dialog.component.html',
  styleUrls  : ['./deploy-service-dialog.component.scss']
})
export class DeployServiceDialogComponent implements OnInit {

  constructor(
    private projectFacade: ProjectFacade,
    private projectBriefFacade: ProjectBriefFacade,
    private http: HttpClient,
    protected dialogRef: TriDialogRef<any>
  ) {
  }

  formData = {
    envContent: ''
  };

  ngOnInit(): void {
    combineLatest(
      [
        this.projectFacade.activeProjectId$
      ]
    ).pipe(
      switchMap(([viewId]) => {
        return this.http.get(`/api/workbench/get-deploy-env/${viewId}`).pipe();
      }),
      tap((data: any) => {
        this.formData.envContent = data.envContent || '';
      })
    ).subscribe();

  }

  onRestart() {
    combineLatest(
      [
        this.projectFacade.activeProjectId$
      ]
    ).pipe(
      switchMap(([viewId]) => {
        return this.http.post(`/api/workbench/deploy-restart-service/${viewId}`, {
          envContent: this.formData.envContent
        });
      }),
      tap((data) => {
        this.dialogRef.close(data);
      })
    ).subscribe();
  }




}
