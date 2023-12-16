import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OvenApp, OvenPage } from '@common';

import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { BakeryApp } from '@tools-state/app/app.model';
import { environment } from '../../environments/environment';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { CommunicationService } from '@shared/communication/communication.service';

@Injectable()
export class AdminService {
  private projects = new BehaviorSubject([]);
  projects$: Observable<ProjectBrief[]> = this.projects.asObservable();

  private pages = new BehaviorSubject([]);
  pages$: Observable<OvenPage[]> = this.pages.asObservable();

  constructor(
    private http: HttpClient,
    private converter: StateConverterService,
    private communication: CommunicationService
  ) {
  }

  navigate(url: string) {
    this.communication.changeActivePage(url);
  }

  loadProjects(email: string): void {
    this.http
      .get<ProjectBrief[]>(`${environment.apiUrl}/project/by-email/${email}`)
      .subscribe((projects: ProjectBrief[]) => {
        this.projects.next(projects);
      });
  }

  loadProject(id: string): void {
    this.http
      .get(`${environment.apiUrl}/project/${id}`)
      .pipe(
        map((response: any) => JSON.parse(response.project.model)),
        map((app: BakeryApp) => this.converter.convertState(app))
      )
      .subscribe((app: OvenApp) => {
        this.communication.showDevUI(false);
        this.communication.sendState(app);
        this.communication.changeActivePage(app.pageList[0].url);

        const pages = this.flattenPages(app.pageList, null);
        this.pages.next(pages);
      });
  }

  private flattenPages(pages: OvenPage[], parent: OvenPage): OvenPage[] {
    const pagesToProcess: OvenPage[] = [...pages];
    const res: OvenPage[] = [];
    const prefix = parent ? parent.url : '';

    for (const page of pagesToProcess) {
      page.url = prefix + '/' + page.url;
      res.push(page);

      if (page.pageList) {
        res.push(...this.flattenPages(page.pageList, page));
      }
    }

    return res;
  }
}
